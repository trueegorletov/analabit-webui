import React from 'react';
import { FlairButton } from './FlairButton';
import { ProbabilityTabs } from './ProbabilityTabs';
import { ProgramTable } from './ProgramTable';
import type { UniversitySection as Section, ProgramRow } from './types';

interface RuntimeState {
  selectedTab: string;
  loading: boolean;
  programs: ProgramRow[];
  highlightPriority: number | null;
}

interface UniversitySectionProps {
  section: Section;
  runtime: RuntimeState;
  probabilityTabs: string[];
  onTabSelect: (sectionCode: string, tab: string) => void;
  onFlairClick: (code: string) => void;
}

export const UniversitySection: React.FC<UniversitySectionProps> = ({ section, runtime, probabilityTabs, onTabSelect, onFlairClick }) => {
  const dirName = runtime.highlightPriority !== null
    ? runtime.programs.find((p) => p.priority === runtime.highlightPriority)?.name
    : null;

  const isNotPassing = runtime.highlightPriority === null;

  return (
    <section id={section.code} className="mt-4 first:mt-0">
      {/* Flair + current direction row */}
      <div className="flex flex-col items-start md:flex-row md:flex-wrap md:items-center md:justify-between gap-3 mb-3">
        <FlairButton code={section.code} label={section.university} onClick={() => onFlairClick(section.code)} />
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 flex items-center justify-center rounded flex-shrink-0 ${isNotPassing ? 'bg-red-600/90' : 'bg-violet-600/90'
            }`}>
            {isNotPassing ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </div>
          <span className="text-sm sm:text-base font-medium">
            {runtime.loading ? (
              <span className="inline-block h-4 w-20 sm:w-24 bg-white/20 rounded animate-pulse" />
            ) : isNotPassing ? (
              <span className="text-red-400">Не проходит</span>
            ) : (
              dirName
            )}
          </span>
        </div>
      </div>

      {/* Program Table */}
      <ProgramTable programs={runtime.programs} highlightPriority={runtime.highlightPriority} loading={runtime.loading} />

      {/* Probability Tabs under table with info text */}
      <div className="mt-4">
        <p className="text-gray-400 text-sm mb-2">При оттоке оригиналов на:</p>
        <ProbabilityTabs
          tabs={probabilityTabs}
          selected={runtime.selectedTab}
          onSelect={(val) => onTabSelect(section.code, val)}
        />
      </div>
    </section>
  );
}; 