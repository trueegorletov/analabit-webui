import type { ColorPalette } from './types';

export const colorPalettes: ColorPalette[] = [
  { a: '#ff6b6b', b: '#f0e68c', c: '#48dbfb' },
  { a: '#ff8a00', b: '#e52e71', c: '#4f4f4f' },
  { a: '#6a11cb', b: '#2575fc', c: '#ffffff' },
  { a: '#00c9ff', b: '#92fe9d', c: '#f0f0f0' },
  { a: '#ff7e5f', b: '#feb47b', c: '#d3d3d3' },
  { a: '#8e2de2', b: '#4a00e0', c: '#90f3ff' },
  { a: '#ff71ce', b: '#01cdfe', c: '#05ffa1' },
  { a: '#ff5e62', b: '#ff9966', c: '#f0f0f0' },
  { a: '#138808', b: '#228B22', c: '#556B2F' },
  { a: '#373B44', b: '#4286f4', c: '#ffffff' },
  { a: '#ff0000', b: '#00ff00', c: '#0000ff' },
  { a: '#2c3e50', b: '#bdc3c7', c: '#ffffff' },
];

export const errorPalettes: ColorPalette[] = [
  { a: '#ff2d55', b: '#ff5e5e', c: '#ff8b8b' },
  { a: '#ff1744', b: '#ff616f', c: '#ff8a80' },
  { a: '#ff5252', b: '#ff867f', c: '#ffb4ae' },
];

/**
 * Get color palettes based on context
 * @param options Configuration for palette selection
 * @returns Array of color palettes
 */
export const getPalettes = (options: { error?: boolean } = {}): ColorPalette[] => {
  return options.error ? errorPalettes : colorPalettes;
}; 