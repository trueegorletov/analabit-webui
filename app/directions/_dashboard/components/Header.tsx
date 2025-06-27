import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Header() {
  const tagRef = useRef<HTMLDivElement>(null);

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

    // Glow effect animation like main page
    gsap.to(tag, {
      boxShadow: '0 0 18px 3px rgba(110, 190, 253, 0.3), 0 0 8px 1px rgba(255, 255, 255, 0.1)',
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
  }, []);

  return (
    <div className="mb-8 text-center">
      <div
        ref={tagRef}
        className="tag-button-large inline-block mb-3 cursor-pointer transition-transform duration-200 ease-out"
        style={{
          background:
            'linear-gradient(120deg, rgba(125, 226, 252, 0.6), rgba(102, 153, 255, 0.6))',
          backgroundSize: '200% 200%',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
          boxShadow:
            '0 0 14px 3px rgba(110, 190, 253, 0.3), 0 0 6px 1.5px rgba(255, 255, 255, 0.12)',
          border: 'none',
        }}
      >
        СПбГУ
      </div>
      <div className="mx-auto max-w-fit">
        <h1 className="text-4xl md:text-4xl sm:text-3xl xs:text-2xl font-bold text-white mb-1 transition-all duration-300 hover:text-gray-100 relative inline-block">
          Программная инженерия
          <span
            className="absolute bottom-0 left-0 w-full h-0.5 opacity-60"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(125, 226, 252, 0.8), transparent)',
              transform: 'translateY(4px)',
            }}
          />
        </h1>
      </div>
    </div>
  );
}
