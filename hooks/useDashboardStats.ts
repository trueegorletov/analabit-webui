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

export function useDashboardStats(): DashboardStats {
  // In a real app, this would fetch from an API
  // For now, returning the same hardcoded data but in a structured way
  return {
    total: 182,
    special: 60,
    targeted: 24,
    separate: 12,
    passingScore: undefined, // Will be filled later when we have real data
    admittedRank: undefined, // Will be filled later when we have real data
  };
} 