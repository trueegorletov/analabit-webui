'use client';

import { gsap } from 'gsap';
import React, { useState, useRef, useEffect } from 'react';

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        closePanel();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250); // duration should match transition
  };

  useEffect(() => {
    if (buttonRef.current) {
      // Even subtler background brightness pulse with pauses
      gsap.to(buttonRef.current, {
        backgroundColor: 'rgba(42, 42, 42, 0.72)',
        duration: 2.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        repeatDelay: 5,
      });
    }
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        aria-label="Справка о сервисе"
        onClick={() => {
          if (open) {
            closePanel();
          } else {
            setOpen(true);
          }
        }}
        className="help-button overflow-hidden fixed bottom-4 left-4 md:bottom-6 md:left-6 flex items-center justify-center w-14 h-14 md:w-18 md:h-18 rounded-full bg-neutral-900/70 backdrop-blur-md border border-white/15 text-white text-2xl font-semibold hover:bg-neutral-800/80 transition-transform transition-colors shadow-lg shadow-black/30 z-50"
      >
        ?
      </button>

      {(open || closing) && (
        <div
          ref={panelRef}
          className={`fixed bottom-[88px] left-4 md:bottom-[99px] md:left-6 w-72 max-w-[calc(100vw-2rem)] bg-neutral-900/80 backdrop-blur-md border border-white/15 text-white rounded-xl p-4 shadow-2xl shadow-black/40 transition-all duration-250 transform ${closing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
          <p className="text-sm mb-4 leading-snug">
            Нужна подробная справка о&nbsp;работе сервиса? Откройте страницу помощи.
          </p>
          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center font-semibold py-2 rounded-md bg-white text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            Открыть справку
          </a>
        </div>
      )}
    </>
  );
}