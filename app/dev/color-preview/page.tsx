'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { config } from '@/lib/config';
import existingMapping from '@/lib/colors/universityColorMapping.json';

// Types
interface ColorPalette {
  name: string;
  gradient: string;
  glow: string;
  accent: string;
}

type UniversityColorMapping = Record<string, { palette: ColorPalette; name: string; }>;
type Varsity = { id: number; code: string; name: string; };

// Copy of color palettes to make this module self-contained
const colorPalettes: ColorPalette[] = [
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
];


// University data matching the user's provided structure
const UNIVERSITIES = [
  { id: 1, code: 'hse_perm', name: 'ВШЭ (Пермь)' },
  { id: 2, code: 'hse_nn', name: 'ВШЭ (НН)' },
  { id: 3, code: 'rzgmu', name: 'РязГМУ' },
  { id: 4, code: 'mipt', name: 'МФТИ' },
  { id: 5, code: 'itmo', name: 'ИТМО' },
  { id: 6, code: 'hse_spb', name: 'ВШЭ (СПб)' },
  { id: 7, code: 'hse_msk', name: 'ВШЭ (Москва)' },
  { id: 8, code: 'spbsu', name: 'СПбГУ' },
  { id: 9, code: 'spbstu', name: 'СПбПУ' },
  { id: 10, code: 'mirea', name: 'МИРЭА' },
  { id: 11, code: 'rsmu', name: 'РНИМУ' },
  { id: 12, code: 'fmsmu', name: 'ПМГМУ' },
  { id: 13, code: 'mephi', name: 'МИФИ' },
  { id: 14, code: 'msu', name: 'МГУ' },
];

// Existing mapping from JSON (typed properly)
const EXISTING_MAPPING = existingMapping as UniversityColorMapping;

// Self-contained color generation logic
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function findDifferentIndex(
  availableIndices: number[], 
  lastUsedIndex: number, 
  usedIndices: Set<number>,
): number {
  for (const index of availableIndices) {
    if (index !== lastUsedIndex && !usedIndices.has(index)) {
      return index;
    }
  }
  
  for (const index of availableIndices) {
    if (index !== lastUsedIndex) {
      return index;
    }
  }
  
  return availableIndices[0];
}

function generateColorsForMissingUniversities(
  universities: Varsity[], 
  existingMapping: UniversityColorMapping,
): UniversityColorMapping {
  const palettes = colorPalettes;
  const mapping: UniversityColorMapping = { ...existingMapping };
  
  // Find universities that are not in the existing mapping
  const missingUniversities = universities.filter(uni => !mapping[uni.code]);
  
  if (missingUniversities.length === 0) {
    return mapping;
  }
  
  // Shuffle the palette indices for random assignment
  const availablePaletteIndices = Array.from({ length: palettes.length }, (_, i) => i);
  shuffleArray(availablePaletteIndices);
  
  const usedIndices: Set<number> = new Set();
  let lastUsedIndex: number | null = null;
  
  // Sort missing universities alphabetically to maintain consistency
  const sortedMissingUniversities = [...missingUniversities].sort((a, b) => a.name.localeCompare(b.name));
  
  for (let i = 0; i < sortedMissingUniversities.length; i++) {
    const university = sortedMissingUniversities[i];
    
    let selectedIndex: number;
    
    if (lastUsedIndex === null) {
      selectedIndex = availablePaletteIndices[0];
    } else {
      selectedIndex = findDifferentIndex(availablePaletteIndices, lastUsedIndex, usedIndices);
    }
    
    if (usedIndices.size >= palettes.length) {
      usedIndices.clear();
      shuffleArray(availablePaletteIndices);
    }
    
    usedIndices.add(selectedIndex);
    lastUsedIndex = selectedIndex;
    
    mapping[university.code] = {
      palette: palettes[selectedIndex],
      name: university.name,
    };
  }
  
  return mapping;
}

function generateFullRandomMapping(universities: Varsity[]): UniversityColorMapping {
  const palettes = colorPalettes;
  
  // Shuffle the palette indices for random assignment
  const availablePaletteIndices = Array.from({ length: palettes.length }, (_, i) => i);
  shuffleArray(availablePaletteIndices);
  
  const mapping: UniversityColorMapping = {};
  const usedIndices: Set<number> = new Set();
  let lastUsedIndex: number | null = null;
  
  // Sort universities alphabetically for consistent adjacent checking
  const sortedUniversities = [...universities].sort((a, b) => a.name.localeCompare(b.name));
  
  for (let i = 0; i < sortedUniversities.length; i++) {
    const university = sortedUniversities[i];
    
    let selectedIndex: number;
    
    if (lastUsedIndex === null) {
      selectedIndex = availablePaletteIndices[0];
    } else {
      selectedIndex = findDifferentIndex(availablePaletteIndices, lastUsedIndex, usedIndices);
    }
    
    if (usedIndices.size >= palettes.length) {
      usedIndices.clear();
      shuffleArray(availablePaletteIndices);
    }
    
    usedIndices.add(selectedIndex);
    lastUsedIndex = selectedIndex;
    
    mapping[university.code] = {
      palette: palettes[selectedIndex],
      name: university.name,
    };
  }
  
  return mapping;
}


