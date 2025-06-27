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

// Application-related types and hook
export enum OrigCeltStatus {
  YES, // Green check circle
  NO, // Yellow dot
}

export enum AdmissionDecision {
  ADMITTED_TEXT, // Green text "Admitted"
  NOT_COMPETING_TEXT, // Yellow text "Not competing"
  ADMITTED_GREEN_CHECK, // Simple green check icon
}

export interface Application {
  rank: number;
  studentId: string;
  priority: number;
  score: number;
  origCelt: OrigCeltStatus;
  otherUnlv?: number | 'check';
  admission: AdmissionDecision;
  isCurrentUser?: boolean;
}

export interface DrainedResultItem {
  label: string;
  '33%': string;
  '50%': string;
  '66%': string;
  '100%': string;
}

export function useApplications(): {
  applications: Application[];
  drainedResults: DrainedResultItem[];
} {
  // In a real app, this would fetch from an API
  // For now, returning the same hardcoded data
  const applications: Application[] = [
    {
      rank: 102,
      studentId: '14023456789',
      priority: 23,
      score: 293,
      origCelt: OrigCeltStatus.YES,
      otherUnlv: 'check',
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 103,
      studentId: '19325868878',
      priority: 24,
      score: 293,
      origCelt: OrigCeltStatus.NO,
      otherUnlv: 3,
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 120,
      studentId: '07885312033',
      priority: 24,
      score: 282,
      origCelt: OrigCeltStatus.YES,
      otherUnlv: 'check',
      admission: AdmissionDecision.ADMITTED_TEXT,
    },
    {
      rank: 137,
      studentId: '05833459218',
      priority: 24,
      score: 282,
      origCelt: OrigCeltStatus.YES,
      otherUnlv: 1,
      admission: AdmissionDecision.ADMITTED_TEXT,
      isCurrentUser: true,
    },
    {
      rank: 134,
      studentId: '09793918939',
      priority: 24,
      score: 182,
      origCelt: OrigCeltStatus.NO,
      otherUnlv: 'check',
      admission: AdmissionDecision.NOT_COMPETING_TEXT,
    },
    // Additional applications for testing
    {
      rank: 140,
      studentId: '11223344556',
      priority: 25,
      score: 281,
      origCelt: OrigCeltStatus.YES,
      otherUnlv: 'check',
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 141,
      studentId: '22334455667',
      priority: 22,
      score: 280,
      origCelt: OrigCeltStatus.NO,
      otherUnlv: 2,
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 145,
      studentId: '33445566778',
      priority: 26,
      score: 279,
      origCelt: OrigCeltStatus.YES,
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 150,
      studentId: '44556677889',
      priority: 23,
      score: 275,
      origCelt: OrigCeltStatus.YES,
      otherUnlv: 'check',
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
    {
      rank: 152,
      studentId: '55667788990',
      priority: 24,
      score: 274,
      origCelt: OrigCeltStatus.NO,
      admission: AdmissionDecision.ADMITTED_GREEN_CHECK,
    },
  ];

  const drainedResults: DrainedResultItem[] = [
    {
      label: 'Проходной балл',
      '33%': '284-58',
      '50%': '284-48',
      '66%': '255-49',
      '100%': '255-62',
    },
    {
      label: 'Ранг',
      '33%': '262-68',
      '50%': '262-56',
      '66%': '264-65',
      '100%': '265-70',
    },
  ];

  return { applications, drainedResults };
}
