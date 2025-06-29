'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { InteractiveBlob } from './InteractiveBlob';
import { PerformanceDebug } from './PerformanceDebug';
import { colorPalettes } from './colorPalettes';
import { generateRandomParams, getNextKey } from './utils';

// Adaptive device pixel ratio function
const getAdaptiveDPR = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const maxDPR = isMobile ? 1.5 : 2; // Cap mobile at 1.5x, desktop at 2x
  return Math.min(maxDPR, typeof window !== 'undefined' ? window.devicePixelRatio : 1);
};

interface VolumetricBlobProps {
  showPerformanceDebug?: boolean;
}

export default function VolumetricBlob({ showPerformanceDebug = false }: VolumetricBlobProps) {
  const [blobParams] = useState(() => ({ key: getNextKey(), ...generateRandomParams() }));
  const [dpr, setDpr] = useState(getAdaptiveDPR);
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always');

  const { key, ...shapeParams } = blobParams;

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
    <div className="w-full h-full flex items-center justify-center relative overflow-visible" style={{ zIndex: 0 }}>
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
          <InteractiveBlob key={key} {...shapeParams} palettes={colorPalettes} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.2} // Reduced from 0.5 for better performance
            makeDefault // Performance: make this the default controls to avoid conflicts
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