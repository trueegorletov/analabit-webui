'use client'

import React from 'react'
import Header from './components/Header'
import StatsOverview from './components/StatsOverview'
import AdmissionInfo from './components/AdmissionInfo'
import DrainedResults from './components/DrainedResults'
import Legend from './components/Legend'
import ApplicationsList from './components/ApplicationsList'
import { applicationsData, drainedResultsData } from './constants'

export default function DashboardApp () {
  // Dashboard relies solely on the global Tailwind build; no runtime CSS injection.

  return (
    <>
      {/* First container - matches home page structure */}
      <div className='dashboard-container'>
        <Header />
        <StatsOverview passingScore={282} admittedRank={135} />
        <div className='hidden md:block'>
          <AdmissionInfo passingScore={282} admittedRank={135} />
        </div>
        <DrainedResults data={drainedResultsData} />
      </div>

      {/* Second container - matches home page structure with spacing */}
      <div className='dashboard-container mt-8'>
        <ApplicationsList applications={applicationsData} />
        {/* Legend component added here with top margin */}
        <div className='mt-6'>
          <Legend />
        </div>
      </div>
      
      <div className='pb-8'></div>
    </>
  )
}