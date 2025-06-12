import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { withRateLimit } from "./rate-limiter";
import { logger } from "./logger";

// Standard API error codes
export enum ApiErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
}

// Standard API response types
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  path: string;
}

export interface ApiSuccess<T = any> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export type ApiResponse<T = any> = ApiSuccess<T> | { error: ApiError };

// Custom API error class
export class ApiValidationError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApiValidationError";
  }
}

/**
 * Validates request body against a Zod schema
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: NextApiRequest): T => {
    try {
      return schema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiValidationError(
          ApiErrorCode.VALIDATION_ERROR,
          "Request validation failed",
          {
            issues: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
              code: issue.code,
            })),
          },
        );
      }
      throw error;
    }
  };
}

/**
 * Validates query parameters against a Zod schema
 */
export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: NextApiRequest): T => {
    try {
      return schema.parse(req.query);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiValidationError(
          ApiErrorCode.VALIDATION_ERROR,
          "Query validation failed",
          {
            issues: error.issues.map((issue) => ({
              field: issue.path.join("."),
              message: issue.message,
              code: issue.code,
            })),
          },
        );
      }
      throw error;
    }
  };
}

/**
 * Standardized error handler
 */
export function handleApiError(
  error: unknown,
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const apiError: ApiError = {
    code: ApiErrorCode.INTERNAL_ERROR,
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    path: req.url || "unknown",
  };

  if (error instanceof ApiValidationError) {
    apiError.code = error.code;
    apiError.message = error.message;
    apiError.details = error.details;

    // Log validation errors for monitoring
    logger.warn("API validation error", {
      code: error.code,
      message: error.message,
      details: error.details,
      url: req.url,
      method: req.method,
      userAgent: req.headers["user-agent"],
      ip: (Array.isArray(req.headers["x-forwarded-for"]) 
        ? req.headers["x-forwarded-for"][0] 
        : req.headers["x-forwarded-for"]) || req.socket?.remoteAddress,
    });

    res.status(400).json({ error: apiError });
    return;
  }

  if (error instanceof Error) {
    // Don't expose internal error details in production
    if (process.env.NODE_ENV === "development") {
      apiError.message = error.message;
      apiError.details = { stack: error.stack };
    }

    // Log error with full context for monitoring
    logger.error("API error occurred", {
      error,
      errorMessage: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      userAgent: req.headers["user-agent"],
      ip: (Array.isArray(req.headers["x-forwarded-for"]) 
        ? req.headers["x-forwarded-for"][0] 
        : req.headers["x-forwarded-for"]) || req.socket?.remoteAddress,
      body: req.body ? JSON.stringify(req.body).substring(0, 500) : undefined,
    });
  } else {
    // Log unknown errors
    logger.error("Unknown API error", {
      errorValue: String(error),
      url: req.url,
      method: req.method,
    });
  }

  res.status(500).json({ error: apiError });
}

/**
 * Success response helper
 */
export function sendSuccess<T>(
  res: NextApiResponse,
  data: T,
  message?: string,
  meta?: ApiSuccess["meta"],
): void {
  const response: ApiSuccess<T> = { data };
  if (message) response.message = message;
  if (meta) response.meta = meta;

  res.status(200).json(response);
}

/**
 * Created response helper
 */
export function sendCreated<T>(
  res: NextApiResponse,
  data: T,
  message?: string,
): void {
  const response: ApiSuccess<T> = {
    data,
    message: message || "Resource created successfully",
  };

  res.status(201).json(response);
}

/**
 * Method validation middleware
 */
export function validateMethods(allowedMethods: string[]) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    if (!allowedMethods.includes(req.method || "")) {
      res.setHeader("Allow", allowedMethods.join(", "));
      throw new ApiValidationError(
        ApiErrorCode.BAD_REQUEST,
        `Method ${req.method} not allowed`,
      );
    }
    next();
  };
}

/**
 * CORS middleware
 */
export function corsMiddleware(
  origin: string[] = ["http://localhost:3000"],
  methods: string[] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
) {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && origin.includes(requestOrigin)) {
      res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    }

    res.setHeader("Access-Control-Allow-Methods", methods.join(", "));
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    next();
  };
}

/**
 * Combines multiple middlewares into a single handler
 */
export function createApiHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options: {
    methods?: string[];
    rateLimit?: { maxRequests: number; windowMs: number };
    cors?: boolean;
    validation?: {
      body?: z.ZodSchema;
      query?: z.ZodSchema;
    };
  } = {},
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Apply CORS if enabled
      if (options.cors) {
        corsMiddleware()(req, res, () => {});
      }

      // Validate methods
      if (options.methods) {
        validateMethods(options.methods)(req, res, () => {});
      }

      // Apply rate limiting if configured
      if (options.rateLimit) {
        await withRateLimit(async () => {}, options.rateLimit)(req, res);
      }

      // Validate request body
      if (options.validation?.body && req.body) {
        validateBody(options.validation.body)(req);
      }

      // Validate query parameters
      if (options.validation?.query) {
        validateQuery(options.validation.query)(req);
      }

      // Execute main handler
      await handler(req, res);
    } catch (error) {
      handleApiError(error, req, res);
    }
  };
}

export default createApiHandler;
