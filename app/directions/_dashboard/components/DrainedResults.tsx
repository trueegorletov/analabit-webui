import React from 'react';

interface DrainedResultsProps {
  /**
   * Number of Monte-Carlo simulations the statistics are aggregated over.
   * Defaults to 100 when not provided.
   */
  simulationCount?: number;
}

// Internal mock dataset structured by section → metric rows
const tableData = [
  {
    section: 'Проходной балл',
    rows: [
      { metric: 'Минимальный', '33%': '255', '50%': '255', '66%': '255', '100%': '255' },
      { metric: 'Максимальный', '33%': '284', '50%': '284', '66%': '284', '100%': '284' },
      { metric: 'Средний', '33%': '270', '50%': '268', '66%': '265', '100%': '262' },
      { metric: 'Модальный', '33%': '282', '50%': '279', '66%': '275', '100%': '272' },
    ],
  },
  {
    section: 'Ранг',
    rows: [
      { metric: 'Минимальный', '33%': '68', '50%': '62', '66%': '58', '100%': '55' },
      { metric: 'Максимальный', '33%': '135', '50%': '140', '66%': '145', '100%': '150' },
      { metric: 'Средний', '33%': '110', '50%': '115', '66%': '120', '100%': '125' },
      { metric: 'Модальный', '33%': '102', '50%': '107', '66%': '112', '100%': '117' },
    ],
  },
] as const;

export default function DrainedResults({ simulationCount = 100 }: DrainedResultsProps) {
  const percentages = ['33%', '50%', '66%', '100%'];

  return (
    <div className="mb-8">
      <h2 className="section-title">
        Ослабленные результаты
      </h2>

      <div className="rounded-xl bg-black/30 border border-white/15 overflow-hidden mt-4 sm:mt-5 md:mt-6">
        <div
          className="grid text-[10px] xs:text-xs sm:text-sm md:text-base"
          style={{ gridTemplateColumns: 'minmax(0,3fr) repeat(4, minmax(0,1fr))' }}
        >
          {/* Table Header (solid dark, no blur) */}
          <div className="grid col-span-5 md:text-sm" style={{ gridTemplateColumns: 'minmax(0,3fr) repeat(4, minmax(0,1fr))' }}>
            <div className="px-2 py-1.5 text-left whitespace-nowrap bg-black/80 text-gray-400 uppercase tracking-wider">
              Отток аттестатов
            </div>
            {percentages.map((p) => (
              <div key={p} className="px-2 py-1.5 text-center bg-black/80 text-gray-400 uppercase tracking-wider">
                {p}
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="col-span-5 h-px bg-white/10" />

          {/* Sections */}
          {tableData.map((section, idx) => (
            <React.Fragment key={section.section}>
              {/* Separator above section header (except the first section) */}
              {idx > 0 && <div className="col-span-5 h-px bg-white/10" />}

              {/* Section header spanning full width */}
              <div className="col-span-5 bg-black/2 backdrop-blur-sm text-gray-200 font-medium tracking-wide px-2 py-1.5 text-left md:text-lg">
                {section.section}
              </div>

              {/* Subheader separator */}
              <div className="col-span-5 h-px bg-white/10" />

              {/* Metric rows */}
              {section.rows.map((row) => (
                <div
                  key={row.metric + section.section}
                  className="col-span-5 grid hover:bg-white/5 transition-colors"
                  style={{ gridTemplateColumns: 'minmax(0,3fr) repeat(4, minmax(0,1fr))' }}
                >
                  <div className="flex items-center px-2 py-1.5 text-gray-300 font-medium text-left whitespace-normal xs:whitespace-nowrap text-[11px] xs:text-xs sm:text-sm md:text-base">
                    {row.metric}
                  </div>
                  {percentages.map((p) => (
                    <div
                      key={p}
                      className="px-2 py-1.5 text-center text-gray-100 font-mono font-semibold text-[11px] xs:text-sm sm:text-lg md:text-xl"
                    >
                      {row[p as keyof typeof row]}
                    </div>
                  ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Simulation metadata */}
      <p className="mt-4 text-center text-[11px] xs:text-xs sm:text-sm text-gray-400 italic">
        Для каждого значения оттока аттестатов приведены результаты, полученные за {simulationCount}&nbsp;итераций симуляции.
      </p>
    </div>
  );
}
