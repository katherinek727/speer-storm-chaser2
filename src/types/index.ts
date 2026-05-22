/**
 * Main type exports
 */

// Re-export all types from individual files
export * from './navigation';
export * from './weather';
export * from './storm';
export * from './api';

// Common utility types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Component props
export interface BaseScreenProps {
  navigation: any;
  route?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  isRefreshing?: boolean;
}