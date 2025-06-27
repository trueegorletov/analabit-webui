
import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { YellowDotIcon } from './icons/YellowDotIcon';

const Legend: React.FC = () => {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-200 mb-2">Legend</h3>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-300">Admitted</span>
        </div>
        <div className="flex items-center space-x-2">
          <YellowDotIcon className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">Not competing</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
