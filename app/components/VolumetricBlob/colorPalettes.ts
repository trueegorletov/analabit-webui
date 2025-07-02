import type { ColorPalette } from './types';

export const colorPalettes: ColorPalette[] = [
  // 🔥 Acidic sunset – intense but proven good combo (kept)
  { a: '#ff6b6b', b: '#f0e68c', c: '#48dbfb' },

  // 🌇 Sunset to neon surf – removed grey, replaced with electric-blue highlight
  { a: '#ff8a00', b: '#e52e71', c: '#00d4ff' },

  // 💜💙 Ultraviolet dream – bright violet, deep blue, clean white
  { a: '#6a11cb', b: '#2575fc', c: '#ffffff' },

  // 🧊 Tropic lagoon – cyan, lime-mint, crisp white
  { a: '#00c9ff', b: '#92fe9d', c: '#f0f0f0' },

  // 🍑 Peach fizz – coral & peach with light candy-pink glow
  { a: '#ff7e5f', b: '#feb47b', c: '#ffd9e3' },

  // 🔮 Nebula pulse – neon purple gradient with icy highlight
  { a: '#8e2de2', b: '#4a00e0', c: '#90f3ff' },

  // 🌈 Laser rave – magenta, cyan and lime in full neon force
  { a: '#ff71ce', b: '#01cdfe', c: '#05ffa1' },

  // 🌋 Lava pop – red-orange gradient with bright lemon accent
  { a: '#ff5e62', b: '#ff9966', c: '#fff45f' },

  // ⚡ Radioactive jelly – lime neon, ultraviolet, electric cyan
  { a: '#39ff14', b: '#d700ff', c: '#00e5ff' },

  // 💗 Electric candy – hot pink meets aqua and laser-yellow
  { a: '#ff009d', b: '#0aefff', c: '#fff45f' },

  // 🟥🟦 Primary overload – classic RGB pushed to neon extremes
  { a: '#ff0000', b: '#00ffea', c: '#fffb00' },

  // 🔥 Flamingo surf – vivid red-orange into magenta with cyan surf
  { a: '#ff512f', b: '#dd2476', c: '#24c6dc' },
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