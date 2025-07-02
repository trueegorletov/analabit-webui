import React from 'react';
import { DrainedResultItem } from '../types';

interface DrainedResultsProps {
  data: DrainedResultItem[];
}

export default function DrainedResults({ data }: DrainedResultsProps) {
  const percentages = ['33%', '50%', '66%', '100%'];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Ослабленные результаты
      </h2>
      
      {/* Modern grid-based table similar to popup styling */}
      <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-5 text-xs sm:text-sm">
          {/* Header */}
          <div className="contents text-gray-400 uppercase tracking-wider text-[10px] sm:text-xs font-medium">
            <div className="px-3 py-3 bg-white/5"></div> {/* Empty corner */}
            {percentages.map((p) => (
              <div key={p} className="px-3 py-3 text-center bg-white/5">
                {p}
              </div>
            ))}
          </div>
          
          {/* Body rows */}
          {data.map((item, index) => (
            <div key={item.label} className={`col-span-5 grid grid-cols-subgrid transition-colors ${
              index % 2 === 0 ? 'hover:bg-gray-700/30' : 'bg-black/10 hover:bg-gray-700/30'
            }`}>
              <div className="px-3 py-2.5 text-sm text-gray-300 font-medium">
                {item.label}
              </div>
              <div className="px-3 py-2.5 text-sm text-gray-100 text-center font-mono">
                {item['33%']}
              </div>
              <div className="px-3 py-2.5 text-sm text-gray-100 text-center font-mono">
                {item['50%']}
              </div>
              <div className="px-3 py-2.5 text-sm text-gray-100 text-center font-mono">
                {item['66%']}
              </div>
              <div className="px-3 py-2.5 text-sm text-gray-100 text-center font-mono">
                {item['100%']}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
