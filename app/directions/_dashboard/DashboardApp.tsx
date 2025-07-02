'use client';

import React from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AdmissionInfo from './components/AdmissionInfo';
import DrainedResults from './components/DrainedResults';
import Legend from './components/Legend';
import ApplicationsList from './components/ApplicationsList';
import { drainedResultsData } from './constants';

export default function DashboardApp() {
  return (
    <main className="min-h-screen">
      {/* Enhanced dashboard with improved spacing and visual hierarchy */}
      
      {/* Main dashboard stats and info */}
      <div className="dashboard-container">
        <Header />
        <StatsOverview />
        <AdmissionInfo passingScore={282} admittedRank={135} />
        <DrainedResults data={drainedResultsData} />
      </div>

      {/* Applications list */}
      <div className="dashboard-container mt-8">
        <ApplicationsList />
        
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
