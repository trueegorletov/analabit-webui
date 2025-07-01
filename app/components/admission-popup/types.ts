export interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null;
}

export interface UniversitySection {
  university: string;
  code: string;
  programs: ProgramRow[];
  highlightPriority?: number;
} 