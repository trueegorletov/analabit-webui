import React from 'react';
import { useRouter } from 'next/navigation';
import type { ProgramRow, PopupNavigationProps } from './types';

interface ProgramTableProps extends PopupNavigationProps {
  programs: ProgramRow[];
  highlightPriority: number | null;
  loading: boolean;
}

export const ProgramTable: React.FC<ProgramTableProps> = ({
  programs,
  highlightPriority,
  loading,
  currentHeadingId,
  onClose,
}) => {
  const router = useRouter();

  const handleRowClick = (row: ProgramRow, event: React.MouseEvent<HTMLDivElement>) => {
    // If clicking on the same direction that's currently being viewed, just close the popup
    if (currentHeadingId && row.headingId === currentHeadingId) {
      onClose?.();
      return;
    }

    const url = `/directions/${row.headingId}`;

    // Handle different click types
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      // Middle mouse button or Ctrl/Cmd+click: open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (event.button === 0) {
      // Left click: navigate in same tab
      router.push(url);
    }
    // Right click (button === 2) is handled by browser's context menu naturally
  };

  const handleRowKeyDown = (row: ProgramRow, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // If pressing Enter/Space on the same direction that's currently being viewed, just close the popup
      if (currentHeadingId && row.headingId === currentHeadingId) {
        onClose?.();
        return;
      }

      const url = `/directions/${row.headingId}`;

      if (event.ctrlKey || event.metaKey) {
        // Ctrl/Cmd+Enter: open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        // Regular Enter/Space: navigate in same tab
        router.push(url);
      }
    }
  };

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
          const isHighlight = highlightPriority !== null && row.priority === highlightPriority;

          return (
            <div
              key={row.priority}
              className={`col-span-4 grid grid-cols-subgrid transition-colors cursor-pointer ${isHighlight
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30'
                : 'hover:bg-gray-700/30'
                } focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-inset`}
              onClick={(e) => handleRowClick(row, e)}
              onMouseDown={(e) => handleRowClick(row, e)}
              onKeyDown={(e) => handleRowKeyDown(row, e)}
              tabIndex={0}
              role="button"
              aria-label={`Navigate to ${row.name} direction page`}
              title={`Click to view ${row.name} direction details`}
            >
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs text-gray-400 whitespace-nowrap ${isHighlight ? 'text-white font-bold' : ''
                  }`}
              >
                {row.priority}
              </div>
              <div
                className={`px-3 py-2 font-medium overflow-hidden text-ellipsis ${isHighlight ? 'text-white' : ''
                  }`}
              >
                <span className="truncate">{row.name}</span>
              </div>
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs whitespace-nowrap text-center ${isHighlight ? 'text-white' : ''
                  }`}
              >
                {row.score}
              </div>
              <div
                className={`px-3 py-2 font-mono text-[10px] sm:text-xs whitespace-nowrap text-center ${isHighlight ? 'text-white' : ''
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