import type { 
  UniversitiesApiResponse, 
  DirectionsApiResponse, 
} from './types';
import { 
  getMockUniversitiesResponse, 
  getMockDirectionsResponse, 
  simulateNetworkDelay, 
  simulateRandomFailure, 
} from './mockData';

// Universities API
export class UniversityApiService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private static readonly USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false' && !this.BASE_URL;
  private static readonly TIMEOUT_MS = 10000; // 10 seconds

  /**
   * Creates an AbortController that times out after the specified duration
   */
  private static createTimeoutController(timeoutMs: number = this.TIMEOUT_MS): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller;
  }

  /**
   * Handles API errors and provides user-friendly error messages
   */
  private static handleApiError(error: unknown, operation: string): never {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`${operation} timed out. Please check your connection.`);
      }
      throw new Error(`${operation} failed: ${error.message}`);
    }
    throw new Error(`${operation} failed: Unknown error occurred`);
  }

  /**
   * Fetches the list of all universities
   */
  static async getUniversities(): Promise<UniversitiesApiResponse['universities']> {
    if (this.USE_MOCK) {
      // Simulate network delay and potential failures for testing
      await simulateNetworkDelay(300, 1000);
      if (simulateRandomFailure(0.02)) { // 2% failure rate for testing
        throw new Error('Mock network error: Failed to fetch universities');
      }
      return getMockUniversitiesResponse().universities;
    }

    const controller = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.BASE_URL}/universities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: UniversitiesApiResponse = await response.json();
      return data.universities;
    } catch (error) {
      this.handleApiError(error, 'Fetching universities');
    }
  }

  /**
   * Fetches directions for a specific university by its code
   */
  static async getUniversityDirections(universityCode: string): Promise<DirectionsApiResponse> {
    if (this.USE_MOCK) {
      // Simulate network delay and potential failures for testing
      await simulateNetworkDelay(200, 800);
      if (simulateRandomFailure(0.05)) { // 5% failure rate for testing
        throw new Error(`Mock network error: Failed to fetch directions for ${universityCode}`);
      }
      return getMockDirectionsResponse(universityCode);
    }

    const controller = this.createTimeoutController();
    
    try {
      const response = await fetch(`${this.BASE_URL}/universities/${universityCode}/directions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DirectionsApiResponse = await response.json();
      return data;
    } catch (error) {
      this.handleApiError(error, `Fetching directions for university ${universityCode}`);
    }
  }

  /**
   * Fetch directions for multiple universities in parallel
   * Returns a map of universityId to directions data or error
   */
  static async getMultipleUniversityDirections(universityCodes: string[]): Promise<Record<string, DirectionsApiResponse | Error>> {
    const results = await Promise.allSettled(
      universityCodes.map(code => this.getUniversityDirections(code)),
    );

    const resultMap: Record<string, DirectionsApiResponse | Error> = {};
    
    results.forEach((result, index) => {
      const universityCode = universityCodes[index];
      if (result.status === 'fulfilled') {
        resultMap[universityCode] = result.value;
      } else {
        resultMap[universityCode] = new Error(result.reason?.message || 'Unknown error');
      }
    });

    return resultMap;
  }
} 