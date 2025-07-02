import React from 'react';
import { CircleCheck, Circle } from 'lucide-react';

export default function Legend() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider sm:mr-4">
        Обозначения:
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <CircleCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
          <span className="text-sm text-gray-300 font-medium">Проходит по Celt</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Circle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
          <span className="text-sm text-gray-300 font-medium">Не проходит по Celt</span>
        </div>
      </div>
    </div>
  );
}
