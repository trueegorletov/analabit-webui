import React from 'react';
import { CircleCheck, Circle } from 'lucide-react';

export default function Legend() {
  return (
    <div className="flex justify-center space-x-6 text-sm">
      <div className="flex items-center space-x-2">
        <CircleCheck className="w-5 h-5 text-green-500" />
        <span className="text-gray-300">Проходит по Celt</span>
      </div>
      <div className="flex items-center space-x-2">
        <Circle className="w-5 h-5 text-yellow-500" />
        <span className="text-gray-300">Не проходит по Celt</span>
      </div>
    </div>
  );
}
