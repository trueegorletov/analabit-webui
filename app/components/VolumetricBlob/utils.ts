import type { BlobShapeParams } from './types';

let keyCounter = 0;

export const generateRandomParams = (): BlobShapeParams => ({
  speed: Math.random() * 0.3 + 0.1,
  frequency: Math.random() * 0.8 + 0.5,
  amplitude: Math.random() * 0.4 + 0.2,
});

export const getNextKey = (): number => {
  return keyCounter++;
}; 

/**
 * Shared detail estimation utility for adaptive geometry detail
 * Based on viewport size to optimize performance across devices
 */
export const getAdaptiveDetail = (viewport: { width: number; height?: number }) => {
  const isMobile = viewport.width < 6; // Rough mobile detection in r3f units
  
  if (isMobile) return { detail: 24, description: 'Mobile', triangleEstimate: '~10k' };
  return { detail: 32, description: 'Desktop', triangleEstimate: '~41k' };
};

/**
 * Legacy function for PerformanceDebug component compatibility
 * @deprecated Use getAdaptiveDetail instead
 */
export const getDetailLevel = (viewport: { width: number; height: number }) => {
  const { detail, description } = getAdaptiveDetail(viewport);
  return { detail, description };
}; 