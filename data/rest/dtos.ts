// DTOs - Data Transfer Objects that match the API response structure
// These represent the exact shape of data coming from the API

export interface VarsityDto {
  id: number;
  code: string;
  name: string;
}

export interface HeadingDto {
  id: number;
  code: string;
  name: string;
  regular_capacity: number;
  target_quota_capacity: number;
  dedicated_quota_capacity: number;
  special_quota_capacity: number;
  varsity_code: string;
  varsity?: {
    id: number;
    code: string;
    name: string;
  };
}

export interface ApplicationDto {
  id: number;
  student_id: string;
  priority: number;
  competition_type: string;
  rating_place: number;
  score: number;
  run_id: number;
  updated_at: string;
  heading_id: number;
  // New fields from PUBLIC_API_REFERENCE
  original_submitted: boolean;
  original_quit: boolean;
  passing_now: boolean;
  passing_to_more_priority: boolean;
  another_varsities_count: number;
  // MSU internal ID support
  msu_internal_id?: string;
}

export interface PrimaryResultDto {
  heading_id: number;
  /** Optional legacy code field retained for transitional compatibility */
  heading_code?: string;
  /** Latest passing score for the current primary (run_id) calculation */
  passing_score: number;
  /** Rating place of the last admitted entrant for the primary calculation */
  last_admitted_rating_place: number;
  run_id: number;
  regulars_admitted: boolean;
}

export interface DrainedResultDto {
  heading_id: number;
  /** @deprecated kept for backward compatibility */
  heading_code?: string;
  drained_percent: number;
  avg_passing_score: number;
  min_passing_score: number;
  max_passing_score: number;
  med_passing_score: number;
  avg_last_admitted_rating_place: number;
  min_last_admitted_rating_place: number;
  max_last_admitted_rating_place: number;
  med_last_admitted_rating_place: number;
  run_id: number;
  regulars_admitted: boolean;
}

export interface ResultsDto {
  steps: Record<string, number[]>;
  /** Map of heading ID → primary result object (not an array) */
  primary: Record<string, PrimaryResultDto>;
  drained: Record<string, DrainedResultDto[]>;
  /** Optional timestamp when the run was finished (ISO string) */
  run_finished_at?: string;
}

// Cursor-based pagination structures (Relay-style)
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface ApplicationEdge {
  node: ApplicationDto;
  cursor: string;
}

export interface ApplicationsConnection {
  edges: ApplicationEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

// API Response wrapper types (arrays for list endpoints)
export type VarsitiesResponse = VarsityDto[];
export type HeadingsResponse = HeadingDto[];
// Updated to support both legacy array and new connection format
export type ApplicationsResponse = ApplicationDto[] | ApplicationsConnection;