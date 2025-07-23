import React from 'react';
import { FlairButton } from './FlairButton';
import type { UniversitySection } from './types';

interface PopupHeaderProps {
  studentId: string;
  mainStatus: string;
  originalKnown: boolean;
  originalUniversityCode: string | null;
  allSections: UniversitySection[];
  onClose: () => void;
}

export const PopupHeader: React.FC<PopupHeaderProps> = ({ studentId, mainStatus, originalKnown, originalUniversityCode, allSections, onClose }) => {
  // Find the original university section
  const originalSection = originalKnown && originalUniversityCode 
    ? allSections.find(section => section.code === originalUniversityCode)
    : null;

  const originalMessage = originalKnown && originalSection ? (
    <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
      <span className="text-gray-300">Оригинал в</span>
      <FlairButton code={originalSection.code} label={originalSection.university} onClick={onClose} />
    </div>
  ) : (
    <p className="text-sm sm:text-base text-gray-400">Абитуриент ещё не подал оригинал аттестата</p>
  );

  return (
    <div className="relative z-10 text-center space-y-2">
      <span className="block text-base text-gray-400 font-medium tracking-widest">{studentId}</span>
      <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        {mainStatus}
      </h2>
      {originalMessage}
    </div>
  );
};