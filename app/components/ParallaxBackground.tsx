'use client';

import { useEffect, useRef } from 'react';

export default function ParallaxBackground() {
  const isEnabled = useRef(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const update = () => {
      if (!isEnabled.current) return;
      const y = window.scrollY || document.documentElement.scrollTop;
      // 7% of scroll distance for subtle effect
      const shift = Math.min(y * 0.07, 200); // cap to 200px to avoid extreme shift
      document.documentElement.style.setProperty('--bg-shift', shift.toString());
    };
    
    const handleDisable = () => { isEnabled.current = false; };
    const handleEnable = () => { isEnabled.current = true; update(); };

    document.addEventListener('disableParallax', handleDisable);
    document.addEventListener('enableParallax', handleEnable);
    
    update();
    window.addEventListener('scroll', update, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', update);
      document.removeEventListener('disableParallax', handleDisable);
      document.removeEventListener('enableParallax', handleEnable);
    };
  }, []);

  return null;
} 