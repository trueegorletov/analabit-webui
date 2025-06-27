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
  // Dashboard now uses unified container system for consistency with main page

  return (
    <main>
      {/* First container - unified styling with main page */}
      <div className="container">
        <Header />
        <StatsOverview />
        <div className="hidden md:block">
          <AdmissionInfo passingScore={282} admittedRank={135} />
        </div>
        <DrainedResults data={drainedResultsData} />
      </div>

      {/* Second container - unified styling and spacing */}
      <div className="container">
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
