import React from 'react';
import { FlairButton } from './FlairButton';
import type { UniversitySection } from './types';
import { prettifyStudentId } from '@/data/rest/adapters';

interface PopupHeaderProps {
  studentId: string;
  msuInternalId?: string;
  mainStatus: string;
  originalKnown: boolean;
  originalUniversityCode: string | null;
  allSections: UniversitySection[];
  onClose: () => void;
}

export const PopupHeader: React.FC<PopupHeaderProps> = ({ studentId, msuInternalId, mainStatus, originalKnown, originalUniversityCode, allSections, onClose }) => {
  // Format the student ID according to the new rules
  const formatStudentId = () => {
    if (!msuInternalId) {
      // No MSU internal ID - show student ID only
      return studentId;
    }
    
    // Both IDs exist - check if they're equal after prettifying
    const prettifiedStudentId = prettifyStudentId(studentId);
    const prettifiedMsuId = prettifyStudentId(msuInternalId);
    
    if (prettifiedStudentId === prettifiedMsuId) {
      // Equal after prettifying - show only @msu_internal_id
      return `@${prettifiedMsuId}`;
    } else {
      // Different - show student_id (@msu_internal_id)
      return `${prettifiedStudentId} (@${prettifiedMsuId})`;
    }
  };
  
  const displayId = formatStudentId();
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
      <span className="block text-base text-gray-400 font-medium tracking-widest">{displayId}</span>
      <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
        {mainStatus}
      </h2>
      {originalMessage}
    </div>
  );
};