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
  // Dashboard now uses two separate glass panel containers like the original design

  return (
    <main>
      {/* First container - Main dashboard stats and info */}
      <div className="dashboard-container">
        <Header />
        <StatsOverview />
        <AdmissionInfo passingScore={282} admittedRank={135} />
        <DrainedResults data={drainedResultsData} />
      </div>

      {/* Second container - Applications list and legend */}
      <div className="dashboard-container mt-8">
        <ApplicationsList />
        {/* Legend component with top margin */}
        <div className="mt-6">
          <Legend />
        </div>
      </div>

      <div className="pb-8"></div>
    </main>
  );
}
