import React, { useRef } from 'react';

interface ProbabilityTabsProps {
  tabs: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export const ProbabilityTabs: React.FC<ProbabilityTabsProps> = ({ tabs, selected, onSelect }) => {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (idx: number) => {
    const btn = buttonsRef.current[idx];
    btn?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.indexOf(selected);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentIndex + 1) % tabs.length;
      onSelect(tabs[next]);
      focusTab(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentIndex - 1 + tabs.length) % tabs.length;
      onSelect(tabs[prev]);
      focusTab(prev);
    }
  };

  return (
    <div role="tablist" aria-label="Probability" className="flex gap-2 mb-4" onKeyDown={handleKeyDown}>
      {tabs.map((t, idx) => (
        <button
          key={t}
          ref={(el) => {
            buttonsRef.current[idx] = el;
          }}
          role="tab"
          aria-selected={selected === t}
          className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors backdrop-blur-sm ${selected === t ? 'bg-gradient-to-r from-fuchsia-600/40 to-violet-600/40 border border-white/20 shadow-inner' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
          onClick={() => onSelect(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}; 