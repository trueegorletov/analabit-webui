'use client';

import React, { useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { getDetailLevel } from './utils';

interface PerformanceDebugProps {
  enabled?: boolean;
}

// Static styles extracted to avoid recreation
const containerStyle: React.CSSProperties = {
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
};

const titleStyle: React.CSSProperties = {
  margin: '0 0 8px 0',
  color: '#4ade80',
};

const footerStyle: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '10px',
  color: '#9ca3af',
};

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

  // Throttle updates to max 4 Hz (250ms intervals)
  const lastUpdateTime = React.useRef(0);
  const UPDATE_INTERVAL = 250; // 4 Hz = 250ms

  // Memoize FPS color calculation to avoid recreation
  const fpsColor = useMemo(() => {
    return stats.fps > 45 ? '#4ade80' : stats.fps > 25 ? '#fbbf24' : '#ef4444';
  }, [stats.fps]);

  useFrame((_, delta) => {
    if (!enabled) return;
    
    const now = performance.now();
    if (now - lastUpdateTime.current < UPDATE_INTERVAL) return;
    lastUpdateTime.current = now;
    
    // Calculate FPS using delta (fps = 1 / delta)
    const fps = Math.round(1 / delta);
    
    // Get rendering info
    const info = gl.info;
    
    // Use shared detail estimation utility
    const { detail, description } = getDetailLevel(viewport);
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
      detail: `${detail} (${triangles} triangles, ${description})`,
    });
  });

  if (!enabled) return null;

  return (
    <div style={containerStyle}>
      <h4 style={titleStyle}>Performance Debug</h4>
      <div>FPS: <span style={{ color: fpsColor }}>{stats.fps}</span></div>
      <div>DPR: <span style={{ color: '#60a5fa' }}>{stats.dpr.toFixed(1)}x</span></div>
      <div>Detail: <span style={{ color: '#a78bfa' }}>{stats.detail}</span></div>
      <div>Triangles: <span style={{ color: '#fb7185' }}>{stats.triangles}</span></div>
      <div>Geometries: {stats.geometries}</div>
      <div>Textures: {stats.textures}</div>
      <div>Viewport: {stats.viewport.width} × {stats.viewport.height}</div>
      <div style={footerStyle}>
        🟢 Optimized | 🔧 Adaptive Detail | ⚡ Frame Throttling
      </div>
    </div>
  );
}; 