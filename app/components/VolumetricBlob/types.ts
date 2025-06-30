export interface BlobShapeParams {
  speed: number;
  frequency: number;
  amplitude: number;
}

export interface ColorPalette {
  a: string;
  b: string;
  c: string;
}

export interface InteractiveBlobProps {
  speed: number;
  frequency: number;
  amplitude: number;
  palettes: ColorPalette[];
  transitionDuration?: number;
  loading?: boolean;
}

export interface VolumetricBlobProps {
  showPerformanceDebug?: boolean;
  /** Whether parent is in loading state – used to accelerate colors & trigger pulse */
  loading?: boolean;
} 