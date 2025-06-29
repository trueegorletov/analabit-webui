'use client';

import React, { useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

interface PerformanceDebugProps {
  enabled?: boolean;
}

export const PerformanceDebug: React.FC<PerformanceDebugProps> = ({ enabled = false }) => {
  const { viewport, gl } = useThree();
  const [stats, setStats] = useState({
    fps: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    dpr: 1,
    viewport: { width: 0, height: 0 },
    detail: 'calculating...',
  });

  useFrame((state) => {
    if (!enabled) return;
    
    // Calculate FPS (rough estimation)
    const now = performance.now();
    const fps = Math.round(1000 / (now - (state.clock.elapsedTime * 1000 - now)));
    
    // Get rendering info
    const info = gl.info;
    
    // Estimate detail level based on viewport
    const isMobile = viewport.width < 6;
    const isTablet = viewport.width < 10;
    const detail = isMobile ? 32 : isTablet ? 48 : 64;
    const triangles = Math.round((detail * detail * 20) / 1000) + 'k'; // Rough estimate

    setStats({
      fps: isNaN(fps) ? 60 : Math.min(fps, 120),
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      dpr: gl.getPixelRatio(),
      viewport: { 
        width: Math.round(viewport.width * 10) / 10, 
        height: Math.round(viewport.height * 10) / 10, 
      },
      detail: `${detail} (${triangles} triangles)`,
    });
  });

  if (!enabled) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 1000,
      minWidth: '200px',
    }}>
      <h4 style={{ margin: '0 0 8px 0', color: '#4ade80' }}>Performance Debug</h4>
      <div>FPS: <span style={{ color: stats.fps > 45 ? '#4ade80' : stats.fps > 25 ? '#fbbf24' : '#ef4444' }}>{stats.fps}</span></div>
      <div>DPR: <span style={{ color: '#60a5fa' }}>{stats.dpr.toFixed(1)}x</span></div>
      <div>Detail: <span style={{ color: '#a78bfa' }}>{stats.detail}</span></div>
      <div>Triangles: <span style={{ color: '#fb7185' }}>{stats.triangles}</span></div>
      <div>Geometries: {stats.geometries}</div>
      <div>Textures: {stats.textures}</div>
      <div>Viewport: {stats.viewport.width} × {stats.viewport.height}</div>
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#9ca3af' }}>
        🟢 Optimized | 🔧 Adaptive Detail | ⚡ Frame Throttling
      </div>
    </div>
  );
}; 