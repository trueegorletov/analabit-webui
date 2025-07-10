// Presentation Layer Hook - Dashboard Statistics
// Uses repositories and domain services to calculate dashboard metrics

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  useApplicationRepository,
  useHeadingRepository,
  useResultsRepository,
} from '../../application/DataProvider';
import { enrichApplications } from '../../domain/services/calculatePasses';
import type { Application, Results } from '../../domain/models';
import { useQuery } from '@tanstack/react-query';

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
  headingData?: import('../../domain/models').Heading;
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

  // If headingData is provided, immediately set basic capacity stats
  useEffect(() => {
    if (options.headingData) {
      setStats({
        total: options.headingData.regularCapacity,
        special: options.headingData.specialQuotaCapacity,
        targeted: options.headingData.targetQuotaCapacity,
        separate: options.headingData.dedicatedQuotaCapacity,
      });
      setLoading(false); // No need to show loading for basic capacity data
    }
  }, [options.headingData]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // If we have headingData, we don't need to show loading for basic stats
      if (!options.headingData) {
        setLoading(true);
      }
      setError(null);

      // Use pre-fetched heading data if available, otherwise fetch from API
      const headingsPromise = options.headingData
        ? Promise.resolve([options.headingData])
        : headingRepo.getHeadings({
          varsityCode: options.varsityCode,
        });

      // Fetch all data in parallel
      const [rawApplications, headings, results] = await Promise.all([
        applicationRepo.getApplications({
          headingId: options.headingId,
          varsityCode: options.varsityCode,
        }),
        headingsPromise,
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
      // If we have headingData, preserve the basic capacity stats on error
      if (!options.headingData) {
        setStats({
          total: 0,
          special: 0,
          targeted: 0,
          separate: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [options.headingId, options.varsityCode, options.headingData, applicationRepo, headingRepo, resultsRepo]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

    // Group by competition type (Regular, BVI, TargetQuota, DedicatedQuota, SpecialQuota)
    const byCompetitionType = applications.reduce((acc, app) => {
      acc[app.competitionType] = (acc[app.competitionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    special = byCompetitionType['BVI'] || 0;
    targeted = byCompetitionType['TargetQuota'] || 0;
    separate = byCompetitionType['DedicatedQuota'] || 0;
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
  const { headingId, varsityCode } = options;

  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  const {
    data: applications = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Application[]>({
    queryKey: [
      'enrichedApplications',
      options.headingId,
      options.varsityCode,
      applicationRepo,
      headingRepo,
      resultsRepo,
    ],
    queryFn: async () => {
      const { headingId, varsityCode } = options;

      // Fetch all data in parallel
      const [rawApplications, headings, results] = await Promise.all([
        applicationRepo.getApplications({
          headingId,
          varsityCode,
        }),
        // Fetch all headings for the varsity if no specific heading is requested
        headingRepo.getHeadings({ varsityCode }),
        resultsRepo.getResults({
          headingIds: headingId ? String(headingId) : undefined,
          varsityCode,
          primary: 'latest',
          drained: 'all',
        }),
      ]);

      if (!rawApplications || rawApplications.length === 0) {
        return [];
      }

      // Enrich applications with passing status
      const enriched = enrichApplications(rawApplications, results, headings);
      return enriched;
    },
    enabled: !!(options.headingId || options.varsityCode),
  });

  return {
    applications,
    isLoading,
    error: error ? error : null,
    refetch,
  };
}