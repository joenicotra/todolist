import { ApiResponse, ApiError, RequestConfig } from '../types/api';

// Base API configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
export const API_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request interceptor type
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

// Response interceptor type
export type ResponseInterceptor = {
  onFulfilled?: (response: Response) => Response | Promise<Response>;
  onRejected?: (error: ApiError) => Promise<never>;
};

// API Client class with comprehensive error handling and retry logic
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Set default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  // Set authorization token
  setAuthToken(token: string): void {
    this.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }

  // Clear authorization token
  clearAuthToken(): void {
    const { Authorization, ...headers } = this.defaultHeaders;
    this.defaultHeaders = headers;
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onFulfilled) {
        processedResponse = await interceptor.onFulfilled(processedResponse);
      }
    }
    return processedResponse;
  }

  // Apply error interceptors
  private async applyErrorInterceptors(error: ApiError): Promise<never> {
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onRejected) {
        return interceptor.onRejected(error);
      }
    }
    throw error;
  }

  // Sleep utility for retry delays
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if error is retryable
  private isRetryableError(error: ApiError): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT_ERROR' ||
      (error.status !== undefined && error.status >= 500)
    );
  }

  // Create AbortController with timeout
  private createAbortController(): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    return { controller, timeoutId };
  }

  // Main request method with retry logic
  private async makeRequest<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    config: Partial<RequestConfig> = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    // Build URL with query parameters
    let url = `${this.baseURL}${endpoint}`;
    if (config.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const { controller, timeoutId } = this.createAbortController();

    try {
      // Prepare request configuration
      const requestConfig: RequestConfig = await this.applyRequestInterceptors({
        method,
        url,
        headers: { ...this.defaultHeaders, ...config.headers },
        data,
        signal: controller.signal,
        ...config,
      });

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: requestConfig.method,
        headers: requestConfig.headers,
      };

      // Add signal if present
      if (requestConfig.signal) {
        fetchOptions.signal = requestConfig.signal;
      }

      // Add body for non-GET requests
      if (data && method !== 'GET') {
        fetchOptions.body = JSON.stringify(data);
      }

      // Make the request
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Apply response interceptors
      const processedResponse = await this.applyResponseInterceptors(response);

      // Handle HTTP errors
      if (!processedResponse.ok) {
        const errorData = await this.parseErrorResponse(processedResponse);
        const apiError: ApiError = {
          message: errorData.message || `HTTP ${processedResponse.status}: ${processedResponse.statusText}`,
          status: processedResponse.status,
          code: this.getErrorCode(processedResponse.status),
          details: errorData.details,
          timestamp: new Date().toISOString(),
        };

        // Retry logic for retryable errors
        if (this.isRetryableError(apiError) && attempt < MAX_RETRY_ATTEMPTS) {
          await this.sleep(RETRY_DELAY * attempt);
          return this.makeRequest<T>(method, endpoint, data, config, attempt + 1);
        }

        return this.applyErrorInterceptors(apiError);
      }

      // Parse successful response
      const responseData = await this.parseSuccessResponse<T>(processedResponse);

      return {
        data: responseData,
        status: processedResponse.status,
        statusText: processedResponse.statusText,
        headers: this.parseHeaders(processedResponse.headers),
      };

    } catch (error) {
      clearTimeout(timeoutId);

      // Handle network and abort errors
      const apiError: ApiError = {
        message: this.getErrorMessage(error),
        code: this.getErrorCodeFromException(error),
        timestamp: new Date().toISOString(),
      };

      // Retry logic for network errors
      if (this.isRetryableError(apiError) && attempt < MAX_RETRY_ATTEMPTS) {
        await this.sleep(RETRY_DELAY * attempt);
        return this.makeRequest<T>(method, endpoint, data, config, attempt + 1);
      }

      return this.applyErrorInterceptors(apiError);
    }
  }

  // Parse error response
  private async parseErrorResponse(response: Response): Promise<{ message?: string; details?: any }> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return { message: await response.text() };
    } catch {
      return { message: 'Failed to parse error response' };
    }
  }

  // Parse success response
  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    // For non-JSON responses, return text as T
    return (await response.text()) as unknown as T;
  }

  // Parse response headers
  private parseHeaders(headers: Headers): Record<string, string> {
    const headerObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    return headerObj;
  }

  // Get error message from exception
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return 'Request timeout';
      }
      return error.message;
    }
    return 'An unknown error occurred';
  }

  // Get error code from HTTP status
  private getErrorCode(status: number): string {
    switch (status) {
      case 400: return 'BAD_REQUEST';
      case 401: return 'UNAUTHORIZED';
      case 403: return 'FORBIDDEN';
      case 404: return 'NOT_FOUND';
      case 409: return 'CONFLICT';
      case 422: return 'VALIDATION_ERROR';
      case 429: return 'RATE_LIMITED';
      case 500: return 'INTERNAL_SERVER_ERROR';
      case 502: return 'BAD_GATEWAY';
      case 503: return 'SERVICE_UNAVAILABLE';
      case 504: return 'GATEWAY_TIMEOUT';
      default: return 'HTTP_ERROR';
    }
  }

  // Get error code from exception
  private getErrorCodeFromException(error: unknown): string {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return 'TIMEOUT_ERROR';
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'NETWORK_ERROR';
      }
    }
    return 'UNKNOWN_ERROR';
  }

  // Public API methods
  async get<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Setup default interceptors
apiClient.addRequestInterceptor((config) => {
  // Add timestamp to requests for debugging
  console.log(`[API] ${config.method} ${config.url}`, new Date().toISOString());
  return config;
});

apiClient.addResponseInterceptor({
  onFulfilled: (response) => {
    console.log(`[API] Response ${response.status} ${response.statusText}`);
    return response;
  },
  onRejected: async (error) => {
    console.error('[API] Error:', error);
    throw error;
  },
});

// Export utility functions
export const setApiAuthToken = (token: string) => apiClient.setAuthToken(token);
export const clearApiAuthToken = () => apiClient.clearAuthToken();
export const setApiBaseURL = (url: string) => {
  // Create new client with updated base URL
  const newClient = new ApiClient(url);
  // Copy interceptors and headers from existing client
  // Note: This is a simplified approach; in production, you might want a more sophisticated solution
  return newClient;
};
