import React from 'react';

interface AdmissionInfoProps {
  passingScore: number;
  admittedRank: number;
}

export default function AdmissionInfo({
  passingScore,
  admittedRank,
}: AdmissionInfoProps) {
  return (
    <div className="flex flex-row justify-between items-center gap-4 mb-8 px-4">
      <div className="text-center md:text-left flex-1">
        <p className="text-sm text-gray-400 mb-2">Проходной балл</p>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{passingScore}</p>
      </div>
      <div className="text-center md:text-right flex-1">
        <p className="text-sm text-gray-400 mb-2">Ранг зачисленного</p>
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">#{admittedRank}</p>
      </div>
    </div>
  );
}
