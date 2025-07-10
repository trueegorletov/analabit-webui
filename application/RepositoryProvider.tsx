// Repository Provider - Configures and provides appropriate repositories based on environment

'use client';

import React, { type ReactNode } from 'react';
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

// Determine if we should use mock repositories outside of the component
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const useMockFlag = process.env.NEXT_PUBLIC_USE_MOCK_API;
const shouldUseMock = useMockFlag === 'true' || !baseUrl;

let repositories: IDataRepositories;

if (shouldUseMock) {
  // Use mock repositories for development/testing
  repositories = {
    varsities: new VarsityRepositoryMock(),
    headings: new HeadingRepositoryMock(),
    applications: new ApplicationRepositoryMock(),
    results: new ResultsRepositoryMock(),
  };
} else {
  // Use REST repositories for production
  try {
    const httpClient = createHttpClient();
    repositories = {
      varsities: new VarsityRepositoryRest(httpClient),
      headings: new HeadingRepositoryRest(httpClient),
      applications: new ApplicationRepositoryRest(httpClient),
      results: new ResultsRepositoryRest(httpClient),
    };
  } catch (error) {
    console.warn('Failed to create REST repositories, falling back to mock:', error);
    // Fallback to mock if REST setup fails
    repositories = {
      varsities: new VarsityRepositoryMock(),
      headings: new HeadingRepositoryMock(),
      applications: new ApplicationRepositoryMock(),
      results: new ResultsRepositoryMock(),
    };
  }
}

interface RepositoryProviderProps {
  children: ReactNode;
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
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