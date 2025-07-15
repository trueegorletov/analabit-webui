import React, { useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { NoSymbolIcon, ArrowUpCircleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type NoteStatusKey = 'QUIT' | 'SUBMITTED' | 'UNKNOWN';
type StatusKey = NoteStatusKey | 'PASSING_HIGHER';

interface NotesTooltipProps {
  statuses: StatusKey[];
  children: React.ReactNode;
}

const NOTES_STATUS_TEXT = {
  SUBMITTED: 'Оригинал подан',
  PASSING_HIGHER: 'Проходит на более приоритетное направление',
  UNKNOWN: 'Нет данных о наличии или отсутствии подачи аттестата',
  QUIT: 'Покинул конкурс',
};

const getStatusIcon = (status: StatusKey) => {
  switch (status) {
    case 'QUIT':
      return <NoSymbolIcon className="w-[0.8rem] h-[0.8rem] sm:w-4 sm:h-4 text-red-500" />;
    case 'SUBMITTED':
      return <CheckCircleIcon className="w-[0.8rem] h-[0.8rem] sm:w-4 sm:h-4 text-green-500" />;
    case 'UNKNOWN':
      return <QuestionMarkCircleIcon className="w-[0.8rem] h-[0.8rem] sm:w-4 sm:h-4 text-gray-300" />;
    case 'PASSING_HIGHER':
      return <ArrowUpCircleIcon className="w-[0.8rem] h-[0.8rem] sm:w-4 sm:h-4 text-yellow-500" />;
    default:
      return <QuestionMarkCircleIcon className="w-[0.8rem] h-[0.8rem] sm:w-4 sm:h-4 text-gray-300" />;
  }
};

interface TooltipState {
  visible: boolean;
  position: { x: number; y: number };
}

const HOVER_LEAVE_DELAY = 100;
const FADE_DURATION = 150;

export const NotesTooltip: React.FC<NotesTooltipProps> = ({ statuses, children }) => {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleFadeOut = useCallback(() => {
    setTooltip((prev) => (prev ? { ...prev, visible: false } : prev));
    timeoutRef.current = setTimeout(() => {
      setTooltip(null);
      timeoutRef.current = null;
    }, FADE_DURATION);
  }, []);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      scheduleFadeOut();
    }, HOVER_LEAVE_DELAY);
  }, [scheduleFadeOut]);

  const showTooltip = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, autoHide: boolean = false) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      
      // Calculate responsive positioning to prevent screen overflow
      const viewportWidth = window.innerWidth;
      const tooltipEstimatedWidth = viewportWidth < 480 ? 240 : viewportWidth < 640 ? 280 : viewportWidth < 768 ? 320 : 256;
      const padding = 12;
      
      let left = rect.left + rect.width / 2;
      
      // Reduce left offset on smaller screens
      if (viewportWidth < 640) {
        left = left - 8; // Move tooltip slightly to the right on small screens
      }
      
      // Adjust position if tooltip would overflow on the right
      if (left + tooltipEstimatedWidth / 2 > viewportWidth - padding) {
        left = viewportWidth - padding - tooltipEstimatedWidth / 2;
      }
      
      // Adjust position if tooltip would overflow on the left
      if (left - tooltipEstimatedWidth / 2 < padding) {
        left = padding + tooltipEstimatedWidth / 2;
      }

      setTooltip({
        visible: true,
        position: { x: left, y: rect.top - 8 },
      });

      if (autoHide) {
        timeoutRef.current = setTimeout(() => {
          hideTooltip();
        }, 2000);
      }
    },
    [
      hideTooltip,
    ],
  );

  return (
    <>
      <div
        onMouseEnter={(e) => showTooltip(e)}
        onMouseLeave={hideTooltip}
        onClick={(e) => {
          e.stopPropagation();
          showTooltip(e, true);
        }}
      >
        {children}
      </div>
      
      {tooltip && typeof document !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            className={`fixed pointer-events-none -translate-x-1/2 -translate-y-full transition-opacity duration-150 z-50 ${
              tooltip.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: tooltip.position.x,
              top: tooltip.position.y,
            }}
          >
            <div className="inline-block max-w-65 md:max-w-70 whitespace-normal break-normal text-left leading-snug px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 rounded-lg bg-[#1b1b1f] text-white text-xs font-medium shadow-xl border border-white/15">
              <div className="grid gap-1.5 sm:gap-2">
                {statuses.map((status, index) => (
                  <React.Fragment key={`${status}-${index}`}>
                    {index > 0 && (
                      <div className="border-t border-white/20 -mx-2 sm:-mx-2.5 md:-mx-3 my-0.5 sm:my-1" />
                    )}
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(status)}
                      </div>
                      <div className="text-[8px] sm:text-xs text-gray-200 leading-relaxed">
                        {NOTES_STATUS_TEXT[status]}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )
      }
    </>
  );
};