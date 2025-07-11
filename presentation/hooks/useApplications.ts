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