#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import the color palettes and university list (using require for now)
const colorPalettes = [
  {
    name: 'coral-orange',
    gradient: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(255, 153, 102, 0.6))',
    glow: 'rgba(255, 120, 99, 0.3)',
    accent: '#ff6b6b',
  },
  {
    name: 'blue-purple',
    gradient: 'linear-gradient(120deg, rgba(95, 114, 190, 0.6), rgba(102, 153, 255, 0.6))',
    glow: 'rgba(98, 135, 229, 0.3)',
    accent: '#5f72be',
  },
  {
    name: 'cyan-blue',
    gradient: 'linear-gradient(120deg, rgba(125, 226, 252, 0.6), rgba(102, 153, 255, 0.6))',
    glow: 'rgba(110, 190, 253, 0.3)',
    accent: '#7de2fc',
  },
  {
    name: 'orange-purple',
    gradient: 'linear-gradient(120deg, rgba(255, 153, 102, 0.6), rgba(95, 114, 190, 0.6))',
    glow: 'rgba(177, 135, 142, 0.3)',
    accent: '#ff9966',
  },
  {
    name: 'coral-cyan',
    gradient: 'linear-gradient(120deg, rgba(255, 94, 98, 0.6), rgba(125, 226, 252, 0.6))',
    glow: 'rgba(191, 143, 179, 0.3)',
    accent: '#ff5e62',
  },
  // Extended palettes for additional universities
  {
    name: 'purple-violet',
    gradient: 'linear-gradient(120deg, rgba(138, 43, 226, 0.6), rgba(74, 0, 224, 0.6))',
    glow: 'rgba(106, 21, 225, 0.3)',
    accent: '#8a2be2',
  },
  {
    name: 'emerald-teal',
    gradient: 'linear-gradient(120deg, rgba(16, 185, 129, 0.6), rgba(20, 184, 166, 0.6))',
    glow: 'rgba(18, 184, 147, 0.3)',
    accent: '#10b981',
  },
  {
    name: 'rose-pink',
    gradient: 'linear-gradient(120deg, rgba(244, 63, 94, 0.6), rgba(236, 72, 153, 0.6))',
    glow: 'rgba(240, 67, 123, 0.3)',
    accent: '#f43f5e',
  },
  {
    name: 'amber-yellow',
    gradient: 'linear-gradient(120deg, rgba(245, 158, 11, 0.6), rgba(234, 179, 8, 0.6))',
    glow: 'rgba(239, 168, 9, 0.3)',
    accent: '#f59e0b',
  },
  {
    name: 'indigo-blue',
    gradient: 'linear-gradient(120deg, rgba(79, 70, 229, 0.6), rgba(59, 130, 246, 0.6))',
    glow: 'rgba(69, 100, 237, 0.3)',
    accent: '#4f46e5',
  },
  {
    name: 'green-lime',
    gradient: 'linear-gradient(120deg, rgba(34, 197, 94, 0.6), rgba(132, 204, 22, 0.6))',
    glow: 'rgba(83, 200, 58, 0.3)',
    accent: '#22c55e',
  },
  {
    name: 'red-orange',
    gradient: 'linear-gradient(120deg, rgba(239, 68, 68, 0.6), rgba(249, 115, 22, 0.6))',
    glow: 'rgba(244, 91, 45, 0.3)',
    accent: '#ef4444',
  },
  {
    name: 'violet-purple',
    gradient: 'linear-gradient(120deg, rgba(139, 92, 246, 0.6), rgba(168, 85, 247, 0.6))',
    glow: 'rgba(153, 88, 246, 0.3)',
    accent: '#8b5cf6',
  },
  {
    name: 'teal-cyan',
    gradient: 'linear-gradient(120deg, rgba(20, 184, 166, 0.6), rgba(6, 182, 212, 0.6))',
    glow: 'rgba(13, 183, 189, 0.3)',
    accent: '#14b8a6',
  },
  {
    name: 'slate-gray',
    gradient: 'linear-gradient(120deg, rgba(71, 85, 105, 0.6), rgba(100, 116, 139, 0.6))',
    glow: 'rgba(85, 100, 122, 0.3)',
    accent: '#475569',
  },
  {
    name: 'fuchsia-magenta',
    gradient: 'linear-gradient(120deg, rgba(217, 70, 239, 0.6), rgba(236, 72, 153, 0.6))',
    glow: 'rgba(226, 71, 196, 0.3)',
    accent: '#d946ef',
  },
  {
    name: 'sky-blue',
    gradient: 'linear-gradient(120deg, rgba(14, 165, 233, 0.6), rgba(59, 130, 246, 0.6))',
    glow: 'rgba(36, 147, 239, 0.3)',
    accent: '#0ea5e9',
  },
  {
    name: 'emerald-green',
    gradient: 'linear-gradient(120deg, rgba(16, 185, 129, 0.6), rgba(34, 197, 94, 0.6))',
    glow: 'rgba(25, 191, 111, 0.3)',
    accent: '#10b981',
  },
  {
    name: 'orange-red',
    gradient: 'linear-gradient(120deg, rgba(249, 115, 22, 0.6), rgba(239, 68, 68, 0.6))',
    glow: 'rgba(244, 91, 45, 0.3)',
    accent: '#f97316',
  },
  {
    name: 'purple-indigo',
    gradient: 'linear-gradient(120deg, rgba(147, 51, 234, 0.6), rgba(79, 70, 229, 0.6))',
    glow: 'rgba(113, 60, 231, 0.3)',
    accent: '#9333ea',
  },
  {
    name: 'cyan-teal',
    gradient: 'linear-gradient(120deg, rgba(6, 182, 212, 0.6), rgba(20, 184, 166, 0.6))',
    glow: 'rgba(13, 183, 189, 0.3)',
    accent: '#06b6d4',
  },
  {
    name: 'rose-red',
    gradient: 'linear-gradient(120deg, rgba(244, 63, 94, 0.6), rgba(239, 68, 68, 0.6))',
    glow: 'rgba(241, 65, 81, 0.3)',
    accent: '#f43f5e',
  },
  {
    name: 'lime-green',
    gradient: 'linear-gradient(120deg, rgba(132, 204, 22, 0.6), rgba(34, 197, 94, 0.6))',
    glow: 'rgba(83, 200, 58, 0.3)',
    accent: '#84cc16',
  },
  {
    name: 'yellow-amber',
    gradient: 'linear-gradient(120deg, rgba(234, 179, 8, 0.6), rgba(245, 158, 11, 0.6))',
    glow: 'rgba(239, 168, 9, 0.3)',
    accent: '#eab308',
  },
  {
    name: 'pink-rose',
    gradient: 'linear-gradient(120deg, rgba(236, 72, 153, 0.6), rgba(244, 63, 94, 0.6))',
    glow: 'rgba(240, 67, 123, 0.3)',
    accent: '#ec4899',
  },
];

