/**
 * API response type definitions
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  statusCode?: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  statusCode: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ApiError extends ErrorResponse {
  validationErrors?: ValidationError[];
  retryAfter?: number;
}