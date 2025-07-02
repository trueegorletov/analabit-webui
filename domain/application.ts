export enum OrigCeltStatus {
  YES, // Green check circle
  NO, // Yellow dot
  UNKNOWN, // Question mark inside circle
  OTHER, // Cross inside circle (original in other university)
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
  passes?: boolean; // indicates passing to direction
}

export interface DrainedResultItem {
  label: string;
  '33%': string;
  '50%': string;
  '66%': string;
  '100%': string;
} 