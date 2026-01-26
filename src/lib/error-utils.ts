/**
 * Comprehensive Error Handling Utilities
 *
 * This module provides type-safe utilities to convert various error types
 * into LogContext-compatible objects for consistent error logging.
 */

export interface LogContext {
  userId?: string;
  requestId?: string;
  method?: string;
  url?: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  statusCode?: number;
  error?: Error;
  [key: string]: any;
}

export interface SupabaseError {
  message: string;
  code?: string;
  details?: any;
  hint?: string;
  status?: number;
}

export interface Web3Error {
  message: string;
  code?: number | string;
  data?: any;
  reason?: string;
  transaction?: any;
}

export interface ContractError extends Web3Error {
  method?: string;
  args?: any[];
  contract?: string;
}

/**
 * Safely converts any error type to LogContext
 * This is the primary function to use in catch blocks
 */
export const createLogContext = (
  error: unknown,
  additionalContext?: Partial<LogContext>,
): LogContext => {
  const baseContext: LogContext = {
    ...additionalContext,
  };

  if (error instanceof Error) {
    return {
      ...baseContext,
      error,
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
    };
  }

  if (isSupabaseError(error)) {
    return {
      ...baseContext,
      error: new Error(error.message),
      errorMessage: error.message,
      errorCode: error.code,
      errorDetails: error.details,
      errorHint: error.hint,
      errorStatus: error.status,
      errorType: "SupabaseError",
    };
  }

  if (isWeb3Error(error)) {
    return {
      ...baseContext,
      error: new Error(error.message),
      errorMessage: error.message,
      errorCode: error.code,
      errorReason: error.reason,
      errorData: error.data,
      errorType: "Web3Error",
    };
  }

  if (isContractError(error)) {
    return {
      ...baseContext,
      error: new Error(error.message),
      errorMessage: error.message,
      errorCode: error.code,
      errorReason: error.reason,
      contractMethod: error.method,
      contractArgs: error.args,
      contractAddress: error.contract,
      errorType: "ContractError",
    };
  }

  if (typeof error === "string") {
    return {
      ...baseContext,
      error: new Error(error),
      errorMessage: error,
      errorType: "StringError",
    };
  }

  if (typeof error === "object" && error !== null) {
    const errorMessage = getErrorMessage(error);
    return {
      ...baseContext,
      error: new Error(errorMessage),
      errorMessage,
      errorObject: sanitizeErrorObject(error),
      errorType: "UnknownObjectError",
    };
  }

  // Fallback for primitive types or null/undefined
  const errorMessage = error?.toString() || "Unknown error occurred";
  return {
    ...baseContext,
    error: new Error(errorMessage),
    errorMessage,
    errorValue: error,
    errorType: "UnknownError",
  };
};

/**
 * Type guard for Supabase errors
 */
export const isSupabaseError = (error: unknown): error is SupabaseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string" &&
    ("code" in error || "details" in error || "hint" in error)
  );
};

/**
 * Type guard for Web3 errors
 */
export const isWeb3Error = (error: unknown): error is Web3Error => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as any).message === "string" &&
    ("code" in error || "reason" in error || "data" in error)
  );
};

/**
 * Type guard for Contract errors (extends Web3Error)
 */
export const isContractError = (error: unknown): error is ContractError => {
  return (
    isWeb3Error(error) &&
    ("method" in error || "contract" in error || "args" in error)
  );
};

/**
 * Safely extracts error message from unknown error objects
 */
const getErrorMessage = (error: any): string => {
  if (typeof error.message === "string") return error.message;
  if (typeof error.error === "string") return error.error;
  if (typeof error.toString === "function") return error.toString();
  return "Unknown error occurred";
};

/**
 * Sanitizes error objects to prevent circular references and sensitive data leakage
 */
const sanitizeErrorObject = (error: any): any => {
  try {
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(error, (key, value) => {
        // Remove circular references
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }

        // Remove sensitive fields
        if (
          typeof key === "string" &&
          (key.toLowerCase().includes("password") ||
            key.toLowerCase().includes("secret") ||
            key.toLowerCase().includes("token") ||
            key.toLowerCase().includes("key") ||
            key.toLowerCase().includes("private"))
        ) {
          return "[REDACTED]";
        }

        // Truncate long strings
        if (typeof value === "string" && value.length > 500) {
          return value.substring(0, 500) + "... [TRUNCATED]";
        }

        return value;
      }),
    );
  } catch {
    return { sanitizationError: "Could not sanitize error object" };
  }
};

/**
 * Specialized helper for database operation errors
 */
export const createDatabaseErrorContext = (
  error: unknown,
  operation: string,
  table: string,
  additionalContext?: Partial<LogContext>,
): LogContext => {
  return createLogContext(error, {
    ...additionalContext,
    operation,
    table,
    errorCategory: "database",
  });
};

/**
 * Specialized helper for API request errors
 */
export const createApiErrorContext = (
  error: unknown,
  endpoint: string,
  method: string,
  additionalContext?: Partial<LogContext>,
): LogContext => {
  return createLogContext(error, {
    ...additionalContext,
    endpoint,
    method,
    errorCategory: "api",
  });
};

/**
 * Specialized helper for Web3/Contract errors
 */
export const createWeb3ErrorContext = (
  error: unknown,
  contractMethod: string,
  contractAddress?: string,
  additionalContext?: Partial<LogContext>,
): LogContext => {
  return createLogContext(error, {
    ...additionalContext,
    contractMethod,
    contractAddress,
    errorCategory: "web3",
  });
};

/**
 * Specialized helper for authentication errors
 */
export const createAuthErrorContext = (
  error: unknown,
  authEvent: string,
  userId?: string,
  additionalContext?: Partial<LogContext>,
): LogContext => {
  return createLogContext(error, {
    ...additionalContext,
    authEvent,
    userId,
    errorCategory: "auth",
  });
};

/**
 * Utility to safely convert string to number for bid amounts, etc.
 */
export const safeParseNumber = (
  value: string | number | undefined,
  fallback: number = 0,
): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

/**
 * Utility to safely convert string to bigint for Web3 operations
 */
export const safeParseBigInt = (
  value: string | number | bigint | undefined,
  fallback: bigint = BigInt(0),
): bigint => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.floor(value));
  if (typeof value === "string") {
    try {
      return BigInt(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
};
