'use client';

import React, { useReducer, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PopupHeader } from './PopupHeader';
import { UniversitySection } from './UniversitySection';
import type { UniversitySection as Section, ProgramRow } from './types';
import { useApplicationRepository, useResultsRepository } from '@/application/DataProvider';

export interface AdmissionStatusPopupProps {
  studentId: string;
  mainStatus: string;
  originalKnown?: boolean;
  passingSection: Section;
  probabilityTabs: string[];
  selectedProbabilityTab?: string;
  secondarySections?: Section[];
  onClose?: () => void;
}

type SectionState = {
  selectedTab: string;
  loading: boolean;
  programs: ProgramRow[];
  highlightPriority: number | null;
};

type State = Record<string, SectionState>;

type Action =
  | { type: 'TAB_CHANGE_START'; code: string; newTab: string }
  | { type: 'TAB_CHANGE_SUCCESS'; code: string; newTab: string; programs: ProgramRow[]; highlightPriority: number | null };

const sectionReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TAB_CHANGE_START':
      return {
        ...state,
        [action.code]: {
          ...state[action.code],
          selectedTab: action.newTab,
          loading: true,
        },
      };
    case 'TAB_CHANGE_SUCCESS':
      return {
        ...state,
        [action.code]: {
          ...state[action.code],
          selectedTab: action.newTab,
          loading: false,
          programs: action.programs,
          highlightPriority: action.highlightPriority,
        },
      };
    default:
      return state;
  }
};

