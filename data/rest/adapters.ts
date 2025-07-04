// Adapters - Convert API DTOs to Domain Models
// Centralizes field mapping and transformation logic

import type {
  Varsity,
  Heading,
  Application,
  PrimaryResult,
  DrainedResult,
  Results,
} from '../../domain/models';

import type {
  VarsityDto,
  HeadingDto,
  ApplicationDto,
  PrimaryResultDto,
  DrainedResultDto,
  ResultsDto,
} from './dtos';

export function adaptVarsity(dto: VarsityDto): Varsity {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
  };
}

export function adaptHeading(dto: HeadingDto): Heading {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    regularCapacity: dto.regular_capacity,
    targetQuotaCapacity: dto.target_quota_capacity,
    dedicatedQuotaCapacity: dto.dedicated_quota_capacity,
    specialQuotaCapacity: dto.special_quota_capacity,
    varsityCode: dto.varsity_code,
  };
}

export function adaptApplication(dto: ApplicationDto): Application {
  return {
    id: dto.id,
    studentId: dto.student_id,
    priority: dto.priority,
    competitionType: dto.competition_type,
    ratingPlace: dto.rating_place,
    score: dto.score,
    iteration: dto.iteration,
    updatedAt: dto.updated_at,
    headingId: dto.heading_id,
    // Derived properties will be computed separately
    // TODO: Add origCelt field when available from API
  };
}

export function adaptPrimaryResult(dto: PrimaryResultDto): PrimaryResult {
  return {
    headingId: dto.heading_id,
    headingCode: dto.heading_code,
    passingScore: dto.passing_score,
    lastAdmittedRatingPlace: dto.last_admitted_rating_place,
    iteration: dto.iteration,
  };
}

export function adaptDrainedResult(dto: DrainedResultDto): DrainedResult {
  return {
    headingId: dto.heading_id,
    headingCode: dto.heading_code,
    drainedPercent: dto.drained_percent,
    avgPassingScore: dto.avg_passing_score,
    minPassingScore: dto.min_passing_score,
    maxPassingScore: dto.max_passing_score,
    medPassingScore: dto.med_passing_score,
    avgLastAdmittedRatingPlace: dto.avg_last_admitted_rating_place,
    minLastAdmittedRatingPlace: dto.min_last_admitted_rating_place,
    maxLastAdmittedRatingPlace: dto.max_last_admitted_rating_place,
    medLastAdmittedRatingPlace: dto.med_last_admitted_rating_place,
    iteration: dto.iteration,
  };
}

export function adaptResults(dto: ResultsDto): Results {
  // Safeguard against missing fields in responses
  const rawSteps = dto.steps || {};
  const rawPrimary = dto.primary || {};
  const rawDrained = dto.drained || {};

  const steps: Record<number, number[]> = {};
  Object.entries(rawSteps).forEach(([key, value]) => {
    steps[parseInt(key, 10)] = value;
  });

  const primary: PrimaryResult[] = Object.values(rawPrimary).map(adaptPrimaryResult);

  const drained: DrainedResult[] = [];
  Object.values(rawDrained).forEach(list => {
    if (Array.isArray(list)) {
      drained.push(...list.map(adaptDrainedResult));
    }
  });

  return {
    steps,
    primary,
    drained,
  };
}

// Array adapters
export function adaptVarsities(dtos: VarsityDto[]): Varsity[] {
  return dtos.map(adaptVarsity);
}

export function adaptHeadings(dtos: HeadingDto[]): Heading[] {
  return dtos.map(adaptHeading);
}

export function adaptApplications(dtos: ApplicationDto[]): Application[] {
  return dtos.map(adaptApplication);
} 