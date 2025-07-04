// Repository Interfaces - Abstract contracts for data access
// These define what operations are available without specifying implementation

import type { 
  Varsity, 
  Heading, 
  Application, 
  Results, 
} from '../domain/models';

export interface IVarsityRepository {
  getVarsities(limit?: number, offset?: number): Promise<Varsity[]>;
  getVarsityByCode(code: string): Promise<Varsity | null>;
}

export interface IHeadingRepository {
  getHeadings(options?: {
    limit?: number;
    offset?: number;
    varsityCode?: string;
  }): Promise<Heading[]>;
  getHeadingById(id: number): Promise<Heading | null>;
}

export interface IApplicationRepository {
  getApplications(options?: {
    limit?: number;
    offset?: number;
    studentId?: string;
    varsityCode?: string;
    headingId?: number;
  }): Promise<Application[]>;
  getStudentApplications(studentId: string): Promise<Application[]>;
}

export interface IResultsRepository {
  getResults(options?: {
    headingIds?: string;
    varsityCode?: string;
    primary?: string | number;
    drained?: string;
    run?: string | number;
  }): Promise<Results>;
}

// Combined repository interface for easier injection
export interface IDataRepositories {
  varsities: IVarsityRepository;
  headings: IHeadingRepository;
  applications: IApplicationRepository;
  results: IResultsRepository;
} 