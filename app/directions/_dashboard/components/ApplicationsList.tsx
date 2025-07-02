'use client';

import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import {
  useApplications,
  OrigCeltStatus,
} from '@/hooks/useDashboardStats';
import { CircleCheck, Circle, GripHorizontal, HelpCircle, XCircle } from 'lucide-react';
import ReactDOM from 'react-dom';
import { AdmissionStatusPopup } from '@/app/components/AdmissionStatusPopup';
import { mockUniversities, mockDirections } from '@/lib/api/mockData';

const MIN_TABLE_HEIGHT = 150; // pixels
const INITIAL_TABLE_HEIGHT = 490; // pixels (increased 2.75x)
const CLICK_DRAG_THRESHOLD = 5; // pixels

// NEW: Tooltip text mapping for "Оригинал" column icons
const ORIGINAL_STATUS_TEXT: Record<OrigCeltStatus, string> = {
  [OrigCeltStatus.YES]: 'Оригинал подан',
  [OrigCeltStatus.NO]: 'Проходит на другое, более приоритетное направление',
  [OrigCeltStatus.UNKNOWN]: 'Нет данных о наличии или отсутствии подачи аттестата',
  [OrigCeltStatus.OTHER]: 'Покинул конкурс',
};

// Utility types copied from popup component
interface ProgramRow {
  priority: number;
  name: string;
  score: number;
  rank: number;
  delta?: string | null;
}
interface UniversitySection {
  university: string;
  code: string;
  programs: ProgramRow[];
  highlightPriority: number;
}

// Random helpers (same as index page)
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const pickRandom = <T,>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

// Generate mock admission data – duplicated from index page for self-containment
const generateAdmissionData = () => {
  const universitiesPool = [...mockUniversities];
  const uniCount = randomInt(2, 5);
  const selectedUnis: typeof mockUniversities = [];
  while (selectedUnis.length < uniCount && universitiesPool.length) {
    const idx = randomInt(0, universitiesPool.length - 1);
    selectedUnis.push(universitiesPool.splice(idx, 1)[0]);
  }

  const sections: UniversitySection[] = selectedUnis.map((uni) => {
    const dirPool = mockDirections[uni.code] || [];
    const dirCount = Math.min(randomInt(2, 10), dirPool.length > 0 ? dirPool.length : 10);
    const programs: ProgramRow[] = [];
    const usedNames = new Set<string>();
    while (programs.length < dirCount) {
      let dirName: string;
      if (dirPool.length) {
        const dir = pickRandom(dirPool);
        dirName = dir.name;
      } else {
        dirName = `Направление ${programs.length + 1}`;
      }
      if (usedNames.has(dirName)) continue;
      usedNames.add(dirName);
      const priority = programs.length + 1;
      programs.push({
        priority,
        name: dirName,
        score: randomInt(240, 300),
        rank: randomInt(1, 120),
      });
    }

    const highlightPriority = randomInt(1, programs.length);

    programs.forEach((p) => {
      if (p.priority < highlightPriority) {
        p.delta = '-' + randomInt(1, 99).toString();
      } else if (p.priority === highlightPriority) {
        const v = randomInt(0, 20);
        p.delta = v === 0 ? '0' : '+' + v.toString();
      } else {
        const sign = Math.random() < 0.5 ? '+' : '-';
        p.delta = sign + randomInt(1, 50).toString();
      }
    });

    return {
      university: uni.name,
      code: uni.code,
      programs,
      highlightPriority,
    } as UniversitySection;
  });

  const passingSection = sections[0];
  const secondarySections = sections.slice(1);
  const originalKnown = Math.random() < 0.8;
  return { passingSection, secondarySections, originalKnown };
};

