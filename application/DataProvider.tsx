// DataProvider Context - Dependency injection for repositories
// This allows swapping between mock and real implementations

'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { IDataRepositories } from './repositories';

interface DataProviderProps {
  children: ReactNode;
  repositories: IDataRepositories;
}

const DataContext = createContext<IDataRepositories | null>(null);

export function DataProvider({ children, repositories }: DataProviderProps) {
  const memoizedRepositories = useMemo(() => repositories, [repositories]);
  
  return (
    <DataContext.Provider value={memoizedRepositories}>
      {children}
    </DataContext.Provider>
  );
}

export function useRepositories(): IDataRepositories {
  const repositories = useContext(DataContext);
  
  if (!repositories) {
    throw new Error(
      'useRepositories must be used within a DataProvider. ' +
      'Make sure your app is wrapped with <DataProvider>.',
    );
  }
  
  return repositories;
}

// Convenience hooks for individual repositories
export function useVarsityRepository() {
  return useRepositories().varsities;
}

export function useHeadingRepository() {
  return useRepositories().headings;
}

export function useApplicationRepository() {
  return useRepositories().applications;
}

export function useResultsRepository() {
  return useRepositories().results;
} 