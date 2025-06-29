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

export interface InteractiveBlobProps extends BlobShapeParams {
  palettes: ColorPalette[];
  transitionDuration?: number;
}

export interface VolumetricBlobProps {
  showPerformanceDebug?: boolean;
} 