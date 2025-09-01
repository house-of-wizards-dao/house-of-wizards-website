/**
 * Enhanced Error Type Definitions
 *
 * This module provides comprehensive type definitions for all error scenarios
 * encountered in the application, ensuring type safety across the codebase.
 */

// Re-export LogContext from error-utils for consistency
export type { LogContext } from "../lib/error-utils";

/**
 * Standard error response structure for API endpoints
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
    timestamp: string;
  };
}

/**
 * Standard success response structure for API endpoints
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    requestId?: string;
    timestamp: string;
  };
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Enhanced Supabase error types
 */
export interface SupabaseError {
  message: string;
  code?: string;
  details?: any;
  hint?: string;
  status?: number;
}

/**
 * Web3 and contract interaction error types
 */
export interface Web3Error {
  message: string;
  code?: number | string;
  data?: any;
  reason?: string;
  transaction?: {
    hash?: string;
    gasUsed?: string;
    gasPrice?: string;
  };
}

export interface ContractError extends Web3Error {
  method?: string;
  args?: any[];
  contract?: string;
  contractAddress?: string;
}

/**
 * Bidding specific error types
 */
export interface BidError {
  type:
    | "INSUFFICIENT_FUNDS"
    | "BID_TOO_LOW"
    | "AUCTION_ENDED"
    | "AUCTION_NOT_STARTED"
    | "NETWORK_ERROR"
    | "UNKNOWN";
  message: string;
  details?: {
    requiredAmount?: string;
    currentBid?: string;
    minimumIncrement?: string;
    userBalance?: string;
    auctionEndTime?: string;
    auctionStartTime?: string;
  };
}

/**
 * Authentication and authorization error types
 */
export interface AuthError {
  type:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "TOKEN_EXPIRED"
    | "INVALID_CREDENTIALS"
    | "SESSION_EXPIRED";
  message: string;
  redirectUrl?: string;
}

/**
 * File upload error types
 */
export interface UploadError {
  type:
    | "FILE_TOO_LARGE"
    | "INVALID_FILE_TYPE"
    | "UPLOAD_FAILED"
    | "STORAGE_ERROR";
  message: string;
  fileName?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

/**
 * Database operation error types
 */
export interface DatabaseError {
  type:
    | "CONNECTION_ERROR"
    | "QUERY_ERROR"
    | "CONSTRAINT_VIOLATION"
    | "NOT_FOUND"
    | "TIMEOUT";
  message: string;
  table?: string;
  operation?: string;
  constraint?: string;
}

/**
 * Validation error types
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  constraint?: string;
}

export interface ValidationErrorResponse {
  type: "VALIDATION_ERROR";
  message: string;
  errors: ValidationError[];
}

/**
 * Rate limiting error types
 */
export interface RateLimitError {
  type: "RATE_LIMIT_EXCEEDED";
  message: string;
  retryAfter?: number;
  limit?: number;
  remaining?: number;
  resetTime?: number;
}

/**
 * Comprehensive error union type
 */
export type AppError =
  | SupabaseError
  | Web3Error
  | ContractError
  | BidError
  | AuthError
  | UploadError
  | DatabaseError
  | ValidationErrorResponse
  | RateLimitError
  | Error;

/**
 * Error handler function type
 */
export type ErrorHandler = (error: unknown) => void;

/**
 * Async error handler function type
 */
export type AsyncErrorHandler = (error: unknown) => Promise<void>;

/**
 * Error recovery function type
 */
export type ErrorRecoveryFn<T = any> = (error: unknown) => T | Promise<T>;

/**
 * Error context builder function type
 */
export type ErrorContextBuilder = (
  error: unknown,
  context?: any,
) => Record<string, any>;

/**
 * Type-safe wrapper for functions that might throw
 */
export type SafeFunction<T extends any[], R> = (...args: T) => Promise<
  | {
      success: true;
      data: R;
    }
  | {
      success: false;
      error: AppError;
    }
>;

/**
 * Configuration for error handling behavior
 */
export interface ErrorHandlingConfig {
  logErrors?: boolean;
  throwOnError?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  fallbackValue?: any;
  customHandler?: ErrorHandler;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
  errorId?: string;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{
    error: Error;
    errorInfo: any;
    retry: () => void;
  }>;
  onError?: (error: Error, errorInfo: any) => void;
  isolate?: boolean;
  children: React.ReactNode;
}

/**
 * Network error types
 */
export interface NetworkError {
  type: "NETWORK_ERROR" | "TIMEOUT" | "CONNECTION_REFUSED" | "DNS_ERROR";
  message: string;
  url?: string;
  method?: string;
  statusCode?: number;
  timeout?: number;
}

/**
 * Type guards for error identification
 */
export const isApiErrorResponse = (
  response: any,
): response is ApiErrorResponse => {
  return response && response.success === false && response.error;
};

export const isValidationError = (
  error: any,
): error is ValidationErrorResponse => {
  return (
    error && error.type === "VALIDATION_ERROR" && Array.isArray(error.errors)
  );
};

export const isRateLimitError = (error: any): error is RateLimitError => {
  return error && error.type === "RATE_LIMIT_EXCEEDED";
};

export const isBidError = (error: any): error is BidError => {
  return (
    error &&
    error.type &&
    [
      "INSUFFICIENT_FUNDS",
      "BID_TOO_LOW",
      "AUCTION_ENDED",
      "AUCTION_NOT_STARTED",
      "NETWORK_ERROR",
    ].includes(error.type)
  );
};

export const isAuthError = (error: any): error is AuthError => {
  return (
    error &&
    error.type &&
    [
      "UNAUTHORIZED",
      "FORBIDDEN",
      "TOKEN_EXPIRED",
      "INVALID_CREDENTIALS",
      "SESSION_EXPIRED",
    ].includes(error.type)
  );
};