export default function ApplicationsList() {
  const { applications } = useApplications();
  const [currentHeight, setCurrentHeight] = useState(INITIAL_TABLE_HEIGHT);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const resizableDivRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const dragStateRef = useRef({
    isDragging: false,
    didMove: false,
    prevMouseY: 0,
  });

  // Tooltip state for header hover
  const [tooltipInfo, setTooltipInfo] = useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);

  // NEW: Tooltip state for "Оригинал" status icons
  const FADE_DURATION = 180; // ms
  const HOVER_LEAVE_DELAY = 120; // ms – небольшая задержка, чтобы избежать мерцаний при быстром перемещении курсора
  const [origTooltip, setOrigTooltip] = useState<{
    text: string;
    top: number;
    left: number;
    visible: boolean;
  } | null>(null);
  const origTooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<ReturnType<typeof generateAdmissionData> | null>(null);
  const [errorTooltip, setErrorTooltip] = useState<{ text: string; top: number; left: number } | null>(null);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ERROR_DURATION = 3750; // ms (25% shorter than 5s)
  const CANCEL_DURATION = 2625; // ms (25% shorter than 3.5s)

  const toggleTableHeight = useCallback(() => {
    if (!contentHeight) return;
    setCurrentHeight(prevHeight => {
      const currentContentHeight = contentRef.current?.scrollHeight || contentHeight;
      const isCollapsed = Math.abs(prevHeight - currentContentHeight) > 1;
      if (isCollapsed) {
        return currentContentHeight;
      } else {
        return Math.min(INITIAL_TABLE_HEIGHT, currentContentHeight);
      }
    });
  }, [contentHeight]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return;

    const deltaY = event.clientY - dragStateRef.current.prevMouseY;

    if (!dragStateRef.current.didMove && Math.abs(deltaY) > CLICK_DRAG_THRESHOLD) {
      dragStateRef.current.didMove = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    }
    
    if (dragStateRef.current.didMove) {
      setCurrentHeight(prevHeight => {
        const newHeight = prevHeight + deltaY;
        const maxAllowed = window.innerHeight - 120;
        return Math.max(MIN_TABLE_HEIGHT, Math.min(newHeight, maxAllowed));
      });
    }
    
    dragStateRef.current.prevMouseY = event.clientY;

  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragStateRef.current.isDragging) return;

    if (!dragStateRef.current.didMove) {
      toggleTableHeight();
    }
    
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    dragStateRef.current.isDragging = false;
    dragStateRef.current.didMove = false;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, toggleTableHeight]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!resizableDivRef.current) return;

      dragStateRef.current = {
        isDragging: true,
        didMove: false,
        prevMouseY: event.clientY,
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    return () => {
      if (dragStateRef.current.isDragging) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
      // Cleanup tooltip timer on unmount
      if (origTooltipTimeoutRef.current) {
        clearTimeout(origTooltipTimeoutRef.current);
      }
    };
  }, [handleMouseMove, handleMouseUp]);

  // Measure content height after render
  useLayoutEffect(() => {
    if (contentRef.current) {
      const h = contentRef.current.scrollHeight;
      setContentHeight(h);
      setCurrentHeight((prev) => Math.min(prev, h));
    }
  }, [applications.length]);

  const renderOriginal = (status: OrigCeltStatus) => {
    switch (status) {
      case OrigCeltStatus.YES:
        return <CircleCheck className="w-[1.1em] h-[1.1em] text-green-500 mx-auto" />;
      case OrigCeltStatus.NO:
        return <Circle className="w-[1.1em] h-[1.1em] text-yellow-500 mx-auto" />;
      case OrigCeltStatus.UNKNOWN:
        return <HelpCircle className="w-[1.1em] h-[1.1em] text-gray-300 mx-auto" />;
      case OrigCeltStatus.OTHER:
        return <XCircle className="w-[1.1em] h-[1.1em] text-red-500 mx-auto" />;
      default:
        return <Circle className="w-[1.1em] h-[1.1em] text-gray-400 mx-auto" />;
    }
  };

  const renderOtherUniversities = (value?: number | 'check') => {
    if (value === undefined || value === 0) {
      return <span className="text-gray-200">—</span>;
    }
    return <span className="text-gray-200 font-mono">{value}</span>;
  };

  const showHeaderTooltip = (
    e: React.MouseEvent<HTMLDivElement>,
    text: string,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipInfo({
      text,
      top: rect.top - 8, // 8px above
      left: rect.left + rect.width / 2,
    });
  };

  const hideHeaderTooltip = () => setTooltipInfo(null);

  const closePopup = () => setPopupOpen(false);

  const handleRowClick = useCallback(
    (app: ReturnType<typeof useApplications>['applications'][number], e: React.MouseEvent<HTMLDivElement>) => {
      const rowElement = e.currentTarget as HTMLDivElement;
      const getIdCellRect = () => {
        const idCell = rowElement.children?.[1] as HTMLElement | undefined;
        return (idCell ?? rowElement).getBoundingClientRect();
      };

      // If there's an ongoing request
      if (loadingStudentId) {
        if (loadingStudentId === app.studentId) {
          if (requestTimeoutRef.current) {
            clearTimeout(requestTimeoutRef.current);
            requestTimeoutRef.current = null;
          }
          setLoadingStudentId(null);
          const rect = getIdCellRect();
          setErrorTooltip({
            text: 'Запрос отменён',
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
          });
          setTimeout(() => setErrorTooltip(null), CANCEL_DURATION);
          return;
        }
        if (requestTimeoutRef.current) {
          clearTimeout(requestTimeoutRef.current);
          requestTimeoutRef.current = null;
        }
      }

      // Start new request
      setLoadingStudentId(app.studentId);
      setSelectedStudentId(app.studentId);
      setErrorTooltip(null);

      const isNotFound = Math.random() < 0.12;
      const isGenericError = !isNotFound && Math.random() < 0.08;
      const delay = 1200 + Math.random() * 1200;
      requestTimeoutRef.current = setTimeout(() => {
        requestTimeoutRef.current = null;
        if (isNotFound || isGenericError) {
          const rect = getIdCellRect();
          setErrorTooltip({
            text: isNotFound ? 'ID не найден' : 'Произошла ошибка',
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
          });
          setLoadingStudentId(null);
          setTimeout(() => setErrorTooltip(null), ERROR_DURATION);
          return;
        }
        setPopupData(generateAdmissionData());
        setPopupOpen(true);
        setLoadingStudentId(null);
      }, delay);
    },
    [loadingStudentId],
  );

  // NEW: lock body scroll & preserve position when popup is open (parity with main page)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (popupOpen) {
      // Save current scroll position and lock the body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup in case component unmounts while popup is open
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [popupOpen]);

  // --- Tooltip handling helpers (moved above to satisfy hook dependency order) ---
  const scheduleFadeOut = () => {
    setOrigTooltip((prev) => (prev ? { ...prev, visible: false } : prev));
    origTooltipTimeoutRef.current = setTimeout(() => {
      setOrigTooltip(null);
      origTooltipTimeoutRef.current = null;
    }, FADE_DURATION);
  };

  const hideOrigTooltip = useCallback(() => {
    if (origTooltipTimeoutRef.current) {
      clearTimeout(origTooltipTimeoutRef.current);
      origTooltipTimeoutRef.current = null;
    }
    origTooltipTimeoutRef.current = setTimeout(() => {
      scheduleFadeOut();
    }, HOVER_LEAVE_DELAY);
  }, []);

  const showOrigTooltip = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement>,
      status: OrigCeltStatus,
      autoHide: boolean = false,
    ) => {
      if (origTooltipTimeoutRef.current) {
        clearTimeout(origTooltipTimeoutRef.current);
        origTooltipTimeoutRef.current = null;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      setOrigTooltip({
        text: ORIGINAL_STATUS_TEXT[status],
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
        visible: true,
      });

      if (autoHide) {
        origTooltipTimeoutRef.current = setTimeout(() => {
          hideOrigTooltip();
        }, 2000);
      }
    },
    [hideOrigTooltip],
  );

  return (
    <div>
      <h2 className="section-title">
        Список заявлений
      </h2>
      <div
        ref={resizableDivRef}
        className="rounded-t-xl bg-white/5 border border-white/10 border-b-0 overflow-hidden applications-scrollbar mt-4 sm:mt-5 md:mt-6"
        style={{ height: `${currentHeight}px` }}
      >
        <div ref={contentRef} className="overflow-y-auto overflow-x-hidden h-full">
          <div className="micro-table grid grid-cols-[max-content_max-content_repeat(4,_1fr)] text-[8px] xs:text-[10px] sm:text-xs md:text-sm w-full">
            {/* Header */}
            <div className="contents text-left text-gray-400 uppercase tracking-wider text-[9px] xs:text-[11px] sm:text-xs md:text-sm font-medium">
              {/* Rank Header */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 sticky top-0 bg-[#1b1b1f] z-10 cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'Ранг')}
                onMouseLeave={hideHeaderTooltip}
              >
                #
              </div>

              {/* ID Header */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 sticky top-0 bg-[#1b1b1f] z-10 cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'ID')}
                onMouseLeave={hideHeaderTooltip}
              >
                ID
              </div>

              {/* Priority Header with responsive text */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 text-center sticky top-0 bg-[#1b1b1f] z-10 truncate whitespace-nowrap cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'Приоритет')}
                onMouseLeave={hideHeaderTooltip}
              >
                <span className="hidden md:inline">Приоритет</span>
                <span className="hidden sm:inline md:hidden">Приор.</span>
                <span className="inline sm:hidden">Прио</span>
              </div>

              {/* Score Header */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 text-center sticky top-0 bg-[#1b1b1f] z-10 cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'Балл')}
                onMouseLeave={hideHeaderTooltip}
              >
                Балл
              </div>

              {/* Other Universities Header with responsive text */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 text-center sticky top-0 bg-[#1b1b1f] z-10 truncate whitespace-nowrap cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'Другие университеты')}
                onMouseLeave={hideHeaderTooltip}
              >
                <span className="hidden lg:inline">Другие университеты</span>
                <span className="hidden sm:inline lg:hidden">Другие ун-ты</span>
                <span className="inline sm:hidden">Др</span>
              </div>

              {/* Original Header with responsive text */}
              <div
                className="header-cell px-2 py-1 xs:px-3 xs:py-2 text-center sticky top-0 bg-[#1b1b1f] z-10 truncate whitespace-nowrap cursor-help border-l border-[#1b1b1f] first:border-l-0"
                onMouseEnter={(e) => showHeaderTooltip(e, 'Оригинал')}
                onMouseLeave={hideHeaderTooltip}
              >
                <span className="hidden md:inline">Оригинал</span>
                <span className="hidden sm:inline md:hidden">Ориг.</span>
                <span className="inline sm:hidden">О</span>
              </div>
            </div>

            {/* Body */}
            {applications.map((app, index) => {
              const isLoading = loadingStudentId === app.studentId;
              const rowClasses = `${isLoading ? 'bg-yellow-600/50 animate-pulse' : ''} col-span-6 grid grid-cols-subgrid transition-colors cursor-pointer ${
                app.passes
                  ? 'bg-gradient-to-r from-violet-700/40 to-fuchsia-700/40 hover:from-violet-700/50 hover:to-fuchsia-700/50'
                  : index % 2 === 0
                    ? 'bg-black/50 hover:bg-black/60'
                    : 'bg-black/40 hover:bg-black/60'
              }`;
              return (
                <div
                  key={`${app.rank}-${app.studentId}`}
                  className={rowClasses}
                  onClick={(e) => handleRowClick(app, e)}
                >
                  {/* Rank */}
                  <div className={`px-2 py-1 xs:px-3 xs:py-2 font-mono whitespace-nowrap ${app.passes ? 'text-green-300 font-semibold' : 'text-gray-200'}`}>
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4 text-white mx-auto" style={{ animationDuration: '0.6s' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    ) : (
                      app.rank
                    )}
                  </div>
                  
                  {/* Student ID */}
                  <div className={`px-2 py-1 xs:px-3 xs:py-2 font-mono overflow-hidden text-ellipsis ${app.passes ? 'font-semibold text-white' : 'text-gray-200'}`}>
                    <span className="truncate">{app.studentId}</span>
                  </div>
                  
                  {/* Priority */}
                  <div className={`px-2 py-1 xs:px-3 xs:py-2 font-mono whitespace-nowrap text-center ${app.passes ? 'font-semibold text-white' : 'text-gray-200'}`}>
                    {app.priority}
                  </div>
                  
                  {/* Score */}
                  <div className={`px-2 py-1 xs:px-3 xs:py-2 font-mono whitespace-nowrap text-center ${app.passes ? 'font-semibold text-white' : 'text-gray-200'}`}>
                    {app.score}
                  </div>
                  
                  {/* Other Universities */}
                  <div className={`px-2 py-1 xs:px-3 xs:py-2 text-center ${app.passes ? 'font-semibold text-white' : ''}`}>
                    {renderOtherUniversities(app.otherUnlv)}
                  </div>
                  
                  {/* Original with tooltip */}
                  <div
                    className="px-2 py-1 xs:px-3 xs:py-2 text-center"
                    onMouseEnter={(e) => showOrigTooltip(e, app.origCelt)}
                    onMouseLeave={hideOrigTooltip}
                    onClick={(e) => {
                      e.stopPropagation();
                      showOrigTooltip(e, app.origCelt, true);
                    }}
                  >
                    {renderOriginal(app.origCelt)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className="w-full h-6 bg-[#1b1b1f] hover:bg-[#24242b] cursor-ns-resize flex items-center justify-center select-none rounded-b-xl border border-white/10 border-t-0 -mt-px transition-colors"
        onMouseDown={handleMouseDown}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize table height. Click to toggle between max and default height. Drag to resize."
        tabIndex={0}
      >
        <GripHorizontal className="w-5 h-5 text-gray-500" />
      </div>

      {/* Tooltip portal */}
      {tooltipInfo &&
        ReactDOM.createPortal(
          <div
            className="fixed pointer-events-none -translate-x-1/2 -translate-y-full"
            style={{ left: tooltipInfo.left, top: tooltipInfo.top, zIndex: 9999 }}
          >
            <span className="whitespace-nowrap px-4 py-2 rounded-lg bg-[#1b1b1f] text-white text-xs font-medium shadow-xl border border-white/15">
              {tooltipInfo.text}
            </span>
          </div>,
          document.body,
        )}

      {/* Error tooltip portal */}
      {errorTooltip &&
        ReactDOM.createPortal(
          <div
            className="fixed pointer-events-none -translate-x-1/2 -translate-y-full"
            style={{ left: errorTooltip.left, top: errorTooltip.top, zIndex: 9999 }}
          >
            <span className="whitespace-nowrap px-4 py-2 rounded-lg bg-red-600/95 text-white text-xs font-medium shadow-xl backdrop-blur-sm tooltip-anim">
              {errorTooltip.text}
            </span>
          </div>,
          document.body,
        )}

      {/* Original status tooltip portal */}
      {origTooltip &&
        ReactDOM.createPortal(
          <div
            className={`fixed pointer-events-none -translate-x-1/2 -translate-y-full transition-opacity duration-150 ${
              origTooltip.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: origTooltip.left,
              top: origTooltip.top,
              zIndex: 9999,
            }}
          >
            <span className="inline-block max-w-28 whitespace-normal break-normal text-center leading-snug px-3 py-1.5 rounded-md bg-[#1b1b1f] text-white text-xs font-medium shadow-xl border border-white/15">
              {origTooltip.text}
            </span>
          </div>,
          document.body,
        )}

      {/* Popup overlay */}
      {popupOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
            onClick={closePopup}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {popupData && (
                <AdmissionStatusPopup
                  studentId={selectedStudentId}
                  mainStatus="Статус подачи документов"
                  originalKnown={popupData.originalKnown}
                  passingSection={popupData.passingSection}
                  secondarySections={popupData.secondarySections}
                  onClose={closePopup}
                />
              )}
            </div>
          </div>,
          document.body,
        )}

      {/* Header styling */}
      <style jsx>{`
        /* Header cells: draw a 1-pixel inset mask on both left & right edges so any rounding seams are hidden.
           Box-shadow doesn't influence layout, unlike borders. */
        .micro-table .header-cell {
          box-shadow: inset 1px 0 0 #1b1b1f, inset -1px 0 0 #1b1b1f;
        }
      `}</style>
      {/* Tooltip animation */}
      <style jsx>{`
        @keyframes fadeInOutTooltip {
          0% {
            opacity: 0;
            transform: translateY(-4px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-4px);
          }
        }
        .tooltip-anim {
          animation: fadeInOutTooltip ${ERROR_DURATION}ms ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
