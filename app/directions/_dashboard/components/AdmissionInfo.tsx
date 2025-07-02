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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 mb-10 px-4">
      {/* Passing Score */}
      <div className="text-center sm:text-left flex-1 group">
        <div className="relative">
          <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium mb-3">
            Проходной балл
          </p>
          <div className="relative">
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-white transition-all duration-300 group-hover:text-green-400" 
               style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
              {passingScore}
            </p>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
              {passingScore}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      {/* Admitted Rank */}
      <div className="text-center sm:text-right flex-1 group">
        <div className="relative">
          <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium mb-3">
            Ранг зачисленного
          </p>
          <div className="relative">
            <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-white transition-all duration-300 group-hover:text-violet-400" 
               style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
              #{admittedRank}
            </p>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-bold text-violet-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
              #{admittedRank}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
