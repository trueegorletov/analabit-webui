'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RepositoryProvider } from '../application/RepositoryProvider';
import { STALE_TIME_MS, CACHE_TIME_MS, MAX_RETRY_ATTEMPTS } from './directions/_dashboard/constants';

// Create a client instance with pagination-optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS, // 5 minutes before data is considered stale
      gcTime: CACHE_TIME_MS, // 10 minutes before unused data is garbage collected (replaces cacheTime in v5)
      retry: MAX_RETRY_ATTEMPTS,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false, // Prevent unnecessary refetches on window focus
      // For infinite queries, keep previous data to enable smooth pagination
      placeholderData: (previousData: unknown) => previousData,
    },
  },
});

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider>
        {children}
      </RepositoryProvider>
    </QueryClientProvider>
  );
} 