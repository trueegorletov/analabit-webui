// Presentation Layer Hook - Results and Drained Results
// Uses repositories to fetch step-wise admission and statistical data

'use client';

import { useUnifiedResults } from './useUnifiedResults';
import type { Results, DrainedResult } from '../../domain/models';


interface UseResultsOptions {
  headingIds?: string;
  varsityCode?: string;
  primary?: string;
  drained?: string;
  run?: string;
}

export interface ProcessedDrainedData {
  section: string;
  rows: Array<Record<string, string | number>>;
}

interface UseResultsReturn {
  results: Results | null;
  processedDrainedData: ProcessedDrainedData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// DEPRECATED: Use useUnifiedResults instead for new code

/**
 * Hook for fetching and processing results data including drained statistics
 */
export function useResults(options: UseResultsOptions = {}): UseResultsReturn {
  const { drained, processedDrainedData, loading, error, refetch } = useUnifiedResults({
    headingId: options.headingIds ? Number(options.headingIds) : undefined,
    varsityCode: options.varsityCode,
    run: options.run,
  });

  // Adapt to original Results type, focusing on drained
  const adaptedResults: Results | null = {
    steps: {}, // Not used in original
    primary: [], // Primary not needed for drained focus
    drained: (drained || []).map(d => ({ ...d, headingId: Number(options.headingIds) || 0, runId: Number(options.run) || 0 })),
  };

  return {
    results: adaptedResults,
    processedDrainedData,
    loading,
    error,
    refetch,
  };
}

/**
 * Process drained results into the format expected by the DrainedResults component
 */
// Keep existing processDrainedResults function as is
export function processDrainedResults(drainedResults: DrainedResult[]): ProcessedDrainedData[] {
  if (drainedResults.length === 0) {
    return [];
  }

  // Group results by drained percent and extract unique steps
  const drainedSteps = [...new Set(drainedResults.map(r => r.drainedPercent))].sort((a, b) => a - b);

  // Helper function to find result for a specific drained percent
  const findResult = (drainedPercent: number) => 
    drainedResults.find(r => r.drainedPercent === drainedPercent);

  // Build the table data structure
  const tableData: ProcessedDrainedData[] = [
    {
      section: 'Проходной балл',
      rows: [
        {
          metric: 'Минимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.minPassingScore?.toString() || '—'];
          })),
        },
        {
          metric: 'Максимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.maxPassingScore?.toString() || '—'];
          })),
        },
        {
          metric: 'Средний',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.avgPassingScore?.toString() || '—'];
          })),
        },
        {
          metric: 'Медианный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.medPassingScore?.toString() || '—'];
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
            return [`${step}%`, result?.minLastAdmittedRatingPlace?.toString() || '—'];
          })),
        },
        {
          metric: 'Максимальный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.maxLastAdmittedRatingPlace?.toString() || '—'];
          })),
        },
        {
          metric: 'Средний',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.avgLastAdmittedRatingPlace?.toString() || '—'];
          })),
        },
        {
          metric: 'Медианный',
          ...Object.fromEntries(drainedSteps.map(step => {
            const result = findResult(step);
            return [`${step}%`, result?.medLastAdmittedRatingPlace?.toString() || '—'];
          })),
        },
      ],
    },
  ];

  return tableData;
}