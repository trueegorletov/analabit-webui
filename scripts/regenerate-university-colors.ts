#!/usr/bin/env tsx

import { generateUniversityColorMapping, saveUniversityColorMapping } from '../lib/colors/generator';
import { colorPalettes } from '../lib/colors/palette';
import path from 'path';

// University codes from the user's provided data
const USER_UNIVERSITY_CODES = [
  'hse_perm',
  'hse_nn', 
  'rzgmu',
  'mipt',
  'itmo',
  'hse_spb',
  'hse_msk',
  'spbsu',
  'spbstu',
  'mirea',
  'rsmu',
  'fmsmu',
  'mephi'
];

/**
 * Regenerates university color mapping for the current university set
 * Ensures no two adjacent universities have the same palette color
 */
async function regenerateUniversityColors() {
  console.log('🎨 Regenerating university color mapping...');
  console.log(`📊 Processing ${USER_UNIVERSITY_CODES.length} universities`);
  console.log(`🎭 Available palettes: ${colorPalettes.length}`);
  
  // Generate new mapping with the user's university codes
  const mapping = generateUniversityColorMapping({
    universities: USER_UNIVERSITY_CODES,
    palettes: colorPalettes,
    // Use a fixed seed for reproducible results during development
    seed: 42
  });
  
  // Save to the standard location
  const outputPath = path.join(process.cwd(), 'lib/colors/universityColorMapping.json');
  await saveUniversityColorMapping(mapping, outputPath);
  
  console.log('\n✨ Color regeneration complete!');
  console.log('🔄 The new mapping will be used across all components:');
  console.log('   - Header flair buttons');
  console.log('   - University blocks');
  console.log('   - Admission popup flair buttons');
  
  // Verify no adjacent duplicates based on alphabetical sorting by university name
  console.log('\n🔍 Verifying no adjacent duplicates (alphabetical order)...');
  
  // University name mapping
  const UNIVERSITY_NAMES: Record<string, string> = {
    'hse_perm': 'ВШЭ (Пермь)',
    'hse_nn': 'ВШЭ (НН)',
    'rzgmu': 'РязГМУ',
    'mipt': 'МФТИ',
    'itmo': 'ИТМО',
    'hse_spb': 'ВШЭ (СПб)',
    'hse_msk': 'ВШЭ (Москва)',
    'spbsu': 'СПбГУ',
    'spbstu': 'СПбПУ',
    'mirea': 'МИРЭА',
    'rsmu': 'РНИМУ',
    'fmsmu': 'ПМГМУ',
    'mephi': 'МИФИ'
  };
  
  // Sort universities alphabetically by name (same as real application)
  const sortedCodes = USER_UNIVERSITY_CODES.sort((a, b) => {
    const nameA = UNIVERSITY_NAMES[a] || a;
    const nameB = UNIVERSITY_NAMES[b] || b;
    return nameA.localeCompare(nameB);
  });
  
  let hasAdjacentDuplicates = false;
  for (let i = 1; i < sortedCodes.length; i++) {
    const prevCode = sortedCodes[i - 1];
    const currentCode = sortedCodes[i];
    const prevPalette = mapping[prevCode]?.paletteIndex;
    const currentPalette = mapping[currentCode]?.paletteIndex;
    
    if (prevPalette === currentPalette) {
      const prevName = UNIVERSITY_NAMES[prevCode] || prevCode;
      const currentName = UNIVERSITY_NAMES[currentCode] || currentCode;
      console.log(`❌ Adjacent duplicate found: ${prevName} (${prevCode}) and ${currentName} (${currentCode}) both use palette ${prevPalette}`);
      hasAdjacentDuplicates = true;
    }
  }
  
  if (!hasAdjacentDuplicates) {
    console.log('✅ No adjacent duplicates found!');
  }
  
  console.log('\n📝 To preview the new colors, run the dev server and visit /dev/color-preview');
}

// Run the script
if (require.main === module) {
  regenerateUniversityColors().catch(console.error);
}

export { regenerateUniversityColors, USER_UNIVERSITY_CODES };