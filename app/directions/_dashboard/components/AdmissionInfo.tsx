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
    <div className="flex justify-between items-center mb-8 px-4">
      <div>
        <p className="text-sm text-gray-400">Проходной балл</p>
        <p className="text-5xl font-bold text-white">{passingScore}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Ранг зачисленного</p>
        <p className="text-5xl font-bold text-white">#{admittedRank}</p>
      </div>
    </div>
  );
}
