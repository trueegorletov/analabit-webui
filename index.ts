// Main Architecture Exports
// This file provides convenient access to the new hexagonal architecture components

// Domain Models
export * from './domain/models';

// Domain Services  
export * from './domain/services/calculatePasses';

// Application Layer (Repositories & Providers)
export * from './application/repositories';
export * from './application/DataProvider';
export * from './application/RepositoryProvider';

// Data Layer - REST
export * from './data/rest/httpClient';
export * from './data/rest/dtos';
export * from './data/rest/adapters';
export * from './data/rest/repositories';

// Data Layer - Mock
export * from './data/mock/repositories';

// Presentation Layer Hooks
export * from './presentation/hooks/useApplications';
export * from './presentation/hooks/useDashboardStats'; 