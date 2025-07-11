import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { gsap } from 'gsap';
import { Copy } from 'lucide-react';
import { flashThenIdle, type Palette } from '../utils/glowHelpers';
import Link from 'next/link';
// Local types (previously imported from lib/api/types - temporarily here until main page API integration)
interface University {
  id: number;
  code: string;
  name: string;
}

interface Direction {
  id: string;
  name: string;
  score: number;
  rank: number | string;
  range: string;
  universityCode: string;
}

import {
  DirectionsLoadingPlaceholder,
} from './LoadingComponents';
import type { UniversityDirectionsState } from '@/hooks/useUniversitiesData';

interface UniversityBlockProps {
  university: University;
  palette: Palette;
  directionsState: UniversityDirectionsState | undefined;
  onFetchDirections: (universityCode: string) => Promise<void>;
}

export const UniversityBlock: React.FC<UniversityBlockProps> = ({
  university,
  palette,
  directionsState,
  onFetchDirections,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [hasTriedFetch, setHasTriedFetch] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const directionsContainerRef = useRef<HTMLDivElement>(null);
  const directionsContentRef = useRef<HTMLDivElement>(null);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipData, setTooltipData] = useState<{ top: number; left: number } | null>(null);
  // Persist glow timeline across renders so we can reliably kill it
  const glowTl = useRef<gsap.core.Timeline | null>(null);

  // Sort directions alphabetically by name
  const sortedDirections = useMemo(() => {
    if (!directionsState?.directions) return [];
    return [...directionsState.directions].sort((a, b) => a.name.localeCompare(b.name));
  }, [directionsState?.directions]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the block from toggling
    if (!copyButtonRef.current) return;

    const rect = copyButtonRef.current.getBoundingClientRect();
    setTooltipData({
      top: rect.top - 10, // Position above the button, relative to viewport
      left: rect.left + rect.width / 2, // Center horizontally, relative to viewport
    });

    const url = `${window.location.origin}/#${university.code}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for iOS Safari
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        textarea.remove();
      }
    } catch (err) {
      console.error('Clipboard write failed', err);
    }
  };

  useEffect(() => {
    if (tooltipData) {
      const showTimer = setTimeout(() => {
        setShowCopyTooltip(true);
      }, 10); // Brief delay to allow mounting before fade-in

      const hideTimer = setTimeout(() => {
        setShowCopyTooltip(false);
        const unmountTimer = setTimeout(() => {
          setTooltipData(null);
        }, 300); // Duration of fade-out transition
        return () => clearTimeout(unmountTimer);
      }, 1500); // Visible duration

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [tooltipData]);

  const handleToggle = async () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    // Reset fetch attempt flag when expanding
    if (newExpanded) {
      setHasTriedFetch(false);
    }

    // If expanding and no directions data, fetch it (though it should already be preloaded)
    if (newExpanded && !directionsState) {
      await onFetchDirections(university.code);
    }
  };

  // Only toggle expand/collapse when clicking outside the directions table
  const handleBlockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (expanded) {
      const container = blockRef.current?.querySelector('.directions-container');
      if (container && container.contains(e.target as Node)) {
        return;
      }
    }
    handleToggle();
  };

  // Handle dynamic height animation for expand/collapse
  useEffect(() => {
    const container = directionsContainerRef.current;
    const content = directionsContentRef.current;

    if (!container || !content) return;

    if (expanded) {
      // Measure the actual content height
      const contentHeight = content.scrollHeight;

      // Animate to the measured height
      gsap.fromTo(container,
        {
          maxHeight: 0,
          opacity: 0,
        },
        {
          maxHeight: contentHeight,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
        },
      );
    } else {
      // Animate to collapsed state
      gsap.to(container, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
      });
    }
  }, [expanded, directionsState?.directions]); // Re-run when directions data changes

  // Add resize observer to handle dynamic content changes
  useEffect(() => {
    const container = directionsContainerRef.current;
    const content = directionsContentRef.current;

    if (!container || !content || !expanded) return;

    const resizeObserver = new ResizeObserver(() => {
      if (expanded) {
        const contentHeight = content.scrollHeight;
        gsap.set(container, { maxHeight: contentHeight });
      }
    });

    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, [expanded, directionsState?.directions]);

  // Handle glow logic on expand/collapse
  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;

    if (expanded) {
      // Start combined flash → idle timeline
      glowTl.current?.kill();
      glowTl.current = flashThenIdle(el, palette);
      return () => {
        // Cleanup when dependencies change (palette switch)
        glowTl.current?.kill();
      };
    }

    // collapsed — kill tweens and reset styles
    gsap.killTweensOf(el, 'boxShadow');
    el.style.boxShadow = 'none';
    glowTl.current?.kill();
    return () => {
      // Ensure any in-progress timeline is killed on unmount
      glowTl.current?.kill();
    };
  }, [expanded, palette]);

  // Trigger fetch on first expansion if data is missing
  useEffect(() => {
    if (expanded && !hasTriedFetch && !directionsState) {
      (async () => {
        await onFetchDirections(university.code);
        setHasTriedFetch(true);
      })();
    }
  }, [expanded, hasTriedFetch, directionsState, onFetchDirections, university.code]);

  const renderDirectionsContent = () => {
    // Only show the directions table if we have actual directions data
    if (directionsState?.directions && directionsState.directions.length > 0) {
      return (
        <div className="directions-grid">
          {/* Header */}
          <div className="grid-header">
            <div className="grid-cell">Направление</div>
            <div className="grid-cell text-center">Баллы</div>
            <div className="grid-cell text-center">Место</div>
          </div>

          {/* Body */}
          {sortedDirections.map((direction: Direction) => (
            <Link
              key={direction.id}
              href={`/directions/${direction.id}`}
              className="grid-row"
              scroll={true}
            >
              <div className="grid-cell dir-name">
                <span className="dir-name-text" title={direction.name}>{direction.name}</span>
              </div>
              <div className="grid-cell points">
                {(() => {
                  if (direction.range && direction.range.includes('..')) {
                    const [max, min] = direction.range.split('..');
                    return (
                      <span className="inline-flex items-baseline gap-1">
                        <span className="max font-mono text-base sm:text-lg text-green-400 leading-none">
                          {max}
                        </span>
                        <span className="min font-mono text-[10px] sm:text-xs text-amber-400 leading-none">
                          {min}
                        </span>
                      </span>
                    );
                  }
                  return (
                    <span className="font-mono text-base sm:text-lg text-green-400">
                      {direction.score}
                    </span>
                  );
                })()}
              </div>
              <div className="grid-cell rank font-mono text-center">
                #{typeof direction.rank === 'string' ? direction.rank.replace(/^#/, '') : direction.rank}
              </div>
            </Link>
          ))}
        </div>
      );
    }

    // For ALL other cases (no data, loading, error, empty), show loading placeholder
    return <DirectionsLoadingPlaceholder />;
  };

  return (
    <>
      <div
        ref={blockRef}
        className="university-block"
        data-university-code={university.code}
        data-expanded={expanded}
        onClick={handleBlockClick}
      >
        <div className="block-header">
          <h3>{university.name}</h3>
          <div className="header-info">
            <div className="relative">
              <button
                ref={copyButtonRef}
                className="university-code-copy-btn"
                onClick={handleCopy}
              >
                <span className="university-code">{university.code}</span>
                <Copy size={12} className="copy-icon" />
              </button>
              {tooltipData && ReactDOM.createPortal(
                <div
                  className={`fixed pointer-events-none transition-opacity duration-300 ease-in-out -translate-x-1/2 -translate-y-full ${showCopyTooltip ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    left: tooltipData.left,
                    top: tooltipData.top,
                    zIndex: 9999,
                  }}
                >
                  <span className="whitespace-nowrap px-4 py-2 rounded-lg bg-neutral-800/95 text-white text-sm font-medium shadow-lg backdrop-blur-sm">
                    Скопировано
                  </span>
                </div>,
                document.body,
              )}
            </div>
            <button
              className={`toggle-btn ${expanded ? 'expanded' : ''}`}
              data-expand-button
              data-expanded={expanded}
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              <svg
                className="arrow-icon"
                viewBox="0 0 12 8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 1.5L6 6.5L10.5 1.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Animated container for directions table */}
        <div ref={directionsContainerRef} className="directions-container">
          <div ref={directionsContentRef}>
            {renderDirectionsContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        .header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .university-code-copy-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          border: 1px solid transparent;
        }
        
        .university-code-copy-btn:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .university-code-copy-btn .copy-icon {
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.2s;
        }

        .university-code-copy-btn:hover .copy-icon {
          color: rgba(255, 255, 255, 0.8);
        }

        .university-code {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: monospace;
        }

        /* Responsive downsizing */
        @media (max-width: 640px) {
          .university-code-copy-btn {
            padding: 0.2rem 0.45rem;
            gap: 0.3rem;
          }
          .university-code {
            font-size: 0.65rem;
          }
          .university-code-copy-btn .copy-icon {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .university-code-copy-btn {
            padding: 0.15rem 0.4rem;
            gap: 0.25rem;
          }
          .university-code {
            font-size: 0.55rem;
          }
          .university-code-copy-btn .copy-icon {
            width: 9px;
            height: 9px;
          }
        }
      `}</style>
    </>
  );
};