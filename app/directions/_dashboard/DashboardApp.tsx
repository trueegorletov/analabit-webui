'use client';

import React from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AdmissionInfo from './components/AdmissionInfo';
import DrainedResults from './components/DrainedResults';
import Legend from './components/Legend';
import ApplicationsList from './components/ApplicationsList';
import { useDashboardStats } from '@/presentation/hooks/useDashboardStats';

interface DashboardAppProps {
  directionId?: string;
  headingId?: number;
  varsityCode?: string;
  headingName?: string;
  varsityName?: string;
}

export default function DashboardApp({ 
  headingId, 
  varsityCode,
  headingName,
  varsityName,
}: Omit<DashboardAppProps, 'directionId'> = {}) {
  // Get dashboard stats including passing score and admitted rank
  const { stats } = useDashboardStats({ headingId, varsityCode });

  return (
    <main className="min-h-screen">
      {/* Enhanced dashboard with improved spacing and visual hierarchy */}
      
      {/* Main dashboard stats and info */}
      <div className="dashboard-container">
        <Header headingName={headingName} varsityCode={varsityCode} varsityName={varsityName} />
        <StatsOverview headingId={headingId} varsityCode={varsityCode} />
        <AdmissionInfo 
          passingScore={stats.passingScore}
          admittedRank={stats.admittedRank}
        />
        <DrainedResults headingId={headingId} varsityCode={varsityCode} />
      </div>

      {/* Applications list */}
      <div className="dashboard-container mt-1 sm:mt-2 md:mt-8">
        <ApplicationsList headingId={headingId} varsityCode={varsityCode} />
        
        {/* Legend with improved spacing and typography */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <Legend />
        </div>
      </div>

      {/* Bottom spacing for better visual balance */}
      <div className="pb-8"></div>
    </main>
  );
}
