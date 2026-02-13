/**
 * Types Index
 * Central export point for all type definitions
 */

export type {
  Project,
  Freelancer,
  Testimonial,
  Client,
  Budget,
  Skill,
  ProjectStatus,
} from './models';

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Filter types
export interface FilterParams {
  search?: string;
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  skills?: string[];
}

// Sort types
export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export * from './api';
