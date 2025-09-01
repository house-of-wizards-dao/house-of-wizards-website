/**
 * Migration Utilities
 *
 * This module provides utilities to help migrate existing code to use
 * the new type-safe error handling patterns.
 */

import {
  createLogContext,
  createDatabaseErrorContext,
  createApiErrorContext,
  createWeb3ErrorContext,
  createAuthErrorContext,
  safeParseNumber,
  safeParseBigInt,
  type LogContext,
} from "./error-utils";

/**
 * Legacy error handling patterns that need migration
 */

// Pattern 1: Direct logger.error(message, error) calls
export const migrateDirectLoggerError = (
  error: unknown,
  operation?: string,
  table?: string,
): LogContext => {
  if (operation && table) {
    return createDatabaseErrorContext(error, operation, table);
  }
  return createLogContext(error);
};

// Pattern 2: Supabase error handling
export const migrateSupabaseError = (
  error: unknown,
  operation: string,
  table: string,
  additionalContext?: Record<string, any>,
): LogContext => {
  return createDatabaseErrorContext(error, operation, table, additionalContext);
};

// Pattern 3: Web3/Contract error handling
export const migrateWeb3Error = (
  error: unknown,
  method: string,
  contractAddress?: string,
  args?: any[],
): LogContext => {
  return createWeb3ErrorContext(error, method, contractAddress, { args });
};

// Pattern 4: API endpoint error handling
export const migrateApiError = (
  error: unknown,
  endpoint: string,
  method: string,
  additionalContext?: Record<string, any>,
): LogContext => {
  return createApiErrorContext(error, endpoint, method, additionalContext);
};

// Pattern 5: Authentication error handling
export const migrateAuthError = (
  error: unknown,
  authEvent: string,
  userId?: string,
): LogContext => {
  return createAuthErrorContext(error, authEvent, userId);
};

/**
 * Parameter type fixing utilities
 */

// Fix string to number conversions (common in bid amounts)
export const fixBidAmount = (amount: string | number | undefined): number => {
  return safeParseNumber(amount);
};

// Fix bigint conversions for Web3 operations
export const fixWeb3Amount = (
  amount: string | number | bigint | undefined,
): bigint => {
  return safeParseBigInt(amount);
};

// Fix undefined parameter issues
export const ensureString = (value: unknown, fallback: string = ""): string => {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
};

export const ensureNumber = (value: unknown, fallback: number = 0): number => {
  if (typeof value === "number" && !isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

export const ensureBigInt = (
  value: unknown,
  fallback: bigint = BigInt(0),
): bigint => {
  return safeParseBigInt(
    value as string | number | bigint | undefined,
    fallback,
  );
};

export const ensureBoolean = (
  value: unknown,
  fallback: boolean = false,
): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  return fallback;
};

/**
 * Collection iteration fixes for older TypeScript targets
 */

// Fix Set iteration issues
export const safeIterateSet = <T>(
  set: Set<T>,
  callback: (value: T) => void,
): void => {
  const array = Array.from(set);
  array.forEach(callback);
};

// Fix Map iteration issues
export const safeIterateMap = <K, V>(
  map: Map<K, V>,
  callback: (value: V, key: K) => void,
): void => {
  const entries = Array.from(map.entries());
  entries.forEach(([key, value]) => callback(value, key));
};

/**
 * Async operation wrapping utilities
 */

// Wrap async operations with proper error handling
export const wrapAsyncOperation = async <T>(
  operation: () => Promise<T>,
  context: Partial<LogContext> = {},
): Promise<
  { success: true; data: T } | { success: false; error: LogContext }
> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: createLogContext(error, context) };
  }
};

// Wrap sync operations with proper error handling
export const wrapSyncOperation = <T>(
  operation: () => T,
  context: Partial<LogContext> = {},
): { success: true; data: T } | { success: false; error: LogContext } => {
  try {
    const data = operation();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: createLogContext(error, context) };
  }
};

/**
 * Rate limiting configuration fixes
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: any) => string;
  onLimitReached?: (req: any, res: any) => void;
}

export const createRateLimitConfig = (
  windowMs: number,
  maxRequests: number,
  options: Partial<RateLimitConfig> = {},
): RateLimitConfig => {
  return {
    windowMs: ensureNumber(windowMs, 60000), // Default 1 minute
    maxRequests: ensureNumber(maxRequests, 100), // Default 100 requests
    skipSuccessfulRequests: ensureBoolean(
      options.skipSuccessfulRequests,
      false,
    ),
    skipFailedRequests: ensureBoolean(options.skipFailedRequests, false),
    keyGenerator: options.keyGenerator || ((req: any) => req.ip || "anonymous"),
    onLimitReached: options.onLimitReached || (() => {}),
  };
};

/**
 * Database schema validation fixes
 */
export const validateDatabaseResult = <T>(
  result: any,
  expectedFields: (keyof T)[],
): T | null => {
  if (!result || typeof result !== "object") {
    return null;
  }

  const missingFields = expectedFields.filter((field) => !(field in result));
  if (missingFields.length > 0) {
    console.warn(`Missing expected fields: ${missingFields.join(", ")}`);
  }

  return result as T;
};

/**
 * Contract interaction fixes
 */
export const validateContractMethod = (
  method: unknown,
): method is (...args: any[]) => any => {
  return typeof method === "function";
};

export const validateContractAddress = (
  address: unknown,
): address is string => {
  return (
    typeof address === "string" &&
    address.length === 42 &&
    address.startsWith("0x")
  );
};

/**
 * Utility to check if value is defined and not null
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Utility to provide safe default values
 */
export const withDefault = <T>(
  value: T | null | undefined,
  defaultValue: T,
): T => {
  return isDefined(value) ? value : defaultValue;
};
