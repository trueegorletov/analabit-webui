// HTTP Client - Wraps fetch with base URL, timeout, and error handling

export interface TimeoutError extends Error {
  type: 'TIMEOUT';
}

interface HttpClientConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
}

interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  private createTimeoutController(timeoutMs: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    return controller;
  }

  private handleError(error: unknown, operation: string): never {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error(`${operation} timed out. Please check your connection.`) as TimeoutError;
        timeoutError.type = 'TIMEOUT';
        throw timeoutError;
      }
      throw new Error(`${operation} failed: ${error.message}`);
    }
    throw new Error(`${operation} failed: Unknown error occurred`);
  }

  async request<T>(endpoint: string, options: HttpRequestOptions = {}): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.config.timeout,
    } = options;

    const controller = this.createTimeoutController(timeout);
    
    const url = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...headers,
        },
        body,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      this.handleError(error, `${method} ${endpoint}`);
    }
  }

  async get<T>(endpoint: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: Omit<HttpRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: Omit<HttpRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: Omit<HttpRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create default HTTP client instance
export function createHttpClient(): HttpClient {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  
  if (!rawBaseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
  }

  // Ensure no trailing slash to avoid double slashes when joining with endpoints
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  return new HttpClient({
    baseUrl,
    timeout: 11500, // 11.5 seconds (15% increase from 10 seconds)
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'any-value',
    },
  });
}