// Repository Provider - Configures and provides appropriate repositories based on environment

'use client';

import React, { useMemo, type ReactNode } from 'react';
import { DataProvider } from './DataProvider';
import type { IDataRepositories } from './repositories';

// REST implementations
import { createHttpClient } from '../data/rest/httpClient';
import {
  VarsityRepositoryRest,
  HeadingRepositoryRest,
  ApplicationRepositoryRest,
  ResultsRepositoryRest,
} from '../data/rest/repositories';

// Mock implementations
import {
  VarsityRepositoryMock,
  HeadingRepositoryMock,
  ApplicationRepositoryMock,
  ResultsRepositoryMock,
} from '../data/mock/repositories';

interface RepositoryProviderProps {
  children: ReactNode;
  /**
   * Override the environment-based selection for testing or development
   * - true: Force use mock repositories
   * - false: Force use REST repositories
   * - undefined: Use environment variables (default)
   */
  forceMock?: boolean;
}

export function RepositoryProvider({ children, forceMock }: RepositoryProviderProps) {
  const repositories = useMemo<IDataRepositories>(() => {
    // Determine if we should use mock repositories
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const useMockFlag = process.env.NEXT_PUBLIC_USE_MOCK_API;
    
    // Priority: forceMock prop > explicit mock flag > no base URL
    const shouldUseMock = 
      forceMock !== undefined 
        ? forceMock 
        : useMockFlag === 'true' || !baseUrl;

    if (shouldUseMock) {
      // Use mock repositories for development/testing
      return {
        varsities: new VarsityRepositoryMock(),
        headings: new HeadingRepositoryMock(),
        applications: new ApplicationRepositoryMock(),
        results: new ResultsRepositoryMock(),
      };
    } else {
      // Use REST repositories for production
      try {
        const httpClient = createHttpClient();
        return {
          varsities: new VarsityRepositoryRest(httpClient),
          headings: new HeadingRepositoryRest(httpClient),
          applications: new ApplicationRepositoryRest(httpClient),
          results: new ResultsRepositoryRest(httpClient),
        };
      } catch (error) {
        console.warn('Failed to create REST repositories, falling back to mock:', error);
        // Fallback to mock if REST setup fails
        return {
          varsities: new VarsityRepositoryMock(),
          headings: new HeadingRepositoryMock(),
          applications: new ApplicationRepositoryMock(),
          results: new ResultsRepositoryMock(),
        };
      }
    }
  }, [forceMock]);

  return (
    <DataProvider repositories={repositories}>
      {children}
    </DataProvider>
  );
}

/**
 * Hook to check if the app is currently using mock repositories
 * Useful for showing development indicators or debugging info
 */
export function useIsMockMode(): boolean {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const useMockFlag = process.env.NEXT_PUBLIC_USE_MOCK_API;
  
  return useMockFlag === 'true' || !baseUrl;
} 