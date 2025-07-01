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
      <table className="w-full text-xs sm:text-sm table-auto">
        <thead>
          <tr className="text-left text-gray-400 uppercase tracking-wider text-[10px] sm:text-xs">
            <th className="px-2 py-1 font-medium">#</th>
            <th className="px-2 py-1 font-medium">Направление</th>
            <th className="px-2 py-1 font-medium">Баллы</th>
            <th className="px-2 py-1 font-medium">Место</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((row) => {
            const isHighlight = row.priority === highlightPriority;
            return (
              <tr
                key={row.priority}
                className={`${isHighlight ? 'bg-violet-600/20 hover:bg-violet-600/30' : 'hover:bg-gray-700/30'} transition-colors ${loading ? 'opacity-60' : ''}`}
              >
                <td className="px-2 py-1 font-mono text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                  {row.priority}
                </td>
                <td className="px-2 py-1 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {row.name}
                </td>
                <td className="px-2 py-1 font-mono text-[10px] sm:text-xs whitespace-nowrap">
                  {row.score}
                </td>
                <td className="px-2 py-1 font-mono text-[10px] sm:text-xs whitespace-nowrap">
                  {loading ? (
                    <span className="inline-block h-4 w-12 bg-white/20 rounded animate-pulse" />
                  ) : (
                    <span className="flex items-center gap-1">
                      {row.rank}
                      {row.delta && (
                        <span className={`text-xs ${row.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {row.delta}
                        </span>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; 