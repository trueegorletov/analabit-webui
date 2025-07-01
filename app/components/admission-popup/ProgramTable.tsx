import React from 'react';
import type { ProgramRow } from './types';

interface ProgramTableProps {
  programs: ProgramRow[];
  highlightPriority: number;
  loading: boolean;
}

export const ProgramTable: React.FC<ProgramTableProps> = ({ programs, highlightPriority, loading }) => {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="grid grid-cols-[auto_1fr_auto_auto] text-xs sm:text-sm">
        {/* Header */}
        <div className="contents text-left text-gray-400 uppercase tracking-wider text-[10px] sm:text-xs font-medium">
          <div className="px-3 py-2">#</div>
          <div className="px-3 py-2">Направление</div>
          <div className="px-3 py-2 text-center">Баллы</div>
          <div className="px-3 py-2 text-center">Место</div>
        </div>

        {/* Body */}
        {programs.map((row) => {
          const isHighlight = row.priority === highlightPriority;

          return (
            <div
              key={row.priority}
              className={`col-span-4 grid grid-cols-[auto_1fr_auto_auto] transition-colors ${
                isHighlight
                  ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30'
                  : 'hover:bg-gray-700/30'
              }`}
            >
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs text-gray-400 whitespace-nowrap ${
                  isHighlight ? 'text-white font-bold' : ''
                }`}
              >
                {row.priority}
              </div>
              <div
                className={`px-3 py-2 font-medium overflow-hidden text-ellipsis ${
                  isHighlight ? 'text-white' : ''
                }`}
              >
                <span className="truncate">{row.name}</span>
              </div>
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs whitespace-nowrap text-center ${
                  isHighlight ? 'text-white' : ''
                }`}
              >
                {row.score}
              </div>
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs whitespace-nowrap text-center ${
                  isHighlight ? 'text-white' : ''
                } ${loading ? 'opacity-60' : ''}`}
              >
                {loading ? (
                  <span className="inline-block h-4 w-12 bg-white/20 rounded animate-pulse" />
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    {row.rank}
                    {row.delta && (
                      <span
                        className={`text-xs ${row.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {row.delta}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 