'use client';

import React, { useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AdmissionInfo from './components/AdmissionInfo';
import DrainedResults from './components/DrainedResults';
import Legend from './components/Legend';
import ApplicationsList from './components/ApplicationsList';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';
import { useResults } from '@/presentation/hooks/useResults';
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

  // Get drained results loading state for critical data check
  const { loading: drainedLoading } = useResults({
    headingIds: headingId ? String(headingId) : undefined,
    varsityCode,
    drained: 'all',
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
  const isCriticalDataLoading = (headingData ? false : statsLoading) || drainedLoading;

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
        <StatsOverview headingId={headingId} varsityCode={varsityCode} headingData={headingData} />
        <AdmissionInfo
          passingScore={stats.passingScore}
          admittedRank={stats.admittedRank}
        />
        <DrainedResults headingId={headingId} varsityCode={varsityCode} />
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