export default function ColorPreviewPage() {
  // Check if color preview is enabled
  if (!config.features.enableColorPreview) {
    notFound();
  }
  
  // Use hardcoded data and load existing mapping with any missing universities getting random colors
  const [mappings, setMappings] = useState<UniversityColorMapping>(() => 
    generateColorsForMissingUniversities(UNIVERSITIES, EXISTING_MAPPING),
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getUniversityColor = (code: string) => {
    return mappings[code]?.palette;
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      const newMapping = generateFullRandomMapping(UNIVERSITIES);
      setMappings(newMapping);
      setIsRegenerating(false);
    }, 500);
  };

  const handleCopyJSON = async () => {
    try {
      const jsonData = JSON.stringify(mappings, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  // Sort universities alphabetically by name to match real application behavior
  const sortedUniversities = [...UNIVERSITIES].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎨 University Color Preview
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Preview and test university flair button colors
          </p>
          <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <p className="text-yellow-200 text-sm">
              ⚠️ This page is only available in development mode
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Color Management</h2>
              <p className="text-gray-300 text-sm">
                Current mapping loaded from JSON file by default. Generate new random colors or copy current mapping JSON
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {isRegenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Regenerating...
                  </>
                ) : (
                  <>
                    🎨 Regenerate Colors
                  </>
                )}
              </button>
              <button
                onClick={handleCopyJSON}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  copyStatus === 'success'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : copyStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copyStatus === 'success' ? (
                  <>
                    ✅ Copied!
                  </>
                ) : copyStatus === 'error' ? (
                  <>
                    ❌ Failed
                  </>
                ) : (
                  <>
                    📋 Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* University Flair Buttons Grid */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Flair Buttons Preview</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {sortedUniversities.map((university) => {
              const palette = getUniversityColor(university.code);
              return (
                <div
                  key={university.code}
                  className="tag"
                  style={{
                    background: palette?.gradient || 'linear-gradient(120deg, rgba(255,94,98,0.6), rgba(255,153,102,0.6))',
                    backgroundSize: '200% 200%',
                    boxShadow: `0 0 18px 3px ${palette?.glow || 'rgba(255,120,99,0.3)'}, 0 0 8px 1px rgba(255,255,255,0.1)`,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {university.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Mapping Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Color Mapping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedUniversities.map((university) => {
              const palette = getUniversityColor(university.code);
              return (
                <div
                  key={university.code}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        background: palette?.gradient || 'gray',
                        boxShadow: `0 0 10px 2px ${palette?.glow || 'rgba(255,255,255,0.3)'}`,
                      }}
                    />
                    <div>
                      <div className="text-white font-medium">{university.name}</div>
                      <div className="text-gray-400 text-sm">{university.code}</div>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-gray-300">
                      <span className="text-gray-400">Palette:</span> {palette?.name || 'Unknown'}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-gray-400">Accent:</span> {palette?.accent || 'N/A'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* JSON Info Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">JSON Mapping Info</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-black/20 rounded p-3">
              <p className="text-gray-300 mb-2">📁 Target file path:</p>
              <code className="text-green-400 font-mono">/lib/colors/universityColorMapping.json</code>
            </div>
            <div className="bg-black/20 rounded p-3">
              <p className="text-gray-300 mb-2">📋 Usage:</p>
              <ol className="text-gray-300 space-y-1 ml-4">
                <li>1. Page loads existing mapping from JSON file by default</li>
                <li>2. Missing universities get random colors (no adjacent duplicates)</li>
                <li>3. Click &quot;Regenerate Colors&quot; to generate completely new random colors</li>
                <li>4. Click &quot;Copy JSON&quot; to copy current mapping (includes new universities)</li>
                <li>5. Paste into <code className="text-blue-400">/lib/colors/universityColorMapping.json</code></li>
              </ol>
            </div>
            <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
              <p className="text-green-300 mb-2">✨ Current status:</p>
              <div className="text-sm space-y-1">
                <div className="text-green-200">
                  📊 Total universities: <span className="font-mono">{UNIVERSITIES.length}</span>
                </div>
                <div className="text-green-200">
                  🎨 From existing mapping: <span className="font-mono">{Object.keys(EXISTING_MAPPING).length}</span>
                </div>
                <div className="text-green-200">
                  🆕 Generated for new: <span className="font-mono">{UNIVERSITIES.length - Object.keys(EXISTING_MAPPING).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>This preview shows the same colors used across all components:</p>
          <p>Header flair buttons • University blocks • Admission popup flair buttons</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Universities from hardcoded list • Colors loaded from universityColorMapping.json</p>
          </div>
        </div>
      </div>
    </div>
  );
}