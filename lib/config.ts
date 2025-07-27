/**
 * Global application configuration
 * Centralizes environment variables and feature flags
 */

export const config = {
  // Development mode flag - controls access to dev routes and features
  isDevelopment: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  
  // API configuration
  api: {
    useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/v1',
  },
  
  // Feature flags
  features: {
    // Add more feature flags here as needed
    enableDevRoutes: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
    enableColorPreview: process.env.NEXT_PUBLIC_DEV_MODE === 'true',
  },
} as const;

// Type-safe environment check helpers
export const isDev = () => config.isDevelopment;
export const isProd = () => !config.isDevelopment;

// Development route guard helper
export const requireDevelopment = () => {
  if (!config.isDevelopment) {
    throw new Error('This feature is only available in development mode');
  }
};

export default config;