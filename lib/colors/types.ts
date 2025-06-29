export interface ColorPalette {
  name: string;
  gradient: string;
  glow: string;
  // Optional additional properties for future extensibility
  accent?: string;
  background?: string;
}

export interface UniversityColorMapping {
  [universityName: string]: {
    paletteIndex: number;
    palette: ColorPalette;
  };
}

export interface GenerationConfig {
  universities: string[];
  palettes: ColorPalette[];
  seed?: number; // For reproducible generation
} 