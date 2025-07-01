import React from 'react';
import { useUniversityColors } from '../../../hooks/useUniversityColors';

interface FlairButtonProps {
  code: string;
  label: string;
  onClick?: () => void;
}

/**
 * FlairButton — colorful pill linking to a university section
 */
export const FlairButton: React.FC<FlairButtonProps> = React.memo(({ code, label, onClick }) => {
  const { getUniversityColor } = useUniversityColors();
  const palette = getUniversityColor(code);

  return (
    <a
      href={`/#${code}`}
      data-university-code={code}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="tag popup-tag"
      style={{
        background: palette?.gradient || 'linear-gradient(120deg, rgba(255,94,98,0.6), rgba(255,153,102,0.6))',
        backgroundSize: '200% 200%',
        boxShadow: `0 0 18px 3px ${palette?.glow || 'rgba(255,120,99,0.3)'}, 0 0 8px 1px rgba(255,255,255,0.1)`,
      }}
    >
      {label}
    </a>
  );
});

FlairButton.displayName = 'FlairButton'; 