'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  memo,
} from 'react';
import { GripHorizontal } from 'lucide-react';
import { NoSymbolIcon, ArrowUpCircleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';
import { AdmissionStatusPopup } from '@/app/components/AdmissionStatusPopup';
import { NotesTooltip } from './NotesTooltip';
import {
  useEnrichedApplications,
} from '@/presentation/hooks/useDashboardStats';
import { usePaginationObserver } from '@/presentation/hooks/usePaginationObserver';
import type { Application as DomainApplication } from '@/domain/models';
import {
  fetchStudentAdmissionData,
  type AdmissionData,
  type StudentNotFoundError,
  type StudentDataError,
  type StudentTimeoutError,
} from '@/lib/api/student';
import { useApplicationRepository, useHeadingRepository, useResultsRepository } from '@/application/DataProvider';
import {
  TableLoadingPlaceholder,
  PaginationLoadingIndicator,
  LoadMoreButton,
} from '@/app/components/LoadingComponents';
import { INTERSECTION_CONFIG } from '@/app/directions/_dashboard/constants';

const MIN_TABLE_HEIGHT = 150;
const INITIAL_TABLE_HEIGHT = 490;
const CLICK_DRAG_THRESHOLD = 5;

// --- ResizableContainer Component ---
// This component encapsulates all the resizing logic to prevent re-renders in the parent.
const ResizableContainer = memo(
  ({
    children,
    hasContent,
    applicationsCount,
  }: {
    children: React.ReactNode;
    hasContent: boolean;
    applicationsCount?: number;
  }) => {
    const [currentHeight, setCurrentHeight] = useState(INITIAL_TABLE_HEIGHT);
    const [contentHeight, setContentHeight] = useState<number | null>(null);
    const resizableDivRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const dragStateRef = useRef({
      isDragging: false,
      didMove: false,
      prevMouseY: 0,
    });

    const toggleTableHeight = useCallback(() => {
      if (!contentHeight) return;
      setCurrentHeight((prevHeight) => {
        if (prevHeight < contentHeight) {
          return contentHeight;
        }
        return MIN_TABLE_HEIGHT;
      });
    }, [contentHeight]);

    const handleMouseMove = useCallback((event: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return;

      const deltaY = event.clientY - dragStateRef.current.prevMouseY;

      if (
        !dragStateRef.current.didMove &&
        Math.abs(deltaY) > CLICK_DRAG_THRESHOLD
      ) {
        dragStateRef.current.didMove = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'ns-resize';
      }

      if (dragStateRef.current.didMove) {
        setCurrentHeight((prevHeight) => {
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
      };
    }, [handleMouseMove, handleMouseUp]);

    useLayoutEffect(() => {
      if (contentRef.current) {
        const h = contentRef.current.scrollHeight;
        setContentHeight(h);
        // Adjust height only if it's larger than the content, to avoid unnecessary shrinking
        setCurrentHeight((prev) => Math.min(prev, h > MIN_TABLE_HEIGHT ? h : INITIAL_TABLE_HEIGHT));
      }
    }, [hasContent, children, applicationsCount]);

    return (
      <>
        <div
          ref={resizableDivRef}
          className="rounded-t-xl bg-white/5 border border-white/10 border-b-0 overflow-hidden applications-scrollbar mt-4 sm:mt-5 md:mt-6"
          style={{ height: `${currentHeight}px` }}
        >
          <div ref={contentRef} className="overflow-y-auto overflow-x-hidden h-full">
            {children}
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
      </>
    );
  },
);
ResizableContainer.displayName = 'ResizableContainer';

// Define keys for note statuses (original and passing)
type NoteStatusKey = 'SUBMITTED' | 'UNKNOWN' | 'QUIT';

// Note: NOTES_STATUS_TEXT is defined in NotesTooltip.tsx

// Clean UI interface decoupled from domain model
interface UiApplication {
  rank: number;
  studentId: string;
  priority: number;
  score: number;
  competitionType: string;
  otherUniversitiesCount: number;
  passes: boolean;
  passingToMorePriority: boolean;
  status: NoteStatusKey;
}

// Adapter function to convert domain Application to UI Application
function adaptApplicationToUi(domainApp: DomainApplication): UiApplication {
  // Compute status directly from domain fields
  const status: NoteStatusKey = domainApp.originalQuit
    ? 'QUIT'
    : domainApp.originalSubmitted
      ? 'SUBMITTED'
      : 'UNKNOWN';

  return {
    rank: domainApp.ratingPlace,
    studentId: domainApp.studentId,
    priority: domainApp.priority,
    score: domainApp.score,
    competitionType: domainApp.competitionType,
    otherUniversitiesCount: domainApp.anotherVarsitiesCount ?? 0,
    passes: domainApp.passingNow,
    passingToMorePriority: !!domainApp.passingToMorePriority,
    status,
  };
}

interface ApplicationsListProps {
  headingId?: number;
  varsityCode?: string;
}

function ApplicationsList({ headingId, varsityCode }: ApplicationsListProps) {
  const {
    applications: domainApplications,
    isLoading: applicationsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEnrichedApplications({ headingId, varsityCode });
  const applications: UiApplication[] = domainApplications.map(adaptApplicationToUi);

  // Pagination observer for infinite scroll
  const { sentinelRef } = usePaginationObserver(
    () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    {
      enabled: !applicationsLoading && applications.length > 0,
      rootMargin: INTERSECTION_CONFIG.ROOT_MARGIN,
      threshold: INTERSECTION_CONFIG.THRESHOLD,
    },
  );

  // Repository hooks for API calls
  const applicationRepo = useApplicationRepository();
  const headingRepo = useHeadingRepository();
  const resultsRepo = useResultsRepository();

  // Tooltip state for header hover
  const [tooltipInfo, setTooltipInfo] = useState<{
    text: string;
    top: number;
    left: number;
  } | null>(null);

  // Note: FADE_DURATION and HOVER_LEAVE_DELAY are defined in NotesTooltip.tsx

  // Interface for tooltip items with icon and text


  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<AdmissionData | null>(null);
  const [mainStatusForPopup, setMainStatusForPopup] = useState<string | null>(null); const [errorTooltip, setErrorTooltip] = useState<{ text: string; top: number; left: number } | null>(null);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ERROR_DURATION = 3750; // ms (25% shorter than 5s)
  const CANCEL_DURATION = 2625; // ms (25% shorter than 3.5s)



  const renderNotes = (app: UiApplication) => {
    const statuses = collectNoteStatuses(app);
    const icons = [];

    // Rule C: original quit
    if (app.status === 'QUIT') {
      icons.push(
        <div
          key="quit"
          className="flex items-center justify-center"
        >
          <NoSymbolIcon className="w-[1.1em] h-[1.1em] text-red-500" />
        </div>,
      );
    }
    // Rule B: original submitted or unknown
    else if (app.status === 'SUBMITTED' || app.status === 'UNKNOWN') {
      const status = app.status;
      const icon =
        status === 'SUBMITTED' ? (
          <CheckCircleIcon className="w-[1.1em] h-[1.1em] text-green-500" />
        ) : (
          <QuestionMarkCircleIcon className="w-[1.1em] h-[1.1em] text-gray-300" />
        );

      icons.push(
        <div
          key="status"
          className="flex items-center justify-center"
        >
          {icon}
        </div>,
      );

      // Rule B also checks for passing to more priority
      if (app.passingToMorePriority) {
        icons.push(
          <div
            key="passing"
            className="flex items-center justify-center"
          >
            <ArrowUpCircleIcon className="w-[1.1em] h-[1.1em] text-yellow-500" />
          </div>,
        );
      }
    }

    if (icons.length === 0) {
      return <span className="text-gray-400">—</span>;
    }

    return (
      <NotesTooltip statuses={statuses}>
        <div className='flex items-center justify-center h-full space-x-1.5 cursor-pointer'>
          {icons}
        </div>
      </NotesTooltip>
    );
  };

  const renderOtherUniversities = (value?: number) => {
    if (value === undefined || value === 0) {
      return <span className="text-gray-200">—</span>;
    }
    return <span className="text-gray-200 font-mono">{value}</span>;
  };

  const renderScore = (app: UiApplication) => {
    switch (app.competitionType) {
      case 'BVI':
        return 'БВИ';
      case 'TargetQuota':
        return 'ЦЕЛ';
      case 'DedicatedQuota':
        return 'СВО';
      case 'SpecialQuota':
        return 'СПК';
      case 'Regular':
      default:
        return app.score;
    }
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
    (app: UiApplication, e: React.MouseEvent<HTMLDivElement>) => {
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

      // Use the real API to fetch student admission data
      fetchStudentAdmissionData(app.studentId, applicationRepo, headingRepo, resultsRepo)
        .then((data) => {
          console.log('ApplicationsList received data from fetchStudentAdmissionData:', data);
          console.log('ApplicationsList - passingSection:', data.passingSection?.code);
          console.log('ApplicationsList - secondarySections:', data.secondarySections?.map(s => s.code));
          setPopupData(data);
          setMainStatusForPopup('Статус подачи документов'); // Always use the same heading
          setPopupOpen(true);
          setLoadingStudentId(null);
        })
        .catch((error: StudentNotFoundError | StudentDataError | StudentTimeoutError) => {
          const isNotFound = error.type === 'NOT_FOUND';
          const isTimeout = error.type === 'TIMEOUT';
          let tooltipMessage = 'Произошла ошибка';
          
          if (isNotFound) {
            tooltipMessage = 'ID не найден';
          } else if (isTimeout) {
            tooltipMessage = 'Превышено время ожидания';
          }
          
          const rect = getIdCellRect();
          setErrorTooltip({
            text: tooltipMessage,
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
          });
          setLoadingStudentId(null);
          setTimeout(() => setErrorTooltip(null), ERROR_DURATION);
        });
    },
    [loadingStudentId, applicationRepo, headingRepo, resultsRepo],
  );

  // Prevent background scrolling when popup is open - simple approach without viewport movement
  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (popupOpen) {
      // Simply prevent scrolling without changing position
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      document.body.style.overflow = '';
    }

    return () => {
      // Cleanup
      document.body.style.overflow = '';
    };
  }, [popupOpen]);

  // Helper function to collect applicable note statuses for an application
  const collectNoteStatuses = useCallback((app: UiApplication): (NoteStatusKey | 'PASSING_HIGHER')[] => {
    const statuses: (NoteStatusKey | 'PASSING_HIGHER')[] = [];

    // Add primary status first (left-to-right display order)
    if (app.status === 'QUIT') {
      statuses.push('QUIT');
    } else if (app.status === 'SUBMITTED' || app.status === 'UNKNOWN') {
      statuses.push(app.status);

      // Add passing status if applicable (only for non-quit statuses)
      if (app.passingToMorePriority) {
        statuses.push('PASSING_HIGHER');
      }
    }

    return statuses;
  }, []);



  return (
    <div>
      <h2 className="section-title">
        Список заявлений
      </h2>
      <ResizableContainer hasContent={applications.length > 0} applicationsCount={applications.length}>
        {applicationsLoading ? (
          // Show loading placeholder when applications are loading
          <div className="relative h-full">
            <TableLoadingPlaceholder />
          </div>
        ) : (
          <>
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

                {/* Notes Header with responsive text */}
                <div
                  className="header-cell px-2 py-1 xs:px-3 xs:py-2 text-center sticky top-0 bg-[#1b1b1f] z-10 truncate whitespace-nowrap cursor-help border-l border-[#1b1b1f] first:border-l-0"
                  onMouseEnter={(e) => showHeaderTooltip(e, 'Примечания')}
                  onMouseLeave={hideHeaderTooltip}
                >
                  <span className="hidden md:inline">Примечания</span>
                  <span className="hidden sm:inline md:hidden">Примеч.</span>
                  <span className="inline sm:hidden">П</span>
                </div>
              </div>

              {/* Body */}
              {applications.map((app, index) => {
                const isLoading = loadingStudentId === app.studentId;
                const rowClasses = `${isLoading ? 'bg-yellow-600/50 animate-pulse' : ''} col-span-6 grid grid-cols-subgrid transition-colors cursor-pointer ${app.passes
                  ? 'bg-gradient-to-r from-violet-700/40 to-fuchsia-700/40 hover:from-violet-700/50 hover:to-fuchsia-700/50'
                  : index % 2 === 0
                    ? 'bg-black/50 hover:bg-black/60'
                    : 'bg-black/40 hover:bg-black/60'
                  }`;
                return (
                  <div
                    key={`${index}-${app.rank}-${app.studentId}`}
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
                      {renderScore(app)}
                    </div>

                    {/* Other Universities */}
                    <div className={`px-2 py-1 xs:px-3 xs:py-2 text-center ${app.passes ? 'font-semibold text-white' : ''}`}>
                      {renderOtherUniversities(app.otherUniversitiesCount)}
                    </div>

                    {/* Notes */}
                    <div className='px-2 py-1 xs:px-3 xs:py-2 text-center'>
                      {renderNotes(app)}
                    </div>
                  </div>
                );
              })}

              {/* Sentinel element for intersection observer */}
              {applications.length > 0 && (
                <div
                  ref={sentinelRef}
                  className="col-span-6 h-px w-full"
                  aria-hidden="true"
                />
              )}

              {/* Pagination loading indicator */}
              {isFetchingNextPage && (
                <div className="col-span-6">
                  <PaginationLoadingIndicator rows={3} />
                </div>
              )}
            </div>

            {/* Fallback load more button */}
            {!isFetchingNextPage && hasNextPage && applications.length > 0 && (
              <LoadMoreButton
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
                hasMore={hasNextPage}
                disabled={applicationsLoading}
              />
            )}
          </>
        )}
      </ResizableContainer>

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



      {/* Popup overlay */}
      {popupOpen &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain"
            onClick={closePopup}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {popupData && mainStatusForPopup && <AdmissionStatusPopup {...popupData} studentId={selectedStudentId} mainStatus={mainStatusForPopup as unknown as string} onClose={closePopup} />}
            </div>
          </div>,
          document.body,
        )}

      {/* Header styling */}
      <style jsx>{`
        .header-cell {
          border-color: #3a3a42; /* Slightly lighter border for better visibility */
        }
        .applications-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .applications-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .applications-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
        .applications-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      {/* Tooltip animation */}
      <style jsx>{`
        @keyframes tooltip-fade-in {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tooltip-anim {
          animation: tooltip-fade-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default memo(ApplicationsList);
