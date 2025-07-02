// Import types from domain model
import { 
  OrigCeltStatus, 
  AdmissionDecision, 
  Application, 
  DrainedResultItem, 
} from '@/domain/application';
import { fetchApplications, fetchDrainedResults } from '@/lib/__mocks__/dashboard';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

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

// Helper function to calculate stats from applications
function toStats(): DashboardStats {
  // TODO: Calculate stats from applications when backend is ready
  return {
    total: 182,
    special: 60,
    targeted: 24,
    separate: 12,
    passingScore: undefined, // Will be filled later when we have real data
    admittedRank: undefined, // Will be filled later when we have real data
  };
}

export function useDashboardStats(): DashboardStats {
  const { data = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return useMemo(() => toStats(), [data]);
}

// Re-export for convenience
export { OrigCeltStatus, AdmissionDecision };
export type { Application, DrainedResultItem };

export function useApplications(): {
  applications: Application[];
  drainedResults: DrainedResultItem[];
  isLoading: boolean;
  error: Error | null;
} {
  // 1. Fetch base data once via React-Query
  const {
    data: baseApps = [],
    isLoading: appsLoading,
    error: appsError,
  } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Deterministically extend only when baseApps changes
  const applications = useMemo(() => {
    const extended: Application[] = [...baseApps];
    for (let i = 200; i < 230; i++) {
      extended.push({
        rank: i,
        studentId: String(10000000000 + i),
        priority: 20 + (i % 10),
        score: 260 - (i % 30),
        origCelt: i % 3 === 0 ? OrigCeltStatus.UNKNOWN : i % 3 === 1 ? OrigCeltStatus.NO : OrigCeltStatus.YES,
        otherUnlv: i % 5,
        admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
      });
    }
    return extended;
  }, [baseApps]);

  const {
    data: drainedResults = [],
    isLoading: drainedLoading,
    error: drainedError,
  } = useQuery({
    queryKey: ['drainedResults'],
    queryFn: fetchDrainedResults,
    staleTime: 5 * 60 * 1000,
  });

  return {
    applications,
    drainedResults,
    isLoading: appsLoading || drainedLoading,
    error: appsError || drainedError || null,
  };
}
