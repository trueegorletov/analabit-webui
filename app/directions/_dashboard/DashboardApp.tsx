'use client';

import React, { useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AdmissionInfo from './components/AdmissionInfo';
import DrainedResults from './components/DrainedResults';
import Legend from './components/Legend';
import ApplicationsList from './components/ApplicationsList';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';
import { useUnifiedResults } from '@/presentation/hooks/useUnifiedResults';
import { CriticalLoadingScreen } from '@/app/components/LoadingComponents';
import ScrollReset from './ScrollReset';

import type { Heading } from '@/domain/models';

interface DashboardAppProps {
  directionId?: string;
  headingId?: number;
  varsityCode?: string;
  headingName?: string;
  varsityName?: string;
  headingData?: Heading;
}

export default function DashboardApp({
  headingId,
  varsityCode,
  headingName,
  varsityName,
  headingData,
}: Omit<DashboardAppProps, 'directionId'> = {}) {
  // Get dashboard stats including passing score and admitted rank
  const { stats, loading: statsLoading } = useDashboardStats({
    headingId,
    varsityCode,
    headingData,
  });

  // Use unified results for both primary and drained data
  const { passingScore, admittedRank, processedDrainedData, loading: unifiedLoading, error: unifiedError } = useUnifiedResults({
    headingId,
    varsityCode,
  });

  // Ensure the page always starts at the top, regardless of browser scroll restoration
  useEffect(() => {
    // Scroll to top immediately on mount
    window.scrollTo(0, 0);

    // Also disable browser scroll restoration to prevent interference
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Check if critical data is still loading
  // If headingData is provided, stats should load immediately (basic capacity data)
  // Only wait for applications/results if no headingData or if specifically needed
  const isCriticalDataLoading = (headingData ? false : statsLoading) || unifiedLoading;

  // Show loading screen while critical data loads
  if (isCriticalDataLoading) {
    return (
      <CriticalLoadingScreen
        message="Загружаем данные направления..."
        subMessage="Подождите, это займет несколько секунд"
      />
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollReset />
      {/* Enhanced dashboard with improved spacing and visual hierarchy */}

      {/* Main dashboard stats and info */}
      <div className="dashboard-container">
        <Header headingName={headingName} varsityCode={varsityCode} varsityName={varsityName} />
        <StatsOverview capacity={stats.capacity} />
        <AdmissionInfo
          passingScore={passingScore}
          admittedRank={admittedRank}
        />
        <DrainedResults processedDrainedData={processedDrainedData} loading={unifiedLoading} error={unifiedError} />
      </div>

      {/* Applications list */}
      <div className="dashboard-container-secondary">
        <ApplicationsList headingId={headingId} varsityCode={varsityCode} />

        {/* Legend with improved spacing and typography */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <Legend />
        </div>
      </div>

      {/* Bottom spacing for better visual balance */}
      <div className="pb-8"></div>
    </div>
  );
}
