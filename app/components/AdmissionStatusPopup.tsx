import React from 'react';

interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null; // delta text like "+10" or "–"
}

interface UniversitySection {
  university: string;
  programs: ProgramRow[];
  highlightPriority?: number;
}

export interface AdmissionStatusPopupProps {
  /** Student identifier displayed at top */
  studentId: string;
  /** Primary main status heading */
  mainStatus: string;
  /** Subtitle below status heading */
  subtitle?: string;
  /** Section describing where the applicant is currently passing */
  passingSection: UniversitySection;
  /** Probability tabs (e.g. ["–", "33%", "50%", "66%", "100%" ]) */
  probabilityTabs?: string[];
  /** Currently selected probability tab */
  selectedProbabilityTab?: string;
  /** Additional university sections (e.g. MSU) */
  secondarySections?: UniversitySection[];
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
  subtitle,
  passingSection,
  probabilityTabs = ['–', '33%', '50%', '66%', '100%'],
  selectedProbabilityTab = '–',
  secondarySections = [],
}) => {
  return (
    <div className="w-full max-w-lg sm:max-w-xl bg-black/70 border border-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="block text-sm text-gray-400 font-medium tracking-widest">
          {studentId}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{mainStatus}</h2>
        {subtitle && (
          <p className="text-gray-400 text-sm sm:text-base max-w-[90%] mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Divider */}
      <hr className="my-4 border-white/10" />

      {/* Passing To Section */}
      <section>
        <h3 className="font-semibold mb-3">Passing to</h3>
        <div className="flex items-center gap-2 mb-4">
          {/* Flair badge */}
          <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded bg-violet-600/90">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-medium">
            {passingSection.programs.find((p) => p.priority === 1)?.name}
          </span>
        </div>
        {/* Table for programs */}
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-sm sm:text-base">
            <thead>
              <tr className="text-left text-gray-400 uppercase tracking-wider text-xs">
                <th className="px-4 py-2 font-medium">#</th>
                <th className="px-4 py-2 font-medium">Direction</th>
                <th className="px-4 py-2 font-medium">Score</th>
                <th className="px-4 py-2 font-medium">Rank STC</th>
              </tr>
            </thead>
            <tbody>
              {passingSection.programs.map((row) => {
                const isHighlight = row.priority === (passingSection.highlightPriority ?? 1);
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
                      {row.delta && <span className="ml-1 text-xs text-green-400">{row.delta}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Probability Tabs */}
      <section className="mt-6">
        <p className="text-gray-400 text-sm mb-2">In case of certificate outflow equal to:</p>
        <div className="flex justify-between gap-2">
          {probabilityTabs.map((tab) => {
            const selected = tab === selectedProbabilityTab;
            return (
              <button
                key={tab}
                className={`flex-1 py-1.5 rounded-md border text-sm transition-colors ${selected ? 'bg-white/10 border-white/20' : 'border-transparent hover:bg-white/5'}`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary Sections */}
      {secondarySections.map((section) => (
        <section key={section.university} className="mt-6">
          <h3 className="font-semibold mb-3">{section.university}</h3>
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="text-left text-gray-400 uppercase tracking-wider text-xs">
                  <th className="px-4 py-2 font-medium">#</th>
                  <th className="px-4 py-2 font-medium">Direction</th>
                  <th className="px-4 py-2 font-medium">Score</th>
                  <th className="px-4 py-2 font-medium">Rank C</th>
                </tr>
              </thead>
              <tbody>
                {section.programs.map((row) => (
                  <tr key={row.priority} className="hover:bg-white/10 transition-colors">
                    <td className="px-4 py-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 text-white text-xs font-semibold">
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                    <td className="px-4 py-2 font-semibold text-right">{row.score}</td>
                    <td className="px-4 py-2 text-right">
                      {row.rank}
                      {row.delta && <span className="ml-1 text-xs text-green-400">{row.delta}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

/**
 * Example default export for quick prototyping without props.
 * Remove in production.
 */
export const DemoAdmissionStatusPopup = () => {
  const passingSection: UniversitySection = {
    university: 'SPbSU',
    highlightPriority: 1,
    programs: [
      { priority: 1, name: 'Informatics', score: 271, rank: 49, delta: '+10' },
      { priority: 2, name: 'Computer Science', score: 269, rank: 65, delta: '+14' },
      { priority: 3, name: 'Precision Mechanics and Optics', score: 296, rank: 36 },
    ],
  };

  const secondarySections: UniversitySection[] = [
    {
      university: 'MSU',
      programs: [
        { priority: 1, name: 'Applied Mathematics', score: 295, rank: 67, delta: '67' },
        { priority: 2, name: 'Fundamental Informatics', score: 281, rank: 84, delta: '+17' },
      ],
    },
  ];

  return (
    <AdmissionStatusPopup
      studentId="10234857689"
      mainStatus="Original submitted to SPbSU"
      subtitle="Enrollment is possible only at this university"
      passingSection={passingSection}
      secondarySections={secondarySections}
    />
  );
}; 