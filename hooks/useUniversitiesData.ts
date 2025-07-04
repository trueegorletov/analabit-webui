import { useState, useEffect, useCallback, useRef } from 'react';
import { useVarsityRepository, useHeadingRepository, useResultsRepository } from '../application/DataProvider';
import type { Varsity } from '../domain/models';

// Local types (previously imported from lib/api/types - temporarily here until main page API integration)
type University = Varsity;

interface Direction {
  id: string;
  name: string;
  score: number;
  rank: number | string;
  range: string;
  universityCode: string;
}

interface UniversityDirectionsState {
  isLoading: boolean;
  error: string | null;
  directions: Direction[];
}

interface DirectionsCache {
  [universityCode: string]: UniversityDirectionsState;
}

interface UseUniversitiesDataReturn {
  // Universities data (critical)
  universities: University[];
  universitiesLoading: boolean;
  universitiesError: string | null;
  retryCount: number;
  
  // Directions data (preloaded)
  directionsCache: DirectionsCache;
  directionsPreloading: boolean;
  
  // Actions
  fetchUniversityDirections: (universityCode: string) => Promise<void>;
  refreshUniversities: () => Promise<void>;
  scrollToUniversity: (universityCode: string) => boolean;
}

export function useUniversitiesData(): UseUniversitiesDataReturn {
  const varsityRepo = useVarsityRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  // Universities state (critical - must load before showing main UI)
  const [universities, setUniversities] = useState<University[]>([]);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);
  const [universitiesError, setUniversitiesError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Directions cache state (preloaded after universities load)
  const [directionsCache, setDirectionsCache] = useState<DirectionsCache>({});
  const [directionsPreloading, setDirectionsPreloading] = useState(false);
  
  // Track which directions are currently being fetched to prevent duplicate requests
  const fetchingDirections = useRef<Set<string>>(new Set());
  const universitiesLoaded = useRef(false);

  // Infinite retry mechanism for universities (critical data)
  const fetchUniversitiesWithRetry = useCallback(async () => {
    let attempts = 0;
    const maxRetryDelay = 10000; // 10 seconds max delay
    
    const attemptFetch = async (): Promise<void> => {
      attempts++;
      setRetryCount(attempts);
      
      try {
        setUniversitiesLoading(true);
        setUniversitiesError(null);
        
        // Only log the first attempt and then every 5th attempt to reduce console noise
        if (attempts === 1) {
          console.log('Starting university data fetch...');
        } else if (attempts % 5 === 0) {
          console.log(`University fetch attempt ${attempts} (continuing retries silently)...`);
        }
        
        const universitiesData = await varsityRepo.getVarsities();
        
        console.log(`✅ Successfully loaded ${universitiesData.length} universities`);
        setUniversities(universitiesData);
        setUniversitiesLoading(false);
        universitiesLoaded.current = true;
        
        return; // Success - exit retry loop
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch universities';
        setUniversitiesError(errorMessage);
        
        // Only log errors for the first few attempts to reduce console noise
        if (attempts <= 3) {
          console.warn(`University fetch attempt ${attempts} failed:`, errorMessage);
        } else if (attempts % 5 === 0) {
          console.warn(`University fetch attempt ${attempts} failed (retrying silently)`);
        }
        
        // Calculate exponential backoff delay (1s, 2s, 4s, 8s, 10s, 10s, ...)
        const delay = Math.min(1000 * Math.pow(2, attempts - 1), maxRetryDelay);
        
        // Only log retry delays for first few attempts
        if (attempts <= 3) {
          console.log(`Retrying in ${delay}ms...`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Continue retrying indefinitely
        return attemptFetch();
      }
    };
    
    return attemptFetch();
  }, [varsityRepo]);

  // Fetch directions for a specific university (for user-initiated requests)
  const fetchUniversityDirections = useCallback(async (universityCode: string) => {
    // Prevent duplicate requests
    if (fetchingDirections.current.has(universityCode)) {
      return;
    }

    // Check if already loaded successfully
    const existing = directionsCache[universityCode];
    if (existing && !existing.error && existing.directions.length > 0) {
      return;
    }

    // Auto-retry logic with exponential backoff
    const maxRetries = 3;
    let currentAttempt = 0;

    const attemptFetch = async (): Promise<void> => {
      currentAttempt++;
      
      try {
        fetchingDirections.current.add(universityCode);
        
        // Set loading state with retry info
        setDirectionsCache(prev => ({
          ...prev,
          [universityCode]: {
            isLoading: true,
            error: null,
            directions: [],
          },
        }));

        // Fetch headings and results in parallel
        const [headings, results] = await Promise.all([
          headingRepo.getHeadings({ varsityCode: universityCode }),
          resultsRepo.getResults({ varsityCode: universityCode, primary: 'latest', drained: '100' }),
        ]);

        const primaryByHeading: Record<number, import('../domain/models').PrimaryResult | undefined> = {};
        results.primary.forEach(pr => {
          primaryByHeading[pr.headingId] = pr;
        });

        const drained100ByHeading: Record<number, import('../domain/models').DrainedResult | undefined> = {};
        results.drained.filter(d => d.drainedPercent === 100).forEach(d => {
          drained100ByHeading[d.headingId] = d;
        });

        const directions = headings.map(heading => {
          const primary = primaryByHeading[heading.id];
          const drained100 = drained100ByHeading[heading.id];
          const passingScore = primary?.passingScore ?? 0;
          const minScore = drained100?.minPassingScore;
          const range = minScore !== undefined ? `${passingScore}..${minScore}` : '';
          return {
            id: String(heading.id),
            name: heading.name,
            score: passingScore,
            rank: primary?.lastAdmittedRatingPlace ?? '-',
            range,
            universityCode: heading.varsityCode,
          } as Direction;
        });

        const directionsData = {
          universityCode,
          directions,
        };
        
        // Set success state
        setDirectionsCache(prev => ({
          ...prev,
          [universityCode]: {
            isLoading: false,
            error: null,
            directions: directionsData.directions,
          },
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch directions';
        
        // Retry if under the limit
        if (currentAttempt < maxRetries) {
          console.log(`Retrying directions fetch for ${universityCode} (attempt ${currentAttempt + 1}/${maxRetries})`);
          
          // Remove from fetching set to allow retry
          fetchingDirections.current.delete(universityCode);
          
          // Wait with exponential backoff, then retry
          setTimeout(() => {
            attemptFetch();
          }, 1000 * currentAttempt); // 1s, 2s, 3s delays
          
          return;
        }
        
        // Max retries reached, set error state
        setDirectionsCache(prev => ({
          ...prev,
          [universityCode]: {
            isLoading: false,
            error: errorMessage,
            directions: [],
          },
        }));
        
        console.error(`Failed to fetch directions for university ${universityCode} after ${maxRetries} attempts:`, error);
      } finally {
        if (currentAttempt >= maxRetries || directionsCache[universityCode]?.directions.length > 0) {
          fetchingDirections.current.delete(universityCode);
        }
      }
    };

    return attemptFetch();
  }, [directionsCache, headingRepo, resultsRepo]);

  // Background preload - silently handle failures without console errors
  const preloadUniversityDirectionsQuietly = useCallback(async (universityCode: string) => {
    // Skip if already loading or loaded successfully
    if (fetchingDirections.current.has(universityCode)) {
      return;
    }

    const existing = directionsCache[universityCode];
    if (existing && !existing.error && existing.directions.length > 0) {
      return;
    }

    try {
      fetchingDirections.current.add(universityCode);
      
      // Set loading state only if not already set
      setDirectionsCache(prev => {
        if (!prev[universityCode]) {
          return {
            ...prev,
            [universityCode]: {
              isLoading: true,
              error: null,
              directions: [],
            },
          };
        }
        return prev;
      });

      // Fetch headings and results in parallel for silent preload
      const [headings, results] = await Promise.all([
        headingRepo.getHeadings({ varsityCode: universityCode }),
        resultsRepo.getResults({ varsityCode: universityCode, primary: 'latest', drained: '100' }),
      ]);

      const primaryByHeading: Record<number, import('../domain/models').PrimaryResult | undefined> = {};
      results.primary.forEach(pr => { primaryByHeading[pr.headingId] = pr; });

      const drainedMap: Record<number, import('../domain/models').DrainedResult | undefined> = {};
      results.drained.filter(d => d.drainedPercent === 100).forEach(d => { drainedMap[d.headingId] = d; });

      const directions: Direction[] = headings.map(heading => {
        const primary = primaryByHeading[heading.id];
        const drained100 = drainedMap[heading.id];
        const pScore = primary?.passingScore ?? 0;
        const minScore = drained100?.minPassingScore;
        const range = minScore !== undefined ? `${pScore}..${minScore}` : '';
        return {
          id: String(heading.id),
          name: heading.name,
          score: pScore,
          rank: primary?.lastAdmittedRatingPlace ?? '-',
          range,
          universityCode: heading.varsityCode,
        };
      });

      const directionsData = { universityCode, directions };
      
      // Set success state
      setDirectionsCache(prev => ({
        ...prev,
        [universityCode]: {
          isLoading: false,
          error: null,
          directions: directionsData.directions,
        },
      }));
    } catch {
      // Silently handle preloading failures - they'll be retried when user requests
      // Don't log to console or set error state during background preloading
      setDirectionsCache(prev => ({
        ...prev,
        [universityCode]: {
          isLoading: false,
          error: null, // Don't set error for background failures
          directions: [],
        },
      }));
    } finally {
      fetchingDirections.current.delete(universityCode);
    }
  }, [headingRepo, resultsRepo]);

  // Preload all directions immediately after universities load
  const preloadAllDirections = useCallback(async () => {
    if (!universitiesLoaded.current || universities.length === 0) {
      return;
    }

    console.log(`Starting to preload directions for ${universities.length} universities...`);
    setDirectionsPreloading(true);

    try {
      // Load directions for all universities in parallel with silent error handling
      const preloadPromises = universities.map(university => 
        preloadUniversityDirectionsQuietly(university.code),
      );

      await Promise.allSettled(preloadPromises);
      console.log('Directions preloading completed');
    } catch (error) {
      // This should rarely happen since we're using Promise.allSettled and silent error handling
      console.error('Error during directions preloading:', error);
    } finally {
      setDirectionsPreloading(false);
    }
  }, [universities, preloadUniversityDirectionsQuietly]);

  // Smooth scroll to university block
  const scrollToUniversity = useCallback((universityCode: string): boolean => {
    const universityElement = document.querySelector(
      `.university-block[data-university-code="${universityCode}"]`,
    );

    if (!universityElement) {
      console.warn('[scrollToUniversity] element not found for', universityCode);
      return false;
    }
    console.log('[scrollToUniversity] Scrolling to', universityCode);
    universityElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const expandButton = universityElement.querySelector('[data-expand-button]') as HTMLElement | null;
    if (expandButton) {
      const expanded = expandButton.getAttribute('data-expanded') === 'true';
      if (!expanded) {
        expandButton.click();
        console.log('[scrollToUniversity] triggered expand click');
      }
    } else {
      console.warn('[scrollToUniversity] expand button not found');
    }
    return true;
  }, []);

  // Manual refresh universities
  const refreshUniversities = useCallback(async () => {
    universitiesLoaded.current = false;
    setUniversities([]);
    setDirectionsCache({});
    setRetryCount(0);
    await fetchUniversitiesWithRetry();
  }, [fetchUniversitiesWithRetry]);

  // Initialize critical data fetching on mount
  useEffect(() => {
    fetchUniversitiesWithRetry();
  }, [fetchUniversitiesWithRetry]);

  // Preload directions immediately after universities are loaded
  useEffect(() => {
    if (universities.length > 0 && universitiesLoaded.current) {
      // Small delay to let the UI render first
      const timeoutId = setTimeout(() => {
        preloadAllDirections();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [universities, preloadAllDirections]);

  return {
    universities,
    universitiesLoading,
    universitiesError,
    retryCount,
    directionsCache,
    directionsPreloading,
    fetchUniversityDirections,
    refreshUniversities,
    scrollToUniversity,
  };
} 