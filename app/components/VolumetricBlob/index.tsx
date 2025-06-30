'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { InteractiveBlob } from './InteractiveBlob';
import { PerformanceDebug } from './PerformanceDebug';
import { colorPalettes } from './colorPalettes';
import { generateRandomParams, getNextKey } from './utils';
import { gsap } from 'gsap';
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

// Pulse (scale) config
const PULSE_CONFIG_LOAD = {
  minScale: 0.8,
  duration: 0.8,
  easing: 'sine.inOut',
} as const;

const PULSE_CONFIG_ERROR = {
  minScale: 0.9, // more gentle
  duration: 0.5,
  easing: 'sine.inOut',
} as const;

// Error impulse config (separate from loading)
const ERROR_IMPULSE_CONFIG = {
  impulseLoopsMin: 1,               // min full rotations on error
  impulseLoopsMax: 2,               // max full rotations on error
  impulseDurationPerLoop: 2.5,      // seconds per rotation
  impulseEasing: 'expo.out',        // easing for impulse decay
  delayBeforeImpulse: 0.6,          // start spin after palette nearly done
} as const;

// Minimal subset of OrbitControls API we use
interface SimpleOrbitControls {
  getAzimuthalAngle: () => number;
  setAzimuthalAngle: (angle: number) => void;
  update: () => void;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export default function VolumetricBlob({ showPerformanceDebug = false, loading = false, error = false }: VolumetricBlobProps) {
  const [blobParams] = useState(() => ({ key: getNextKey(), ...generateRandomParams() }));
  const [dpr, setDpr] = useState(getAdaptiveDPR);
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

  const { key, ...shapeParams } = blobParams;

  // Ref to the container for pulse animation
  const containerRef = useRef<HTMLDivElement>(null);

  // Ref to OrbitControls for camera impulse rotation
  const controlsRef = useRef<SimpleOrbitControls | null>(null);

  // Store previous loading state to detect rising edge
  const prevLoading = useRef<boolean>(false);

  // Store previous error state to detect rising edge
  const prevError = useRef<boolean>(false);

  // Pulse & animation speed adjustment based on props.loading
  useEffect(() => {
    if (!containerRef.current) return;
    if (loading || error) {
      const config = loading ? PULSE_CONFIG_LOAD : PULSE_CONFIG_ERROR;
      gsap.to(containerRef.current, {
        scale: config.minScale,
        duration: config.duration,
        yoyo: true,
        repeat: -1,
        ease: config.easing,
      });
    } else {
      // Stop pulse, reset scale
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, { scale: 1, duration: 0.3, ease: 'power1.out' });
    }
    return () => {
      gsap.killTweensOf(containerRef.current);
    };
  }, [loading, error]);

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

  // Impulse spin on error start (rotate camera via OrbitControls, not the blob)
  useEffect(() => {
    if (!error || prevError.current === error) {
      prevError.current = error;
      return;
    }
    prevError.current = error;

    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    const dir = Math.random() < 0.5 ? -1 : 1; // random direction
    const loops = Math.floor(Math.random() * (ERROR_IMPULSE_CONFIG.impulseLoopsMax - ERROR_IMPULSE_CONFIG.impulseLoopsMin + 1)) + ERROR_IMPULSE_CONFIG.impulseLoopsMin;
    const magnitude = dir * (Math.PI * 2 * loops);

    const startAngle = controls.getAzimuthalAngle();

    const targetObj = { angle: startAngle };

    // Schedule rotation after delay to sync with palette fade
    const delayed = gsap.delayedCall(ERROR_IMPULSE_CONFIG.delayBeforeImpulse, () => {
      gsap.to(targetObj, {
        angle: startAngle + magnitude,
        duration: loops * ERROR_IMPULSE_CONFIG.impulseDurationPerLoop,
        ease: ERROR_IMPULSE_CONFIG.impulseEasing,
        onUpdate: function () {
          controls.setAzimuthalAngle(targetObj.angle);
          controls.update();
        },
      });
    });

    // Cleanup: kill delayed call if component unmounts / deps change
    return () => {
      delayed.kill();
    };
  }, [error]);

  // Memoize lights to prevent recreation
  const lights = useMemo(() => (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  ), []);

  // Performance: Pause rendering when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      setFrameloop(document.hidden ? 'never' : 'always');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center relative overflow-visible" style={{ zIndex: -1 }}>
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }} 
        key={key}
        dpr={dpr}
        frameloop={frameloop}
        style={{
          width: '140%',
          height: '140%',
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          zIndex: -1,
        }}
        gl={{
          powerPreference: 'high-performance',
          antialias: false, // Disabled for performance, especially at low DPR
          alpha: true, // Enable transparency for proper background blending
          stencil: false,
        }}
      >
        <PerformanceMonitor
          bounds={() => [20, 75]} // fps thresholds: decline below 20, incline above 75
          flipflops={2} // Allow 2 performance adjustments before fallback
          onDecline={() => {
            console.log('Performance declining, reducing DPR');
            setDpr(prev => Math.max(0.5, prev * 0.8)); // Reduce DPR by 20%
          }}
          onIncline={() => {
            console.log('Performance improving, increasing DPR');
            setDpr(prev => Math.min(getAdaptiveDPR(), prev * 1.1)); // Increase DPR by 10%
          }}
          onFallback={() => {
            console.log('Performance fallback: minimum settings');
            setDpr(0.5); // Emergency fallback to 0.5x DPR
          }}
        >
          {lights}
          <InteractiveBlob
            key={key}
            {...shapeParams}
            palettes={colorPalettes}
            transitionDuration={loading ? 2 : 5}
            loading={loading}
            error={error}
          />
          <OrbitControls 
            enableZoom={false} 
            dampingFactor={0.1} 
            enablePan={false}
            ref={(instance) => {
              if (!instance) return;
              const c = instance as unknown as SimpleOrbitControls;
              c.autoRotate = true;
              c.autoRotateSpeed = ROTATION_CONFIG.baseAutoRotateSpeed;
              controlsRef.current = c;
            }}
          />
          <PerformanceDebug enabled={showPerformanceDebug} />
        </PerformanceMonitor>
      </Canvas>
      
      {/* Performance Info Comment */}
      {showPerformanceDebug && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          Performance Optimized: Detail 32-64 (was 128) | Adaptive DPR | Frame Throttling
        </div>
      )}
    </div>
  );
} 