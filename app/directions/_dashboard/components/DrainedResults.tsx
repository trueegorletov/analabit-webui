import React from 'react';
import { DrainedResultItem } from '../types';

interface DrainedResultsProps {
  data: DrainedResultItem[];
}

export default function DrainedResults({ data }: DrainedResultsProps) {
  const percentages = ['33%', '50%', '66%', '100%'];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-200 mb-3">
        Ослабленные результаты
      </h2>
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-x-4">
          <div className="text-sm text-gray-400" /> {/* Empty corner */}
          {percentages.map((p) => (
            <div
              key={p}
              className="text-sm text-gray-400 font-medium text-center"
            >
              {p}
            </div>
          ))}
        </div>
        {data.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-5 gap-x-4 items-center"
          >
            <div className="text-sm text-gray-300">{item.label}</div>
            <div className="text-sm text-gray-100 text-center">
              {item['33%']}
            </div>
            <div className="text-sm text-gray-100 text-center">
              {item['50%']}
            </div>
            <div className="text-sm text-gray-100 text-center">
              {item['66%']}
            </div>
            <div className="text-sm text-gray-100 text-center">
              {item['100%']}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
