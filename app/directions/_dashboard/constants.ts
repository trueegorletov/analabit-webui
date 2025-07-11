// Dashboard Constants
// This file contains dashboard-specific constants for pagination and performance

// Pagination constants
export const APPLICATIONS_PAGE_SIZE = 200 as const;
export const INITIAL_PAGES_TO_LOAD = 1 as const;
export const PREFETCH_THRESHOLD = 0.8 as const;

// Intersection observer constants
export const INTERSECTION_ROOT_MARGIN = '100px' as const;
export const INTERSECTION_THRESHOLD = 0.1 as const;
export const PAGINATION_DEBOUNCE_MS = 300 as const;

// Performance constants
export const MAX_CACHED_PAGES = 10 as const;
export const STALE_TIME_MS = 300000; // 5 minutes
export const CACHE_TIME_MS = 600000; // 10 minutes

// Error handling constants
export const MAX_RETRY_ATTEMPTS = 3 as const;
export const RETRY_DELAY_MS = 1000 as const;
export const NETWORK_TIMEOUT_MS = 30000 as const; // 30 seconds

// Grouped constants for better organization
export const PAGINATION_CONFIG = {
    PAGE_SIZE: APPLICATIONS_PAGE_SIZE,
    INITIAL_PAGES: INITIAL_PAGES_TO_LOAD,
    PREFETCH_THRESHOLD,
    DEBOUNCE_MS: PAGINATION_DEBOUNCE_MS,
} as const;

export const INTERSECTION_CONFIG = {
    ROOT_MARGIN: INTERSECTION_ROOT_MARGIN,
    THRESHOLD: INTERSECTION_THRESHOLD,
} as const;

export const PERFORMANCE_CONFIG = {
    MAX_CACHED_PAGES,
    STALE_TIME_MS,
    CACHE_TIME_MS,
} as const;

export const ERROR_CONFIG = {
    MAX_RETRY_ATTEMPTS,
    RETRY_DELAY_MS,
    NETWORK_TIMEOUT_MS,
} as const;
