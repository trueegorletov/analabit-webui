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