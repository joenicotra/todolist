import { User } from '../types/core';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, ApiResponse } from '../types/api';
import { apiClient } from './api';
import { MockStorage, STORAGE_KEYS, mockDelay, initializeMockData } from './mock';

// Auth service interface
export interface AuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<string>;
  isAuthenticated(): boolean;
}

// Mock implementation for development
class MockAuthService implements AuthService {
  constructor() {
    initializeMockData();
  }

  async login(email: string, password: string): Promise<User> {
    await mockDelay();

    // Simple mock validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Get or create mock user
    let user = MockStorage.get<User>(STORAGE_KEYS.USER);
    if (!user) {
      initializeMockData();
      user = MockStorage.get<User>(STORAGE_KEYS.USER);
    }

    if (!user) {
      throw new Error('Failed to initialize user data');
    }

    // Update user email to match login
    user.email = email;
    MockStorage.set(STORAGE_KEYS.USER, user);

    // Generate mock token
    const token = `mock_jwt_token_${Date.now()}`;
    MockStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);

    return user;
  }

  async logout(): Promise<void> {
    await mockDelay(100, 300);
    MockStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }

  async getCurrentUser(): Promise<User | null> {
    await mockDelay(100, 300);

    const token = MockStorage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return null;
    }

    return MockStorage.get<User>(STORAGE_KEYS.USER);
  }

  async refreshToken(): Promise<string> {
    await mockDelay(200, 500);

    const currentToken = MockStorage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    const newToken = `mock_jwt_token_${Date.now()}`;
    MockStorage.set(STORAGE_KEYS.AUTH_TOKEN, newToken);

    return newToken;
  }

  isAuthenticated(): boolean {
    const token = MockStorage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }
}

// Production implementation (placeholder)
class ProductionAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    } as LoginRequest);

    // Store token for future requests
    apiClient.setAuthToken(response.data.token);

    return response.data.user;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear token, even if logout request fails
      apiClient.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      // If unauthorized, clear token
      apiClient.clearAuthToken();
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');

    // Update token for future requests
    apiClient.setAuthToken(response.data.token);

    return response.data.token;
  }

  isAuthenticated(): boolean {
    // In production, you might want to check token expiry
    // For now, just check if we have a token set
    return true; // This would be implemented based on your token storage strategy
  }
}

// Export the appropriate service based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
export const authService: AuthService = isDevelopment
  ? new MockAuthService()
  : new ProductionAuthService();

// Export individual methods for convenience
export const login = (email: string, password: string) => authService.login(email, password);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const refreshToken = () => authService.refreshToken();
export const isAuthenticated = () => authService.isAuthenticated();
