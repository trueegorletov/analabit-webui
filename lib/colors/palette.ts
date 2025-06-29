import type { ColorPalette } from './types';

// Unified color palette combining current approaches and extending for all universities
export const colorPalettes: ColorPalette[] = [
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
  // Extra palette to ensure we have enough colors
  {
    name: 'pink-rose',
    gradient: 'linear-gradient(120deg, rgba(236, 72, 153, 0.6), rgba(244, 63, 94, 0.6))',
    glow: 'rgba(240, 67, 123, 0.3)',
    accent: '#ec4899',
  },
];

// University list - extracted from current implementation
export const universityList = [
  'МФТИ', 'МГУ', 'СПбГУ', 'ВШЭ', 'ИТМО', 'ТГУ', 'ЮФУ', 'НГУ', 'ТПУ',
  'МЭИ', 'РУДН', 'КФУ', 'ДВФУ', 'РАНХиГС', 'СПбГЭТУ', 'РГГУ', 'МИЭТ',
  'ПНИПУ', 'НИУ МИЭТ', 'СФУ', 'ТюмГУ', 'НИЯУ МИФИ',
];

// Helper function to get palette by index
export function getPaletteByIndex(index: number): ColorPalette {
  return colorPalettes[index % colorPalettes.length];
}

// Helper function to find palette by name
export function getPaletteByName(name: string): ColorPalette | undefined {
  return colorPalettes.find(palette => palette.name === name);
} 