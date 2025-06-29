// University API Types
export interface University {
  id: number;
  code: string;
  name: string;
}

export interface Direction {
  id: string;
  name: string;
  score: number;
  rank: string;
  range: string;
  universityCode: string;
}

export interface UniversityDirections {
  universityCode: string;
  directions: Direction[];
}

// API Response Types
export interface UniversitiesApiResponse {
  universities: University[];
}

export interface DirectionsApiResponse {
  universityCode: string;
  directions: Direction[];
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface UniversityDirectionsState extends LoadingState {
  directions: Direction[];
}

// Cache structure for directions
export interface DirectionsCache {
  [universityCode: string]: UniversityDirectionsState;
} 