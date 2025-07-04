// Domain Models - Pure business entities with no framework dependencies

export interface Varsity {
  id: number;
  code: string;
  name: string;
}

export interface Heading {
  id: number;
  code: string;
  name: string;
  regularCapacity: number;
  targetQuotaCapacity: number;
  dedicatedQuotaCapacity: number;
  specialQuotaCapacity: number;
  varsityCode: string;
}

export interface Application {
  id: number;
  studentId: string;
  priority: number;
  competitionType: number;
  ratingPlace: number;
  score: number;
  iteration: number;
  updatedAt: string;
  headingId: number;
  // Derived properties (computed client-side)
  passes?: boolean;
  otherUnlv?: number;
}

export interface PrimaryResult {
  /**
   * Numeric identifier of the heading this result belongs to (matches `/api/results` map key).
   */
  headingId: number;
  /**
   * Optional legacy human-readable heading code kept for transitional compatibility.
   */
  headingCode?: string;
  /** Latest passing score for the heading (primary calculation). */
  passingScore: number;
  /** Rating place of the last admitted entrant for the primary calculation. */
  lastAdmittedRatingPlace: number;
  iteration: number;
}

export interface DrainedResult {
  /**
   * Numeric identifier of the heading this result belongs to (matches `/api/results` map key).
   */
  headingId: number;
  /**
   * Optional legacy human-readable heading code kept for transitional compatibility.
   */
  headingCode?: string;
  drainedPercent: number;
  avgPassingScore: number;
  minPassingScore: number;
  maxPassingScore: number;
  medPassingScore: number;
  avgLastAdmittedRatingPlace: number;
  minLastAdmittedRatingPlace: number;
  maxLastAdmittedRatingPlace: number;
  medLastAdmittedRatingPlace: number;
  iteration: number;
}

export interface ResultStep {
  headingId: number;
  steps: number[];
}

export interface Results {
  steps: Record<number, number[]>;
  primary: PrimaryResult[];
  drained: DrainedResult[];
} 