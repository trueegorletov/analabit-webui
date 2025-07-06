export interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null;
  headingId: number;
}

export interface UniversitySection {
  university: string;
  code: string;
  programs: ProgramRow[];
  highlightPriority?: number | null;
}

export interface PopupNavigationProps {
  currentHeadingId?: number;
  onClose?: () => void;
} 