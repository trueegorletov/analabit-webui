'use client';

import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { InteractiveBlob } from './InteractiveBlob';
import { PerformanceDebug } from './PerformanceDebug';
import { colorPalettes } from './colorPalettes';
import type { BlobShapeParams } from './types';

// Centralized tuning parameters for rotation/impulse
const ROTATION_CONFIG = {
  baseAutoRotateSpeed: 0.17,           // default when not loading
  loadingAutoRotateSpeed: 0.55,      // noticeably faster during loading
} as const;

interface VolumetricBlobCanvasProps {
  blobKey: number;
  shapeParams: BlobShapeParams;
  dpr: number;
  frameloop: 'always' | 'never';
  loading: boolean;
  error: boolean;
  showPerformanceDebug: boolean;
  onDecline: () => void;
  onIncline: () => void;
  onFallback: () => void;
  onControlsReady: (controls: OrbitControlsImpl) => void;
}

export const VolumetricBlobCanvas: React.FC<VolumetricBlobCanvasProps> = ({
  blobKey,
  shapeParams,
  dpr,
  frameloop,
  loading,
  error,
  showPerformanceDebug,
  onDecline,
  onIncline,
  onFallback,
  onControlsReady,
}) => {
  // Ref to OrbitControls for camera impulse rotation
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Memoize lights to prevent recreation
  const lights = useMemo(() => (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
    </>
  ), []);

  return (
    <Canvas 
      camera={{ position: [0, 0, 8], fov: 45 }} 
      key={blobKey}
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
        onDecline={onDecline}
        onIncline={onIncline}
        onFallback={onFallback}
      >
        {lights}
        <InteractiveBlob
          key={blobKey}
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
            controlsRef.current = instance;
            // Set initial properties
            instance.autoRotate = true;
            instance.autoRotateSpeed = loading 
              ? ROTATION_CONFIG.loadingAutoRotateSpeed 
              : ROTATION_CONFIG.baseAutoRotateSpeed;
            // Notify parent component
            onControlsReady(instance);
          }}
        />
        <PerformanceDebug enabled={showPerformanceDebug} />
      </PerformanceMonitor>
    </Canvas>
  );
}; 