import React, { useReducer, useEffect } from 'react';
import { PopupHeader } from './PopupHeader';
import { UniversitySection } from './UniversitySection';
import type { UniversitySection as Section, ProgramRow } from './types';

export interface AdmissionStatusPopupProps {
  studentId: string;
  mainStatus: string;
  originalKnown?: boolean;
  passingSection: Section;
  probabilityTabs?: string[];
  selectedProbabilityTab?: string;
  secondarySections?: Section[];
  onClose?: () => void;
}

type SectionState = {
  selectedTab: string;
  loading: boolean;
  programs: ProgramRow[];
  highlightPriority: number;
};

type State = Record<string, SectionState>;

type Action =
  | { type: 'TAB_CHANGE_START'; code: string; newTab: string }
  | { type: 'TAB_CHANGE_SUCCESS'; code: string; newTab: string; programs: ProgramRow[]; highlightPriority: number };

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
  probabilityTabs = ['–', '33%', '50%', '66%', '100%'],
  selectedProbabilityTab = '–',
  secondarySections = [],
  onClose,
}) => {
  // Initialize reducer state
  const initialState: State = React.useMemo(() => {
    const init: State = {};
    [passingSection, ...secondarySections].forEach((s) => {
      init[s.code] = {
        selectedTab: selectedProbabilityTab,
        loading: false,
        programs: s.programs,
        highlightPriority: s.highlightPriority ?? 1,
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

  // Handler for tab selection
  const handleTabSelect = (code: string, newTab: string) => {
    const current = sectionsState[code];
    if (!current || current.loading || current.selectedTab === newTab) return;

    dispatch({ type: 'TAB_CHANGE_START', code, newTab });

    // Simulate async fetch
    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const newPrograms: ProgramRow[] = current.programs.map((p) => {
        const rankChange = Math.floor(Math.random() * 40) - 20;
        const newRank = Math.max(1, p.rank + rankChange);
        return {
          ...p,
          rank: newRank,
          delta: rankChange === 0 ? undefined : rankChange > 0 ? `+${rankChange}` : `${rankChange}`,
        };
      });
      let newHighlight = current.highlightPriority;
      if (Math.random() < 0.2) {
        const priorities = newPrograms.map((p) => p.priority);
        newHighlight = priorities[Math.floor(Math.random() * priorities.length)];
      }
      dispatch({
        type: 'TAB_CHANGE_SUCCESS',
        code,
        newTab,
        programs: newPrograms,
        highlightPriority: newHighlight,
      });
    }, delay);
  };

  const allSections = [passingSection, ...secondarySections];

  return (
    <div className="popup-outer relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl overflow-hidden rounded-2xl backdrop-blur-lg bg-black/60 shadow-2xl ring-1 ring-white/10" data-testid="admission-popup">
      {/* decorative gradient border */}
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-transparent before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-fuchsia-500/30 before:via-violet-500/10 before:to-indigo-500/30 before:opacity-40"></span>

      {/* Scrollable content wrapper */}
      <div className="popup-scroll overflow-x-hidden overflow-y-auto max-h-[90vh] p-4 sm:p-6 md:p-8 flex flex-col text-white">
        <PopupHeader
          studentId={studentId}
          mainStatus={mainStatus}
          originalKnown={originalKnown}
          passingSection={passingSection}
          onClose={onClose ?? (() => {})}
        />

        <hr className="my-4 border-white/10" />

        {allSections.map((section, idx) => (
          <React.Fragment key={section.code}>
            {idx !== 0 && <hr className="my-6 border-white/10" />}
            <UniversitySection
              section={section}
              runtime={sectionsState[section.code]}
              probabilityTabs={probabilityTabs}
              onTabSelect={handleTabSelect}
              onFlairClick={() => onClose?.()}
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