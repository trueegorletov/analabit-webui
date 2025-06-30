import React from 'react';
import { useUniversityColors } from '../../hooks/useUniversityColors';

interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null; // delta text like "+10" or "–"
}

interface UniversitySection {
  /** Full name for display */
  university: string;
  /** Machine code (e.g., spbgu) used for color mapping */
  code: string;
  programs: ProgramRow[];
  /** Which priority row should be highlighted (defaults to 1) */
  highlightPriority?: number;
}

export interface AdmissionStatusPopupProps {
  /** Student identifier displayed at top */
  studentId: string;
  /** Primary main status heading */
  mainStatus: string;
  /** Whether we know where the original is submitted */
  originalKnown?: boolean;
  /** Section describing where the applicant is currently passing */
  passingSection: UniversitySection;
  /** Probability tabs (e.g. ["–", "33%", "50%", "66%", "100%" ]) */
  probabilityTabs?: string[];
  /** Currently selected probability tab */
  selectedProbabilityTab?: string;
  /** Additional university sections (e.g. MSU) */
  secondarySections?: UniversitySection[];
  onClose?: () => void;
}

/**
 * AdmissionStatusPopup — rounded glassmorphism card presenting admission status.
 * Tailwind CSS utilities are used heavily for styling.
 *
 * The component is responsive and keeps a max-width for comfortable reading.
 */
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
  const { getUniversityColor } = useUniversityColors();

  const allSections: UniversitySection[] = [passingSection, ...secondarySections];
  const FlairButton = (code: string, label: string) => {
    const palette = getUniversityColor(code);
    return (
      <a
        href={`/#${code}`}
        data-university-code={code}
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="tag popup-tag"
        style={{
          background: palette?.gradient || 'linear-gradient(120deg, rgba(255,94,98,0.6), rgba(255,153,102,0.6))',
          backgroundSize: '200% 200%',
          boxShadow: `0 0 18px 3px ${palette?.glow || 'rgba(255,120,99,0.3)'}, 0 0 8px 1px rgba(255,255,255,0.1)`,
        }}
      >
        {label}
      </a>
    );
  };
  const originalMessage = originalKnown ? (
    <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
      <span className="text-gray-300">Оригинал в</span>
      {FlairButton(passingSection.code, passingSection.university)}
    </div>
  ) : (
    <p className="text-sm sm:text-base text-gray-400">Абитуриент ещё не подал оригинал аттестата</p>
  );
  return (
    <>
      <div
        className="popup-outer relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl overflow-hidden rounded-2xl backdrop-blur-lg bg-black/60 shadow-2xl ring-1 ring-white/10"
      >
        {/* decorative gradient border */}
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl border border-transparent before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-fuchsia-500/30 before:via-violet-500/10 before:to-indigo-500/30 before:opacity-40"></span>

        {/* Scrollable content wrapper */}
        <div className="popup-scroll overflow-x-hidden overflow-y-auto max-h-[90vh] p-4 sm:p-6 md:p-8 flex flex-col text-white">

        {/* Header */}
        <div className="relative z-10 text-center space-y-2">
          <span className="block text-sm text-gray-400 font-medium tracking-widest">
            {studentId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
            {mainStatus}
          </h2>
          {originalMessage}
        </div>

        {/* Divider */}
        <hr className="my-4 border-white/10" />

        {/* Unified university sections */}
        {allSections.map((section, idx) => {
          const divider = idx !== 0 ? (
            <hr key={`div-${section.code}`} className="my-6 border-white/10" />
          ) : null;
          const highlightDir = section.programs.find((p) => p.priority === (section.highlightPriority ?? 1));
          return (
            <React.Fragment key={section.code}>
              {divider}
              <section className={idx === 0 ? '' : 'mt-8'}>
                {/* Flair + current direction row */}
                <div className="flex items-center justify-between mb-3">
                  {FlairButton(section.code, section.university)}

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center rounded bg-violet-600/90">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base font-medium whitespace-nowrap">{highlightDir?.name}</span>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <table className="w-full text-sm sm:text-base">
                    <thead>
                      <tr className="text-left text-gray-400 uppercase tracking-wider text-xs">
                        <th className="px-4 py-2 font-medium">#</th>
                        <th className="px-4 py-2 font-medium">Направление</th>
                        <th className="px-4 py-2 font-medium">Баллы</th>
                        <th className="px-4 py-2 font-medium">Место</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.programs.map((row) => {
                        const isHighlight = row.priority === (section.highlightPriority ?? 1);
                        return (
                          <tr
                            key={row.priority}
                            className={`${isHighlight ? 'bg-white/10' : ''} hover:bg-white/10 transition-colors`}
                          >
                            <td className="px-4 py-2">
                              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-semibold">
                                {row.priority}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                            <td className="px-4 py-2 font-semibold text-right">{row.score}</td>
                            <td className="px-4 py-2 text-right">
                              {row.rank}
                              {row.delta && (
                                <span
                                  className={`ml-1 text-xs ${row.delta.includes('-') ? 'text-red-400' : 'text-green-400'}`}
                                >
                                  {row.delta}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Probability Tabs */}
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-2">При оттоке оригиналов на:</p>
                  <div className="flex justify-between gap-2">
                    {probabilityTabs.map((tab) => {
                      const selected = tab === selectedProbabilityTab;
                      return (
                        <button
                          key={tab}
                          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors backdrop-blur-sm ${
                            selected
                              ? 'bg-gradient-to-r from-fuchsia-600/40 to-violet-600/40 border border-white/20 shadow-inner'
                              : 'bg-white/5 hover:bg-white/10 border border-transparent'
                          }`}
                        >
                          {tab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </React.Fragment>
          );
        })}
        </div> {/* end of scrollable wrapper */}
      </div>

      {/* Scrollbar styling scoped to this component */}
      <style jsx>{`
        .popup-scroll {
          scrollbar-width: thin;
          scrollbar-color: #7e3ff2 transparent; /* thumb color, track transparent */
        }

        /* WebKit */
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
    </>
  );
};

/**
 * Example default export for quick prototyping without props.
 * Remove in production.
 */
export const DemoAdmissionStatusPopup = () => {
  const passingSection: UniversitySection = {
    university: 'СПбГУ',
    code: 'spbgu',
    highlightPriority: 1,
    programs: [
      { priority: 1, name: 'Информатика', score: 271, rank: 49, delta: '+10' },
      { priority: 2, name: 'Компьютерные науки', score: 269, rank: 65, delta: '+14' },
      { priority: 3, name: 'Приборостроение и оптика', score: 296, rank: 36 },
    ],
  };

  const secondarySections: UniversitySection[] = [
    {
      university: 'МГУ',
      code: 'mgu',
      programs: [
        { priority: 1, name: 'Прикладная математика', score: 295, rank: 67, delta: '67' },
        { priority: 2, name: 'Фундаментальная информатика', score: 281, rank: 84, delta: '+17' },
      ],
    },
  ];

  return (
    <AdmissionStatusPopup
      studentId="10234857689"
      mainStatus="Оригинал подан в СПбГУ"
      passingSection={passingSection}
      secondarySections={secondarySections}
    />
  );
}; 