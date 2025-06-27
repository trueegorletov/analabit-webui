
import React from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AdmissionInfo from './components/AdmissionInfo';
import DrainedResults from './components/DrainedResults';
import Legend from './components/Legend';
import ApplicationsList from './components/ApplicationsList';
import { applicationsData, drainedResultsData } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-100 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Top Card */}
        <div className="bg-[#1C1C22] p-6 rounded-xl shadow-2xl">
          <Header />
          <StatsOverview />
          <AdmissionInfo passingScore={282} admittedRank={135} />
          <DrainedResults data={drainedResultsData} />
          {/* Legend component removed from here */}
        </div>

        {/* Bottom Card */}
        <div className="bg-[#1C1C22] p-6 rounded-xl shadow-2xl">
          <ApplicationsList applications={applicationsData} />
          {/* Legend component added here with top margin */}
          <div className="mt-6">
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
