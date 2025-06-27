
export enum OrigCeltStatus {
  YES, // Green check circle
  NO,  // Yellow dot
}

export enum AdmissionDecision {
  ADMITTED_TEXT,    // Green text "Admitted"
  NOT_COMPETING_TEXT, // Yellow text "Not competing"
  ADMITTED_GREEN_CHECK,  // Simple green check icon
}

export interface Application {
  rank: number;
  studentId: string;
  priority: number;
  score: number;
  origCelt: OrigCeltStatus;
  otherUnlv?: number | 'check'; // Number or a placeholder for black check
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