const universityList = [
  'МФТИ', 'МГУ', 'СПбГУ', 'ВШЭ', 'ИТМО', 'ТГУ', 'ЮФУ', 'НГУ', 'ТПУ',
  'МЭИ', 'РУДН', 'КФУ', 'ДВФУ', 'РАНХиГС', 'СПбГЭТУ', 'РГГУ', 'МИЭТ',
  'ПНИПУ', 'НИУ МИЭТ', 'СФУ', 'ТюмГУ', 'НИЯУ МИФИ',
];

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Finds a palette index that's different from the last used one
 */
function findDifferentIndex(availableIndices, lastUsedIndex, usedIndices) {
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
 * Generates a random university color mapping with the constraint that
 * adjacent universities (in the tag list order) have different gradients
 */
function generateUniversityColorMapping() {
  // Shuffle the palette indices to get random assignment
  const availablePaletteIndices = Array.from({ length: colorPalettes.length }, (_, i) => i);
  shuffleArray(availablePaletteIndices);
  
  const mapping = {};
  let usedIndices = new Set();
  let lastUsedIndex = null;
  
  for (let i = 0; i < universityList.length; i++) {
    const university = universityList[i];
    
    // Find a palette index that's different from the previous one
    let selectedIndex;
    
    if (lastUsedIndex === null) {
      // First university, pick the first available
      selectedIndex = availablePaletteIndices[0];
    } else {
      // Find an index different from the last used one
      selectedIndex = findDifferentIndex(availablePaletteIndices, lastUsedIndex, usedIndices);
    }
    
    // If we've used all palettes, reset and start over but still avoid adjacent duplicates
    if (usedIndices.size >= colorPalettes.length) {
      usedIndices.clear();
      // Re-shuffle for the next round
      shuffleArray(availablePaletteIndices);
    }
    
    usedIndices.add(selectedIndex);
    lastUsedIndex = selectedIndex;
    
    mapping[university] = {
      paletteIndex: selectedIndex,
      palette: colorPalettes[selectedIndex],
    };
  }
  
  return mapping;
}

/**
 * Save the generated mapping to a JSON file
 */
function saveUniversityColorMapping(mapping, filePath = 'lib/colors/universityColorMapping.json') {
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
 * Main execution function
 */
function generateAndSave() {
  console.log('🎨 Generating new university color mapping...');
  
  const mapping = generateUniversityColorMapping();
  saveUniversityColorMapping(mapping);
  
  console.log('✨ Color generation complete!');
}

// Run the color generation
try {
  generateAndSave();
} catch (error) {
  console.error('❌ Failed to generate colors:', error);
  process.exit(1);
} 