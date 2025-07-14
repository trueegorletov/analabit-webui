import { useQuery } from '@tanstack/react-query';
import { useResultsRepository } from '@/application/DataProvider';

import { PERFORMANCE_CONFIG } from '@/app/directions/_dashboard/constants';

interface DrainedResult {
  drainedPercent: number;
  minPassingScore: number;
  maxPassingScore: number;
  avgPassingScore: number;
  medPassingScore: number;
  minLastAdmittedRatingPlace: number;
  maxLastAdmittedRatingPlace: number;
  avgLastAdmittedRatingPlace: number;
  medLastAdmittedRatingPlace: number;
}

interface PrimaryResult {
  passingScore: number;
  lastAdmittedRatingPlace: number;
}

import type { QueryFunctionContext } from '@tanstack/react-query';

type UnifiedResultsParams = {
  headingId?: number;
  varsityCode?: string;
  run?: string;
};

export interface UnifiedResults {
  primary: PrimaryResult[];
  drained: DrainedResult[];
  passingScore?: number;
  admittedRank?: number;
  processedDrainedData: { section: string; rows: { metric: string; [key: string]: string }[] }[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function processDrainedResults(drainedResults: DrainedResult[]): { section: string; rows: { metric: string; [key: string]: string }[] }[] {
  if (drainedResults.length === 0) {
    return [];
  }

  // Group results by drained percent and extract unique steps
  const drainedSteps = [...new Set(drainedResults.map(r => r.drainedPercent))].sort((a, b) => a - b);

  // Helper function to find result for a specific drained percent
  const findResult = (drainedPercent: number) => 
    drainedResults.find(r => r.drainedPercent === drainedPercent);

  // Build the table data structure
  const tableData = [
    {
      section: 'Проходной балл',
      rows: [
        {
          metric: 'Минимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.minPassingScore?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Максимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.maxPassingScore?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Средний',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.avgPassingScore?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Медианный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.medPassingScore?.toString() ?? '—'];
          })),
        },
      ],
    },
    {
      section: 'Ранг',
      rows: [
        {
          metric: 'Минимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.minLastAdmittedRatingPlace?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Максимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.maxLastAdmittedRatingPlace?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Средний',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.avgLastAdmittedRatingPlace?.toString() ?? '—'];
          })),
        },
        {
          metric: 'Медианный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.medLastAdmittedRatingPlace?.toString() ?? '—'];
          })),
        },
      ],
    },
  ];

  return tableData;
}

function derivePrimaryResults(primary: PrimaryResult[]): { passingScore?: number; admittedRank?: number } {
  if (primary.length === 0) return { passingScore: undefined, admittedRank: undefined };
  const latest = primary[0];
  return {
    passingScore: latest.passingScore,
    admittedRank: latest.lastAdmittedRatingPlace,
  };
}

export function useUnifiedResults({ headingId, varsityCode, run }: UnifiedResultsParams): UnifiedResults {
  const resultsRepo = useResultsRepository();

  const queryKey = ['unifiedResults', headingId, varsityCode, run];

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async ({ queryKey }: QueryFunctionContext) => {
      const [, hId, vCode, r] = queryKey;
      return resultsRepo.getResults({
        headingIds: hId ? String(hId) : undefined,
        varsityCode: vCode as string | undefined,
        primary: 'latest',
        drained: 'all',
        run: r as string | undefined,
      });
    },
    staleTime: PERFORMANCE_CONFIG.STALE_TIME_MS,
    gcTime: PERFORMANCE_CONFIG.CACHE_TIME_MS,
  });

  const primary = data?.primary || [];
  const drained = data?.drained || [];

  const { passingScore, admittedRank } = derivePrimaryResults(primary);
  const processedDrainedData = processDrainedResults(drained);

  return {
    primary,
    drained,
    passingScore,
    admittedRank,
    processedDrainedData,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}