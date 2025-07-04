// Presentation Layer Hook - Dashboard Statistics
// Uses repositories and domain services to calculate dashboard metrics

'use client';

import { useState, useEffect } from 'react';
import { 
  useApplicationRepository, 
  useHeadingRepository, 
  useResultsRepository, 
} from '../../application/DataProvider';
import { enrichApplications } from '../../domain/services/calculatePasses';
import type { Application, Results } from '../../domain/models';

export interface DashboardStat {
  value: number;
  label: string;
}

export interface DashboardStats {
  total: number;
  special: number;
  targeted: number;
  separate: number;
  passingScore?: number;
  admittedRank?: number;
}

interface UseDashboardStatsOptions {
  headingId?: number;
  varsityCode?: string;
}

interface UseDashboardStatsReturn {
  stats: DashboardStats;
  applications: Application[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(options: UseDashboardStatsOptions = {}): UseDashboardStatsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    special: 0,
    targeted: 0,
    separate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [rawApplications, headings, results] = await Promise.all([
        applicationRepo.getApplications({
          headingId: options.headingId,
          varsityCode: options.varsityCode,
        }),
        headingRepo.getHeadings({
          varsityCode: options.varsityCode,
        }),
        resultsRepo.getResults({
          headingIds: options.headingId ? String(options.headingId) : undefined,
          varsityCode: options.varsityCode,
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

      // Calculate dashboard statistics
      const calculatedStats = calculateDashboardStats(
        enrichedApplications,
        results,
        options.headingId,
        headings,
      );

      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      setApplications([]);
      setStats({
        total: 0,
        special: 0,
        targeted: 0,
        separate: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [options.headingId, options.varsityCode]);

  return {
    stats,
    applications,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}

/**
 * Calculate dashboard statistics from headings capacity data and results
 */
function calculateDashboardStats(
  applications: Application[],
  results: Results,
  headingId?: number,
  headings: import('../../domain/models').Heading[] = [],
): DashboardStats {
  // Find the relevant heading to get capacity data from
  let relevantHeading: import('../../domain/models').Heading | undefined;
  
  if (headingId && headings.length > 0) {
    relevantHeading = headings.find(h => h.id === headingId);
  } else if (headings.length === 1) {
    // If only one heading, use it
    relevantHeading = headings[0];
  }

  // Use heading capacity data if available, otherwise fallback to application counts
  let total: number;
  let special: number;
  let targeted: number;
  let separate: number;

  if (relevantHeading) {
    // Use the actual capacity data from the heading API endpoint
    total = relevantHeading.regularCapacity;
    special = relevantHeading.specialQuotaCapacity;
    targeted = relevantHeading.targetQuotaCapacity;
    separate = relevantHeading.dedicatedQuotaCapacity;
  } else {
    // Fallback to counting applications if heading data is not available
    if (applications.length === 0) {
      return {
        total: 0,
        special: 0,
        targeted: 0,
        separate: 0,
      };
    }

    total = applications.length;
    
    // Group by competition type (0 = regular, 1 = special, 2 = targeted, 3 = separate)
    const byCompetitionType = applications.reduce((acc, app) => {
      acc[app.competitionType] = (acc[app.competitionType] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    special = byCompetitionType[1] || 0;
    targeted = byCompetitionType[2] || 0;
    separate = byCompetitionType[3] || 0;
  }

  // Calculate passing score and admitted rank from results
  let passingScore: number | undefined;
  let admittedRank: number | undefined;

  if (results.primary.length > 0) {
    if (headingId) {
      const resultForHeading = results.primary.find(r => r.headingId === headingId);
      if (resultForHeading) {
        passingScore = resultForHeading.passingScore;
        admittedRank = resultForHeading.lastAdmittedRatingPlace;
      }
    } else {
      // If multiple headings (e.g., by varsity), take highest passing score
      const best = results.primary.reduce((acc, cur) => {
        if (!acc || cur.passingScore > acc.passingScore) return cur;
        return acc;
      }, undefined as typeof results.primary[0] | undefined);
      if (best) {
        passingScore = best.passingScore;
        admittedRank = best.lastAdmittedRatingPlace;
      }
    }
  }

  return {
    total,
    special,
    targeted,
    separate,
    passingScore,
    admittedRank,
  };
}

/**
 * Hook for fetching applications with enriched data
 * Replaces the legacy useApplications hook
 */
export function useEnrichedApplications(options: UseDashboardStatsOptions = {}) {
  const { applications, loading, error, refetch } = useDashboardStats(options);
  
  return {
    applications,
    isLoading: loading,
    error: error ? new Error(error) : null,
    refetch,
  };
} 