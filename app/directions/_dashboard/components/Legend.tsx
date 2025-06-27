import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { YellowDotIcon } from './icons/YellowDotIcon';

export default function Legend() {
  return (
    <div>
      <h3 className="text-md font-semibold text-gray-200 mb-2">Легенда</h3>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-300">Зачислен</span>
        </div>
        <div className="flex items-center space-x-2">
          <YellowDotIcon className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">Не конкурсует</span>
        </div>
      </div>
    </div>
  );
}
