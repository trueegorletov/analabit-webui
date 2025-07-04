// Presentation Layer Hook - Results and Drained Results
// Uses repositories to fetch step-wise admission and statistical data

'use client';

import { useState, useEffect } from 'react';
import { useResultsRepository } from '../../application/DataProvider';
import type { Results, DrainedResult } from '../../domain/models';

interface UseResultsOptions {
  headingIds?: string;
  varsityCode?: string;
  primary?: string;
  drained?: string;
  run?: string;
}

interface ProcessedDrainedData {
  section: string;
  rows: Array<{
    metric: string;
    [key: string]: string;
  }>;
}

interface UseResultsReturn {
  results: Results | null;
  processedDrainedData: ProcessedDrainedData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and processing results data including drained statistics
 */
export function useResults(options: UseResultsOptions = {}): UseResultsReturn {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resultsRepo = useResultsRepository();

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedResults = await resultsRepo.getResults({
        headingIds: options.headingIds,
        varsityCode: options.varsityCode,
        primary: options.primary || 'latest',
        drained: options.drained || 'all',
        run: options.run || 'latest',
      });

      setResults(fetchedResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [
    options.headingIds,
    options.varsityCode,
    options.primary,
    options.drained,
    options.run,
  ]);

  // Process drained results into table format
  const processedDrainedData = results ? processDrainedResults(results.drained) : [];

  return {
    results,
    processedDrainedData,
    loading,
    error,
    refetch: fetchResults,
  };
}

/**
 * Process drained results into the format expected by the DrainedResults component
 */
function processDrainedResults(drainedResults: DrainedResult[]): ProcessedDrainedData[] {
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