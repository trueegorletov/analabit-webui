import React from 'react';

interface AdmissionInfoProps {
  passingScore: number;
  admittedRank: number;
  regularsAdmitted: boolean;
}

export default function AdmissionInfo({
  passingScore,
  admittedRank,
  regularsAdmitted,
}: AdmissionInfoProps) {
  const displayPassing = regularsAdmitted ? passingScore : 'БВИ';
  const displayRank = admittedRank;
  return (
    <div className="flex justify-between items-start gap-4 xs:gap-6 sm:gap-8 mb-10 px-4">
      {/* Passing Score */}
      <div className="text-center sm:text-left flex-1 group">
        <div className="relative">
          <p className="text-xs xs:text-sm text-gray-400 uppercase tracking-wider font-medium mb-2 xs:mb-3">
            <span>Проходной</span>{' '}
            <span className="block xs:inline">балл</span>
          </p>
          <div className="relative">
            <p className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white transition-all duration-300 group-hover:text-green-400" 
               style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
              {displayPassing}
            </p>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
              {displayPassing}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Separator */}
      <div className="w-px h-14 xs:h-16 bg-gradient-to-b from-transparent via-white/15 to-transparent self-stretch" />

      {/* Admitted Rank */}
      <div className="text-center sm:text-right flex-1 group">
        <div className="relative">
          <p className="text-xs xs:text-sm text-gray-400 uppercase tracking-wider font-medium mb-2 xs:mb-3">
            <span>Ранг</span>{' '}
            <span className="block xs:inline">зачисленного</span>
          </p>
          <div className="relative">
            <p className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white transition-all duration-300 group-hover:text-violet-400" 
               style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)' }}>
              {displayRank}
            </p>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-violet-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
              {displayRank}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