export const AdmissionStatusPopup: React.FC<AdmissionStatusPopupProps> = ({
  studentId,
  mainStatus,
  originalKnown = true,
  passingSection,
  probabilityTabs,
  selectedProbabilityTab = '–',
  secondarySections = [],
  onClose,
}) => {
  // Repository hooks for API access
  const applicationRepo = useApplicationRepository();
  const resultsRepo = useResultsRepository();

  // Extract current headingId from URL for same-direction navigation handling
  const pathname = usePathname();
  const currentHeadingId = React.useMemo(() => {
    const match = pathname?.match(/^\/directions\/(\d+)$/);
    return match ? parseInt(match[1], 10) : undefined;
  }, [pathname]);

  // Initialize reducer state
  const initialState: State = React.useMemo(() => {
    const init: State = {};
    [passingSection, ...secondarySections].forEach((s) => {
      init[s.code] = {
        selectedTab: selectedProbabilityTab,
        loading: false,
        programs: s.programs,
        highlightPriority: s.highlightPriority ?? null,
      };
    });
    return init;
  }, [passingSection, secondarySections, selectedProbabilityTab]);

  const [sectionsState, dispatch] = useReducer(sectionReducer, initialState);

  // Accessibility: close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Handler for tab selection with real API integration
  const handleTabSelect = async (code: string, newTab: string) => {
    const current = sectionsState[code];
    if (!current || current.loading || current.selectedTab === newTab) return;

    dispatch({ type: 'TAB_CHANGE_START', code, newTab });

    try {
      // Get all heading IDs for this university section
      const allSections = [passingSection, ...secondarySections];
      const currentSection = allSections.find(s => s.code === code);
      if (!currentSection) {
        console.error(`Section with code ${code} not found`);
        return;
      }

      let newPrograms: ProgramRow[];
      let newHighlight: number | null;

      if (newTab === '–' || newTab === '--') {
        // Primary results logic: use applications API to check passing_now
        const studentApplications = await applicationRepo.getStudentApplications(studentId);

        // Filter applications for this university section
        const sectionApplications = studentApplications.filter(app => {
          return currentSection.programs.some(p =>
            // Find matching applications by comparing properties we have available
            app.priority === p.priority &&
            app.score === p.score &&
            app.ratingPlace === p.rank,
          );
        });

        // Sort by priority to find the first passing direction
        sectionApplications.sort((a, b) => a.priority - b.priority);
        const passingApp = sectionApplications.find(app => app.passingNow);
        newHighlight = passingApp ? passingApp.priority : null;

        // Create updated programs with deltas calculated from primary results
        const headingIds = sectionApplications.map(app => app.headingId);
        const results = await resultsRepo.getResults({
          headingIds: headingIds.join(','),
          primary: 'latest',
        });

        newPrograms = currentSection.programs.map(program => {
          const matchingApp = sectionApplications.find(app =>
            app.priority === program.priority &&
            app.score === program.score &&
            app.ratingPlace === program.rank,
          );

          if (!matchingApp) {
            return { ...program, delta: null };
          }

          const primaryResult = results.primary.find(r => r.headingId === matchingApp.headingId);
          if (!primaryResult) {
            return { ...program, delta: null };
          }

          // Calculate delta: if student rank <= last admitted rank, positive/zero; else negative
          const delta = primaryResult.lastAdmittedRatingPlace - matchingApp.ratingPlace;
          const deltaStr = delta === 0 ? undefined : delta > 0 ? `+${delta}` : `${delta}`;

          return {
            ...program,
            delta: deltaStr,
          };
        });

      } else {
        // Drained results logic: use results API with specific drain percentage
        const drainPercent = parseInt(newTab.replace('%', ''));

        // Get student applications to get their rating places and heading IDs
        const studentApplications = await applicationRepo.getStudentApplications(studentId);

        // Filter applications for this university section
        const sectionApplications = studentApplications.filter(app => {
          return currentSection.programs.some(p =>
            app.priority === p.priority &&
            app.score === p.score &&
            app.ratingPlace === p.rank,
          );
        });

        // Sort by priority
        sectionApplications.sort((a, b) => a.priority - b.priority);

        const headingIds = sectionApplications.map(app => app.headingId);
        const results = await resultsRepo.getResults({
          headingIds: headingIds.join(','),
          drained: drainPercent.toString(),
        });

        // Find the first direction where student passes (rank <= median last admitted rank)
        let passingApp = null;
        for (const app of sectionApplications) {
          const drainedResult = results.drained.find(d =>
            d.headingId === app.headingId && d.drainedPercent === drainPercent,
          );
          if (drainedResult && app.ratingPlace <= drainedResult.medLastAdmittedRatingPlace) {
            passingApp = app;
            break;
          }
        }

        newHighlight = passingApp ? passingApp.priority : null;

        // Create updated programs with deltas calculated from drained results
        newPrograms = currentSection.programs.map(program => {
          const matchingApp = sectionApplications.find(app =>
            app.priority === program.priority &&
            app.score === program.score &&
            app.ratingPlace === program.rank,
          );

          if (!matchingApp) {
            return { ...program, delta: null };
          }

          const drainedResult = results.drained.find(d =>
            d.headingId === matchingApp.headingId && d.drainedPercent === drainPercent,
          );

          if (!drainedResult) {
            return { ...program, delta: null };
          }

          // Calculate delta: if student rank <= median last admitted rank, positive/zero; else negative
          const delta = drainedResult.medLastAdmittedRatingPlace - matchingApp.ratingPlace;
          const deltaStr = delta === 0 ? undefined : delta > 0 ? `+${delta}` : `${delta}`;

          return {
            ...program,
            delta: deltaStr,
          };
        });
      }

      dispatch({
        type: 'TAB_CHANGE_SUCCESS',
        code,
        newTab,
        programs: newPrograms,
        highlightPriority: newHighlight,
      });

    } catch (error) {
      console.error('Error fetching data for tab change:', error);
      // Fallback to original programs on error
      dispatch({
        type: 'TAB_CHANGE_SUCCESS',
        code,
        newTab,
        programs: current.programs,
        highlightPriority: current.highlightPriority,
      });
    }
  };

  const allSections = [passingSection, ...secondarySections];

  return (
    <div className="popup-outer relative w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl overflow-hidden rounded-2xl backdrop-blur-lg bg-black/60 shadow-2xl ring-1 ring-white/10" data-testid="admission-popup">
      {/* decorative gradient border */}
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-transparent before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-fuchsia-500/30 before:via-violet-500/10 before:to-indigo-500/30 before:opacity-40"></span>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group backdrop-blur-sm"
        aria-label="Close popup"
      >
        <svg
          className="w-4 h-4 text-gray-100 group-hover:text-white transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Scrollable content wrapper */}
      <div className="popup-scroll overflow-x-hidden overflow-y-auto max-h-[90vh] p-4 sm:p-6 md:p-8 flex flex-col text-white">
        <PopupHeader
          studentId={studentId}
          mainStatus={mainStatus}
          originalKnown={originalKnown}
          passingSection={passingSection}
          onClose={onClose ?? (() => { })}
        />

        <hr className="my-2 border-white/10" />

        {allSections.map((section, idx) => (
          <React.Fragment key={section.code}>
            {idx !== 0 && <hr className="my-4 border-white/10" />}
            <UniversitySection
              section={section}
              runtime={sectionsState[section.code]}
              probabilityTabs={probabilityTabs}
              onTabSelect={handleTabSelect}
              onFlairClick={() => onClose?.()}
              currentHeadingId={currentHeadingId}
              onClose={onClose}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Scrollbar styling scoped to popup */}
      <style jsx>{`
        .popup-scroll {
          scrollbar-width: thin;
          scrollbar-color: #7e3ff2 transparent;
        }
        .popup-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .popup-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .popup-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #a855f7 0%, #7e3ff2 100%);
          border-radius: 9999px;
        }
        .popup-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #c084fc 0%, #8b5cf6 100%);
        }
      `}</style>
    </div>
  );
};