import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useUniversityColors } from '../../../../hooks/useUniversityColors';

interface HeaderProps {
  headingName?: string;
  varsityCode?: string;
  varsityName?: string;
}

export default function Header({ headingName, varsityCode, varsityName }: HeaderProps) {
  const tagRef = useRef<HTMLAnchorElement>(null);
  const { getUniversityColor } = useUniversityColors();
  
  const color = varsityCode ? getUniversityColor(varsityCode) : undefined;
  const gradient = color?.gradient || 'linear-gradient(120deg, rgba(125, 226, 252, 0.6), rgba(102, 153, 255, 0.6))';
  const glow = color?.glow || 'rgba(110, 190, 253, 0.3)';

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;

    // Background gradient animation like main page
    gsap.set(tag, {
      backgroundPosition: '0% 0%',
    });

    gsap.to(tag, {
      backgroundPosition: '100% 100%',
      duration: gsap.utils.random(10, 15),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Glow effect animation using the new color system
    gsap.to(tag, {
      boxShadow: `0 0 18px 3px ${glow}, 0 0 8px 1px rgba(255, 255, 255, 0.1)`,
      duration: gsap.utils.random(6, 10),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: gsap.utils.random(0, 2),
    });

    // Hover scaling using GSAP like main page
    const onEnter = () =>
      gsap.to(tag, { scale: 1.08, duration: 0.2, ease: 'power2.out' });
    const onLeave = () =>
      gsap.to(tag, { scale: 1, duration: 0.2, ease: 'power2.out' });

    tag.addEventListener('mouseenter', onEnter);
    tag.addEventListener('mouseleave', onLeave);

    return () => {
      tag.removeEventListener('mouseenter', onEnter);
      tag.removeEventListener('mouseleave', onLeave);
    };
  }, [glow]);

  return (
    <div className="mb-8 text-center">
      {varsityCode && (
        <Link
          href={`/#${varsityCode}`}
          ref={tagRef}
          className="tag-button-large inline-block mb-3 cursor-pointer transition-transform duration-200 ease-out"
          style={{
            background: gradient,
            backgroundSize: '200% 200%',
            padding: '8px 20px',
            borderRadius: '24px',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            boxShadow: `0 0 14px 3px ${glow}, 0 0 6px 1.5px rgba(255, 255, 255, 0.12)`,
            border: 'none',
            textDecoration: 'none',
          }}
        >
          {varsityName || varsityCode.toUpperCase()}
        </Link>
      )}
      <div className="mx-auto max-w-fit">
        <h1 className="title">{headingName || 'Направление'}</h1>
      </div>
    </div>
  );
}
