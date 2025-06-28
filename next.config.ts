import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove SCSS configuration as we've moved to pure CSS in Step 5

  // Step 9: CI/CD & TypeScript Optimization
  experimental: {
    // Optimize package imports for better tree shaking
    optimizePackageImports: ['lucide-react', 'framer-motion'],

    // Enable memory optimizations for larger projects
    webpackMemoryOptimizations: true,

    // Enable typed routes for better type safety
    typedRoutes: true,

    // Prevent preloading all modules at startup to reduce memory usage
    preloadEntriesOnStart: false,
  },

  // Webpack optimizations
  webpack: (config, { dev }) => {
    // Only apply production optimizations in production builds
    if (!dev) {
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
      };
    }

    return config;
  },

  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
  },

  // Enable compression
  compress: true,

  // Bundle analyzer can be enabled via environment variable
  // Run: ANALYZE=true npm run build
};

export default nextConfig;
