
import React from 'react';

interface StatCircleProps {
  value: number;
  label: string;
}

const StatCircle: React.FC<StatCircleProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-[#25252D] rounded-full w-28 h-28 p-2">
      <span className="text-3xl font-bold text-white">{value}</span>
      <span className="text-xs text-gray-400 mt-1">{label}</span>
    </div>
  );
};

const StatsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <StatCircle value={182} label="Total" />
      <StatCircle value={60} label="Special" />
      <StatCircle value={24} label="Targeted" />
      <StatCircle value={12} label="Separate" />
    </div>
  );
};

export default StatsOverview;
