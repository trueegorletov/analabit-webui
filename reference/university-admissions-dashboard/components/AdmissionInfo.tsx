import React from 'react';

interface AdmissionInfoProps {
  passingScore: number;
  admittedRank: number;
}

const AdmissionInfo: React.FC<AdmissionInfoProps> = ({
  passingScore,
  admittedRank,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 px-4">
      <div>
        <p className="text-sm text-gray-400">Passing score</p>
        <p className="text-5xl font-bold text-white">{passingScore}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Admitted rank</p>
        <p className="text-5xl font-bold text-white">#{admittedRank}</p>
      </div>
    </div>
  );
};

export default AdmissionInfo;
