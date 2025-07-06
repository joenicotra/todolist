import { Task, Project, Area, User } from './core';
import { TaskFilters, SortOptions } from './ui';

// Base API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Request types
export interface CreateTaskRequest {
  title: string;
  notes?: string;
  project_id?: string;
  area_id?: string;
  priority?: number;
  start_date?: string;
  due_date?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  notes?: string;
  project_id?: string;
  area_id?: string;
  status?: Task['status'];
  priority?: number;
  start_date?: string;
  due_date?: string;
  sort_order?: number;
}

export interface CreateProjectRequest {
  name: string;
  notes?: string;
  area_id?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  notes?: string;
  area_id?: string;
  status?: Project['status'];
  sort_order?: number;
}

export interface CreateAreaRequest {
  name: string;
  notes?: string;
}

export interface UpdateAreaRequest {
  name?: string;
  notes?: string;
  sort_order?: number;
}

export interface BulkUpdateRequest {
  id: string;
  updates: UpdateTaskRequest;
}

// Query parameters
export interface GetTasksParams {
  filters?: TaskFilters;
  sort?: SortOptions;
  page?: number;
  limit?: number;
}

export interface GetProjectsParams {
  area_id?: string;
  status?: Project['status'][];
  page?: number;
  limit?: number;
}

export interface GetAreasParams {
  page?: number;
  limit?: number;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}
