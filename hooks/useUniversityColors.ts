import { useMemo, useCallback } from 'react';
import type { ColorPalette, UniversityColorMapping } from '../lib/colors/types';
import { colorPalettes, getPaletteByIndex } from '../lib/colors/palette';

// Static import of the generated mapping to ensure SSR compatibility
import universityColorMappingData from '../lib/colors/universityColorMapping.json';

// Extract the mapping from the imported data
const universityColorMapping: UniversityColorMapping = (universityColorMappingData as { mapping: UniversityColorMapping }).mapping;

// Fallback mapping for development or when mapping file doesn't exist
const fallbackMapping: UniversityColorMapping = {
  'МФТИ': { paletteIndex: 0, palette: colorPalettes[0] },
  'МГУ': { paletteIndex: 1, palette: colorPalettes[1] },
  'СПбГУ': { paletteIndex: 2, palette: colorPalettes[2] },
  'ВШЭ': { paletteIndex: 3, palette: colorPalettes[3] },
  'ИТМО': { paletteIndex: 4, palette: colorPalettes[4] },
  'ТГУ': { paletteIndex: 5, palette: colorPalettes[5] },
  'ЮФУ': { paletteIndex: 6, palette: colorPalettes[6] },
  'НГУ': { paletteIndex: 7, palette: colorPalettes[7] },
  'ТПУ': { paletteIndex: 8, palette: colorPalettes[8] },
  'МЭИ': { paletteIndex: 9, palette: colorPalettes[9] },
  'РУДН': { paletteIndex: 10, palette: colorPalettes[10] },
  'КФУ': { paletteIndex: 11, palette: colorPalettes[11] },
  'ДВФУ': { paletteIndex: 12, palette: colorPalettes[12] },
  'РАНХиГС': { paletteIndex: 13, palette: colorPalettes[13] },
  'СПбГЭТУ': { paletteIndex: 14, palette: colorPalettes[14] },
  'РГГУ': { paletteIndex: 15, palette: colorPalettes[15] },
  'МИЭТ': { paletteIndex: 16, palette: colorPalettes[16] },
  'ПНИПУ': { paletteIndex: 17, palette: colorPalettes[17] },
  'НИУ МИЭТ': { paletteIndex: 18, palette: colorPalettes[18] },
  'СФУ': { paletteIndex: 19, palette: colorPalettes[19] },
  'ТюмГУ': { paletteIndex: 20, palette: colorPalettes[20] },
  'НИЯУ МИФИ': { paletteIndex: 21, palette: colorPalettes[21] },
};

/**
 * Custom hook for accessing university colors throughout the application
 * 
 * @example
 * const { getUniversityColor, getAllMappings } = useUniversityColors();
 * const spbguColor = getUniversityColor('СПбГУ');
 */
export function useUniversityColors() {
  // Memoize the color mappings to avoid unnecessary re-renders
  const colorMappings = useMemo(() => {
    // Use the generated mapping if available, otherwise fall back to default
    return universityColorMapping && Object.keys(universityColorMapping).length > 0 
      ? universityColorMapping 
      : fallbackMapping;
  }, []);

  // Get color for a specific university
  const getUniversityColor = useCallback((universityName: string): ColorPalette | null => {
    // Safety check for undefined/null/empty university names
    if (!universityName || typeof universityName !== 'string') {
      console.warn('getUniversityColor called with invalid university name:', universityName);
      return null;
    }
    
    const mapping = colorMappings[universityName];
    if (mapping) {
      return mapping.palette;
    }
    
    // Fallback: calculate based on hash of university name
    const hash = hashString(universityName);
    const paletteIndex = hash % colorPalettes.length;
    return getPaletteByIndex(paletteIndex);
  }, [colorMappings]);

  // Get all university mappings
  const getAllMappings = useCallback((): UniversityColorMapping => {
    return colorMappings;
  }, [colorMappings]);

  // Get palette index for a university
  const getUniversityPaletteIndex = useCallback((universityName: string): number => {
    const mapping = colorMappings[universityName];
    if (mapping) {
      return mapping.paletteIndex;
    }
    
    // Fallback: calculate based on hash
    const hash = hashString(universityName);
    return hash % colorPalettes.length;
  }, [colorMappings]);

  // Check if a university has a specific color assigned
  const hasUniversityColor = useCallback((universityName: string): boolean => {
    return universityName in colorMappings;
  }, [colorMappings]);

  // Get gradient style for CSS
  const getUniversityGradientStyle = useCallback((universityName: string) => {
    const color = getUniversityColor(universityName);
    return color ? {
      background: color.gradient,
      backgroundSize: '200% 200%',
    } : {};
  }, [getUniversityColor]);

  // Get glow style for CSS
  const getUniversityGlowStyle = useCallback((universityName: string, intensity: number = 1) => {
    const color = getUniversityColor(universityName);
    return color ? {
      boxShadow: `0 0 ${18 * intensity}px ${3 * intensity}px ${color.glow}, 0 0 ${8 * intensity}px ${1.5 * intensity}px rgba(255, 255, 255, 0.12)`,
    } : {};
  }, [getUniversityColor]);

  // Get complete styles for university elements
  const getUniversityStyles = useCallback((universityName: string, options: {
    includeGlow?: boolean;
    glowIntensity?: number;
    additionalStyles?: React.CSSProperties;
  } = {}) => {
    const { includeGlow = false, glowIntensity = 1, additionalStyles = {} } = options;
    
    return {
      ...getUniversityGradientStyle(universityName),
      ...(includeGlow ? getUniversityGlowStyle(universityName, glowIntensity) : {}),
      ...additionalStyles,
    };
  }, [getUniversityGradientStyle, getUniversityGlowStyle]);

  return {
    getUniversityColor,
    getAllMappings,
    getUniversityPaletteIndex,
    hasUniversityColor,
    getUniversityGradientStyle,
    getUniversityGlowStyle,
    getUniversityStyles,
    colorPalettes,
  };
}

/**
 * Simple string hash function for consistent fallback colors
 */
function hashString(str: string): number {
  // Safety check for undefined/null/empty strings
  if (!str || typeof str !== 'string') {
    return 0; // Return consistent hash for invalid inputs
  }
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
} 