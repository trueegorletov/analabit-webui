import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { flashThenIdle, type Palette } from '../utils/glowHelpers';
import type { University, Direction, UniversityDirectionsState } from '../../lib/api/types';
import { 
  DirectionsLoadingPlaceholder, 
} from './LoadingComponents';

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
  // Persist glow timeline across renders so we can reliably kill it
  const glowTl = useRef<gsap.core.Timeline | null>(null);

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

  const renderDirectionsContent = () => {
    // Only show the directions table if we have actual directions data
    if (directionsState?.directions && directionsState.directions.length > 0) {
      return (
        <table className="directions-table">
          <tbody>
            {directionsState.directions.map((direction: Direction) => (
              <tr key={direction.id}>
                <td className="dir-name">
                  <a href={`/directions/${direction.id}`} title={direction.name}>
                    {direction.name}
                  </a>
                </td>
                <td className="score">{direction.score}</td>
                <td className="rank">{direction.rank}</td>
                <td className="range">{direction.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // For ALL other cases (no data, loading, error, empty), show loading placeholder
    // This ensures we never show error blocks or "not found" messages
    if (!hasTriedFetch) {
      onFetchDirections(university.code);
      setHasTriedFetch(true);
    }
    
    return <DirectionsLoadingPlaceholder />;
  };

  return (
    <>
      <div
        ref={blockRef}
        className="university-block"
        data-university-code={university.code}
        data-expanded={expanded}
        onClick={handleToggle}
      >
        <div className="block-header">
          <h3>{university.name}</h3>
          <div className="header-info">
            <span className="university-code">{university.code}</span>
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
        {expanded && renderDirectionsContent()}
      </div>

      <style jsx>{`
        .header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .university-code {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
      `}</style>
    </>
  );
}; 