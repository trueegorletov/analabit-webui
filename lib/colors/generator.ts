import type { UniversityColorMapping, GenerationConfig } from './types';
import { colorPalettes, universityList } from './palette';

/**
 * Generates a random university color mapping with the constraint that
 * adjacent universities (in the tag list order) have different gradients
 */
export function generateUniversityColorMapping(config?: Partial<GenerationConfig>): UniversityColorMapping {
  const universities = config?.universities || universityList;
  const palettes = config?.palettes || colorPalettes;
  const seed = config?.seed;
  
  // Use seed for reproducible generation if provided
  if (seed !== undefined) {
    seedRandom(seed);
  }
  
  // Shuffle the palette indices to get random assignment
  const availablePaletteIndices = Array.from({ length: palettes.length }, (_, i) => i);
  shuffleArray(availablePaletteIndices);
  
  const mapping: UniversityColorMapping = {};
  const usedIndices: Set<number> = new Set();
  let lastUsedIndex: number | null = null;
  
  for (let i = 0; i < universities.length; i++) {
    const university = universities[i];
    
    // Find a palette index that's different from the previous one
    let selectedIndex: number;
    
    if (lastUsedIndex === null) {
      // First university, pick the first available
      selectedIndex = availablePaletteIndices[0];
    } else {
      // Find an index different from the last used one
      selectedIndex = findDifferentIndex(availablePaletteIndices, lastUsedIndex, usedIndices);
    }
    
    // If we've used all palettes, reset and start over but still avoid adjacent duplicates
    if (usedIndices.size >= palettes.length) {
      usedIndices.clear();
      // Re-shuffle for the next round
      shuffleArray(availablePaletteIndices);
    }
    
    usedIndices.add(selectedIndex);
    lastUsedIndex = selectedIndex;
    
    mapping[university] = {
      paletteIndex: selectedIndex,
      palette: palettes[selectedIndex],
    };
  }
  
  return mapping;
}

/**
 * Finds a palette index that's different from the last used one
 */
function findDifferentIndex(
  availableIndices: number[], 
  lastUsedIndex: number, 
  usedIndices: Set<number>,
): number {
  // First, try to find an unused index that's different from the last one
  for (const index of availableIndices) {
    if (index !== lastUsedIndex && !usedIndices.has(index)) {
      return index;
    }
  }
  
  // If all unused indices are the same as the last one (rare edge case),
  // just pick any available index that's different
  for (const index of availableIndices) {
    if (index !== lastUsedIndex) {
      return index;
    }
  }
  
  // Fallback: if we somehow can't find a different index, 
  // return the first available (shouldn't happen with enough palettes)
  return availableIndices[0];
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Simple seeded random number generator for reproducible results
 */
let randomSeed = 1;
function seedRandom(seed: number): void {
  randomSeed = seed;
  // Override Math.random with seeded version
  Math.random = function(): number {
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    return randomSeed / 233280;
  };
}

/**
 * Save the generated mapping to a JSON file
 */
export async function saveUniversityColorMapping(
  mapping: UniversityColorMapping, 
  filePath: string = 'lib/colors/universityColorMapping.json',
): Promise<void> {
  const fs = await import('fs');
  const path = await import('path');
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Add metadata to the saved file
  const dataToSave = {
    generatedAt: new Date().toISOString(),
    universities: Object.keys(mapping),
    mapping,
  };
  
  fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
  console.log(`✅ University color mapping saved to ${filePath}`);
  console.log(`📊 Generated colors for ${Object.keys(mapping).length} universities`);
  
  // Log the assignment for review
  console.log('\n🎨 Color assignments:');
  Object.entries(mapping).forEach(([university, { palette }]) => {
    console.log(`${university} → ${palette.name}`);
  });
}

/**
 * Load university color mapping from JSON file
 */
export async function loadUniversityColorMapping(
  filePath: string = 'lib/colors/universityColorMapping.json',
): Promise<UniversityColorMapping | null> {
  try {
    const fs = await import('fs');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return data.mapping || data; // Support both new and old format
  } catch (error) {
    console.warn(`⚠️ Could not load color mapping from ${filePath}:`, error);
    return null;
  }
}

/**
 * CLI function for npm script
 */
export async function generateAndSave(): Promise<void> {
  console.log('🎨 Generating new university color mapping...');
  
  const mapping = generateUniversityColorMapping();
  await saveUniversityColorMapping(mapping);
  
  console.log('✨ Color generation complete!');
} 