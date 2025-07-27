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
  regularsAdmitted: boolean;
}

interface PrimaryResult {
  passingScore: number;
  lastAdmittedRatingPlace: number;
  regularsAdmitted: boolean;
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
  regularsAdmitted?: boolean;
  processedDrainedData: { section: string; rows: { metric: string; [key: string]: string | number }[] }[];
  runFinishedAt?: Date;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function processDrainedResults(drainedResults: DrainedResult[]): { section: string; rows: { metric: string; [key: string]: string | number }[] }[] {
  if (drainedResults.length === 0) {
    return [];
  }

  const drainedSteps = [...new Set(drainedResults.map(r => r.drainedPercent))].sort((a, b) => a - b);

  const findResult = (drainedPercent: number) => drainedResults.find(r => r.drainedPercent === drainedPercent);

  const regularsAdmittedMap = Object.fromEntries(
    drainedSteps.map(step => [step, findResult(step)?.regularsAdmitted ?? false])
  );

  const createRow = (metric: string, getValue: (result: DrainedResult | undefined) => number | undefined, isPassingScore = false) => ({
    metric,
    ...Object.fromEntries(drainedSteps.map(step => {
      const result = findResult(step);
      if (!regularsAdmittedMap[step] && isPassingScore) {
        return [`${step}%`, 'БВИ'];
      }
      return [`${step}%`, getValue(result)?.toString() ?? '—'];
    })),
  });

  const tableData = [
    {
      section: 'Проходной балл',
      rows: [
        createRow('Минимальный', r => r?.minPassingScore, true),
        createRow('Максимальный', r => r?.maxPassingScore, true),
        createRow('Средний', r => r?.avgPassingScore, true),
        createRow('Медианный', r => r?.medPassingScore, true),
      ],
    },
    {
      section: 'Ранг',
      rows: [
        createRow('Минимальный', r => r?.minLastAdmittedRatingPlace, false),
        createRow('Максимальный', r => r?.maxLastAdmittedRatingPlace, false),
        createRow('Средний', r => r?.avgLastAdmittedRatingPlace, false),
        createRow('Медианный', r => r?.medLastAdmittedRatingPlace, false),
      ],
    },
  ];

  return tableData;
}

function derivePrimaryResults(primary: PrimaryResult[]): { passingScore?: number; admittedRank?: number; regularsAdmitted?: boolean } {
  if (primary.length === 0) return { passingScore: undefined, admittedRank: undefined, regularsAdmitted: undefined };
  const latest = primary[0];
  return {
    passingScore: latest.passingScore,
    admittedRank: latest.lastAdmittedRatingPlace,
    regularsAdmitted: latest.regularsAdmitted,
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

  const { passingScore, admittedRank, regularsAdmitted } = derivePrimaryResults(primary);
  const processedDrainedData = processDrainedResults(drained);

  return {
    primary,
    drained,
    passingScore,
    admittedRank,
    regularsAdmitted,
    processedDrainedData,
    runFinishedAt: data?.runFinishedAt,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  };
}