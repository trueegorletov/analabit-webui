// Presentation Layer Hook - Applications management
// Uses repositories and domain services
// DEPRECATED: Use useEnrichedApplications for new code

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  useApplicationRepository,
  useHeadingRepository,
  useResultsRepository,
} from '../../application/DataProvider';
import { enrichApplications } from '../../domain/services/calculatePasses';
import type { Application } from '../../domain/models';

interface UseApplicationsOptions {
  limit?: number;
  offset?: number;
  studentId?: string;
  varsityCode?: string;
  headingId?: number;
  includeResults?: boolean; // Whether to enrich with passes/otherUnlv
  pageSize?: number; // For pagination support
  currentPage?: number; // For pagination support
}

interface UseApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// New interfaces for cursor-based pagination
interface UseApplicationsPaginatedOptions {
  first?: number;
  after?: string;
  studentId?: string;
  varsityCode?: string;
  headingId?: number;
  run?: string | number;
  includeResults?: boolean;
}

interface UseApplicationsPaginatedReturn {
  applications: Application[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useApplications(options: UseApplicationsOptions = {}): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  // Memoize options to prevent unnecessary effect triggers  
  const memoizedOptions = useCallback(() => options, [options]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const opts = memoizedOptions();

      // Calculate pagination parameters
      const limit = opts.pageSize ? opts.pageSize : opts.limit;
      const offset = opts.currentPage && opts.pageSize
        ? (opts.currentPage - 1) * opts.pageSize
        : opts.offset;

      // Fetch applications
      const rawApplications = await applicationRepo.getApplications({
        limit,
        offset,
        studentId: opts.studentId,
        varsityCode: opts.varsityCode,
        headingId: opts.headingId,
      });

      if (!opts.includeResults) {
        setApplications(rawApplications);
        return;
      }

      // If we need enriched data, fetch headings and results
      const [headings, results] = await Promise.all([
        headingRepo.getHeadings({
          varsityCode: opts.varsityCode,
        }),
        resultsRepo.getResults({
          headingIds: opts.headingId ? String(opts.headingId) : undefined,
          varsityCode: opts.varsityCode,
          primary: 'latest',
          drained: 'all',
        }),
      ]);

      // Enrich applications with derived properties
      const enrichedApplications = enrichApplications(
        rawApplications,
        results,
        headings,
      );

      setApplications(enrichedApplications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [memoizedOptions, applicationRepo, headingRepo, resultsRepo]);

  // Use stable dependencies - no repository objects in the dependency array
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
}

/**
 * Hook specifically for fetching a single student's applications
 */
export function useStudentApplications(studentId: string): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applicationRepo = useApplicationRepository();

  const fetchStudentApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const studentApplications = await applicationRepo.getStudentApplications(studentId);
      setApplications(studentApplications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [studentId, applicationRepo]);

  useEffect(() => {
    if (studentId) {
      fetchStudentApplications();
    }
  }, [studentId, fetchStudentApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchStudentApplications,
  };
}

/**
 * New hook for cursor-based pagination
 */
export function useApplicationsPaginated(options: UseApplicationsPaginatedOptions = {}): UseApplicationsPaginatedReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: '' });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  const memoizedOptions = useCallback(() => options, [options]);

  const fetchApplications = useCallback(async (cursor?: string, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const opts = memoizedOptions();

      // Fetch paginated applications
      const result = await applicationRepo.getApplicationsPaginated({
        first: opts.first || 20,
        after: cursor || opts.after,
        studentId: opts.studentId,
        varsityCode: opts.varsityCode,
        headingId: opts.headingId,
        run: opts.run,
      });

      let finalApplications = result.applications;

      if (opts.includeResults && finalApplications.length > 0) {
        // If we need enriched data, fetch headings and results
        const [headings, results] = await Promise.all([
          headingRepo.getHeadings({
            varsityCode: opts.varsityCode,
          }),
          resultsRepo.getResults({
            headingIds: opts.headingId ? String(opts.headingId) : undefined,
            varsityCode: opts.varsityCode,
            primary: 'latest',
            drained: 'all',
          }),
        ]);

        // Enrich applications with derived properties
        finalApplications = enrichApplications(
          result.applications,
          results,
          headings,
        );
      }

      if (append) {
        setApplications(prev => [...prev, ...finalApplications]);
      } else {
        setApplications(finalApplications);
      }
      
      setPageInfo(result.pageInfo);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      if (!append) {
        setApplications([]);
        setPageInfo({ hasNextPage: false, endCursor: '' });
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [memoizedOptions, applicationRepo, headingRepo, resultsRepo]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && !isLoadingMore) {
      await fetchApplications(pageInfo.endCursor, true);
    }
  }, [fetchApplications, pageInfo.hasNextPage, pageInfo.endCursor, isLoadingMore]);

  const refetch = useCallback(async () => {
    await fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    pageInfo,
    totalCount,
    loading: loading || isLoadingMore,
    error,
    refetch,
    loadMore,
  };
}

/**
 * New hook for cursor-based student applications
 */
export function useStudentApplicationsPaginated(
  studentId: string,
  options: { first?: number; after?: string; run?: string | number } = {}
): UseApplicationsPaginatedReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: '' });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const applicationRepo = useApplicationRepository();

  const fetchStudentApplications = useCallback(async (cursor?: string, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const result = await applicationRepo.getStudentApplicationsPaginated(studentId, {
        first: options.first || 20,
        after: cursor || options.after,
        run: options.run,
      });

      if (append) {
        setApplications(prev => [...prev, ...result.applications]);
      } else {
        setApplications(result.applications);
      }
      
      setPageInfo(result.pageInfo);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch student applications');
      if (!append) {
        setApplications([]);
        setPageInfo({ hasNextPage: false, endCursor: '' });
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [studentId, options, applicationRepo]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && !isLoadingMore) {
      await fetchStudentApplications(pageInfo.endCursor, true);
    }
  }, [fetchStudentApplications, pageInfo.hasNextPage, pageInfo.endCursor, isLoadingMore]);

  const refetch = useCallback(async () => {
    await fetchStudentApplications();
  }, [fetchStudentApplications]);

  useEffect(() => {
    if (studentId) {
      fetchStudentApplications();
    }
  }, [studentId, fetchStudentApplications]);

  return {
    applications,
    pageInfo,
    totalCount,
    loading: loading || isLoadingMore,
    error,
    refetch,
    loadMore,
  };
}