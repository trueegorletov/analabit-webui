'use client';

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { VolumetricBlobCanvas } from './VolumetricBlobCanvas';
import { generateRandomParams, getNextKey } from './utils';
import type { VolumetricBlobProps } from './types';

// Adaptive device pixel ratio function
const getAdaptiveDPR = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxDPR = isMobile ? 1.5 : 2; // Cap mobile at 1.5x, desktop at 2x
  return Math.min(maxDPR, typeof window !== 'undefined' ? window.devicePixelRatio : 1);
};

// Centralized tuning parameters for rotation/impulse
const ROTATION_CONFIG = {
  baseAutoRotateSpeed: 0.17,           // default when not loading
  loadingAutoRotateSpeed: 0.55,      // noticeably faster during loading
  impulseLoopsMin: 3,               // min full rotations
  impulseLoopsMax: 5,               // max full rotations
  impulseDurationPerLoop: 1.8,      // seconds per rotation (slower initial speed)
  impulseEasing: 'expo.out',        // easing for impulse decay
} as const;

export default function VolumetricBlobContainer({ 
  showPerformanceDebug = false, 
  loading = false, 
  error = false, 
}: VolumetricBlobProps) {
  const [blobParams] = useState(() => ({ key: getNextKey(), ...generateRandomParams() }));
  const [dpr, setDpr] = useState(getAdaptiveDPR);
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

  const { key, ...shapeParams } = blobParams;

  // Container ref retained only for layout reference (no animation applied)
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref to OrbitControls for camera impulse rotation
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Store previous loading state to detect rising edge
  const prevLoading = useRef<boolean>(false);

  // Store previous error state to detect rising edge
  const prevError = useRef<boolean>(false);

  // Add effect to toggle autoRotate according to loading state
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Enable autorotate always; adjust speed depending on state
    controls.autoRotate = true;
    if (loading) {
      controls.autoRotateSpeed = ROTATION_CONFIG.loadingAutoRotateSpeed;
    } else {
      controls.autoRotateSpeed = ROTATION_CONFIG.baseAutoRotateSpeed;
    }
  }, [loading]);

  // Impulse spin on loading start (rotate camera via OrbitControls, not the blob)
  useEffect(() => {
    if (!loading || prevLoading.current === loading) {
      prevLoading.current = loading;
      return;
    }
    prevLoading.current = loading;

    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    const dir = Math.random() < 0.5 ? -1 : 1; // left/right
    const loops = Math.floor(Math.random() * (ROTATION_CONFIG.impulseLoopsMax - ROTATION_CONFIG.impulseLoopsMin + 1)) + ROTATION_CONFIG.impulseLoopsMin;
    const magnitude = dir * (Math.PI * 2 * loops);

    const startAngle = controls.getAzimuthalAngle();

    gsap.to({ angle: startAngle }, {
      angle: startAngle + magnitude,
      duration: loops * ROTATION_CONFIG.impulseDurationPerLoop,
      ease: ROTATION_CONFIG.impulseEasing,
      onUpdate: function () {
        controls.setAzimuthalAngle(this.targets()[0].angle);
        controls.update();
      },
    });
  }, [loading]);

  // Impulse spin on error was removed to lighten GPU/CPU load; keep only pulse + color change
  useEffect(() => {
    // Track state transitions, but intentionally do nothing on error start
    if (prevError.current !== error) {
      prevError.current = error;
    }
  }, [error]);

  // Performance: Pause rendering when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Performance Monitor Handlers
  const handleDecline = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Performance declining, reducing DPR');
    }
    setDpr(prev => Math.max(0.5, prev * 0.8)); // Reduce DPR by 20%
  };

  const handleIncline = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Performance improving, increasing DPR');
    }
    setDpr(prev => Math.min(getAdaptiveDPR(), prev * 1.1)); // Increase DPR by 10%
  };

  const handleFallback = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Performance fallback: minimum settings');
    }
    setDpr(0.5); // Emergency fallback to 0.5x DPR
  };

  const handleControlsReady = (controls: OrbitControlsImpl) => {
    controlsRef.current = controls;
  };

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-visible" style={{ zIndex: -1 }}>
      <VolumetricBlobCanvas
        blobKey={key}
        shapeParams={shapeParams}
        dpr={dpr}
        frameloop={frameloop}
        loading={loading}
        error={error}
        showPerformanceDebug={showPerformanceDebug}
        onDecline={handleDecline}
        onIncline={handleIncline}
        onFallback={handleFallback}
        onControlsReady={handleControlsReady}
      />
      
      {/* Performance Info Comment */}
      {showPerformanceDebug && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Performance Optimized: Detail 32-64 (was 128) | Adaptive DPR | Frame Throttling
        </div>
      )}
    </div>
  );
} 