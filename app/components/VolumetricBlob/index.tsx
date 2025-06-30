// Barrel export for VolumetricBlob component
// This maintains backward compatibility while allowing the component to be split into smaller parts

export { default } from './VolumetricBlobContainer';
export { VolumetricBlobCanvas } from './VolumetricBlobCanvas';

// Re-export types for convenience
export type { VolumetricBlobProps, BlobShapeParams, InteractiveBlobProps, ColorPalette } from './types'; 