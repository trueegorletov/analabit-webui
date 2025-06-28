'use client';

import { useEffect } from 'react';

export default function ParallaxBackground() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const update = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      // 7% of scroll distance for subtle effect
      const shift = Math.min(y * 0.07, 200); // cap to 200px to avoid extreme shift
      document.documentElement.style.setProperty('--bg-shift', shift.toString());
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return null;
} 