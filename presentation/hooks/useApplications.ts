// Presentation Layer Hook - Applications management
// Uses repositories and domain services

'use client';

import { useState, useEffect } from 'react';
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch applications
      const rawApplications = await applicationRepo.getApplications({
        limit: options.limit,
        offset: options.offset,
        studentId: options.studentId,
        varsityCode: options.varsityCode,
        headingId: options.headingId,
      });

      if (!options.includeResults) {
        setApplications(rawApplications);
        return;
      }

      // If we need enriched data, fetch headings and results
      const [headings, results] = await Promise.all([
        headingRepo.getHeadings(),
        resultsRepo.getResults(),
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
  };

  useEffect(() => {
    fetchApplications();
  }, [
    options.limit,
    options.offset,
    options.studentId,
    options.varsityCode,
    options.headingId,
    options.includeResults,
  ]);

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

  const fetchStudentApplications = async () => {
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
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentApplications();
    }
  }, [studentId]);

  return {
    applications,
    loading,
    error,
    refetch: fetchStudentApplications,
  };
} 