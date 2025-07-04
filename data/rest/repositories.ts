// REST Repository Implementations
// Concrete implementations that use HTTP client and adapters

import type {
  IVarsityRepository,
  IHeadingRepository,
  IApplicationRepository,
  IResultsRepository,
} from '../../application/repositories';

import type { HttpClient } from './httpClient';
import type {
  VarsitiesResponse,
  HeadingsResponse,
  ApplicationsResponse,
  HeadingDto,
  ResultsDto,
} from './dtos';

import {
  adaptVarsities,
  adaptHeadings,
  adaptApplications,
  adaptHeading,
  adaptResults,
} from './adapters';

export class VarsityRepositoryRest implements IVarsityRepository {
  constructor(private httpClient: HttpClient) {}

  async getVarsities(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined) params.append('offset', offset.toString());
    
    const query = params.toString();
    const endpoint = `/varsities${query ? `?${query}` : ''}`;
    
    const dtos = await this.httpClient.get<VarsitiesResponse>(endpoint);
    return adaptVarsities(dtos);
  }

  async getVarsityByCode(code: string) {
    // Note: API doesn't have direct endpoint for single varsity by code
    // We'll fetch all and find the one we need
    const varsities = await this.getVarsities();
    return varsities.find(v => v.code === code) || null;
  }
}

export class HeadingRepositoryRest implements IHeadingRepository {
  constructor(private httpClient: HttpClient) {}

  async getHeadings(options?: {
    limit?: number;
    offset?: number;
    varsityCode?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', options.limit.toString());
    if (options?.offset !== undefined) params.append('offset', options.offset.toString());
    if (options?.varsityCode) params.append('varsityCode', options.varsityCode);
    
    const query = params.toString();
    const endpoint = `/headings${query ? `?${query}` : ''}`;
    
    const dtos = await this.httpClient.get<HeadingsResponse>(endpoint);
    return adaptHeadings(dtos);
  }

  async getHeadingById(id: number) {
    try {
      const dto = await this.httpClient.get<HeadingDto>(`/headings/${id}`);
      return adaptHeading(dto);
    } catch (error) {
      // If 404, return null instead of throwing
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
}

export class ApplicationRepositoryRest implements IApplicationRepository {
  constructor(private httpClient: HttpClient) {}

  async getApplications(options?: {
    limit?: number;
    offset?: number;
    studentId?: string;
    varsityCode?: string;
    headingId?: number;
  }) {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', options.limit.toString());
    if (options?.offset !== undefined) params.append('offset', options.offset.toString());
    if (options?.studentId) params.append('studentID', options.studentId);
    if (options?.varsityCode) params.append('varsityCode', options.varsityCode);
    if (options?.headingId !== undefined) params.append('headingId', options.headingId.toString());
    
    const query = params.toString();
    const endpoint = `/applications${query ? `?${query}` : ''}`;
    
    const dtos = await this.httpClient.get<ApplicationsResponse>(endpoint);
    return adaptApplications(dtos);
  }

  async getStudentApplications(studentId: string) {
    const dtos = await this.httpClient.get<ApplicationsResponse>(`/students/${studentId}`);
    return adaptApplications(dtos);
  }
}

export class ResultsRepositoryRest implements IResultsRepository {
  constructor(private httpClient: HttpClient) {}

  async getResults(options?: {
    headingIds?: string;
    varsityCode?: string;
    primary?: string | number;
    drained?: string;
    run?: string | number;
  }) {
    const params = new URLSearchParams();
    if (options?.headingIds) params.append('headingIds', options.headingIds);
    if (options?.varsityCode) params.append('varsityCode', options.varsityCode);
    if (options?.primary !== undefined) params.append('primary', options.primary.toString());
    if (options?.drained) params.append('drained', options.drained);
    if (options?.run !== undefined) params.append('run', options.run.toString());
    
    const query = params.toString();
    const endpoint = `/results${query ? `?${query}` : ''}`;
    
    const dto = await this.httpClient.get<ResultsDto>(endpoint);
    return adaptResults(dto);
  }
} 