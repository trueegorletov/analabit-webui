// Dashboard-specific types reflecting the new data flow architecture

import type { ProcessedDrainedData } from '@/presentation/hooks/useResults'; // Assuming this is where ProcessedDrainedData is defined

export interface DashboardStats {
  capacity: {
    total: number;
    special: number;
    targeted: number;
    separate: number;
  };
}

export interface AdmissionInfoProps {
  passingScore: number;
  admittedRank: number;
}

export interface DrainedResultsProps {
  processedDrainedData: ProcessedDrainedData[];
  loading: boolean;
  error: string | null;
}

// Re-export types from the shared domain model
export type {
  Application,
  DrainedResultItem,
} from '@/domain/application';

export {
  OrigCeltStatus,
  AdmissionDecision,
} from '@/domain/application';
