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
  details?: Record<string, unknown>;
  timestamp: string;
  path: string;
}

export interface ApiSuccess<T = unknown> {
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | { error: ApiError };

// Custom API error class
export class ApiValidationError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public details?: Record<string, unknown>,
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
      ip:
        (Array.isArray(req.headers["x-forwarded-for"])
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
      ip:
        (Array.isArray(req.headers["x-forwarded-for"])
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
  origin: string[] = ["http://localhost:3001"],
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
 * Enhanced API handler options with security and performance features
 */
export interface ApiHandlerOptions {
  methods?: string[];
  rateLimit?: { maxRequests: number; windowMs: number; skipSuccessfulRequests?: boolean };
  cors?: boolean | { origins?: string[]; credentials?: boolean };
  validation?: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
  };
  auth?: {
    required?: boolean;
    roles?: string[];
    adminOnly?: boolean;
  };
  csrf?: boolean;
  cache?: {
    maxAge?: number;
    staleWhileRevalidate?: number;
    tags?: string[];
  };
  monitoring?: {
    trackPerformance?: boolean;
    logRequests?: boolean;
  };
}

/**
 * Enhanced middleware composition with comprehensive security
 */
export function createApiHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options: ApiHandlerOptions = {},
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now();
    
    try {
      // Set security headers first
      res.setHeader('X-API-Version', '1.0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');

      // Apply CORS if enabled
      if (options.cors) {
        const corsOptions = typeof options.cors === 'boolean' ? {} : options.cors;
        corsMiddleware(corsOptions.origins, ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])(req, res, () => {});
      }

      // Method validation
      if (options.methods) {
        validateMethods(options.methods)(req, res, () => {});
      }

      // Rate limiting with enhanced options
      if (options.rateLimit) {
        await withRateLimit(async () => {}, {
          ...options.rateLimit,
          skipSuccessfulRequests: options.rateLimit.skipSuccessfulRequests ?? false
        })(req, res);
      }

      // Authentication and authorization
      if (options.auth?.required) {
        const { authenticateRequest, requireAuth, requireAdmin } = await import('./auth');
        const user = await authenticateRequest(req);
        
        if (!user) {
          throw new ApiValidationError(ApiErrorCode.AUTHENTICATION_ERROR, 'Authentication required');
        }

        if (options.auth.adminOnly && user.role !== 'admin') {
          throw new ApiValidationError(ApiErrorCode.AUTHORIZATION_ERROR, 'Admin access required');
        }

        if (options.auth.roles && !options.auth.roles.includes(user.role || 'user')) {
          throw new ApiValidationError(ApiErrorCode.AUTHORIZATION_ERROR, 'Insufficient permissions');
        }

        // Attach user to request
        (req as any).user = user;
      }

      // CSRF protection for state-changing methods
      if (options.csrf && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
        const { csrfProtection } = await import('./csrf-middleware');
        if (!csrfProtection.validateToken(req)) {
          throw new ApiValidationError(ApiErrorCode.AUTHORIZATION_ERROR, 'CSRF validation failed');
        }
      }

      // Request validation
      if (options.validation?.body && req.body) {
        validateBody(options.validation.body)(req);
      }

      if (options.validation?.query) {
        validateQuery(options.validation.query)(req);
      }

      if (options.validation?.params && req.query) {
        // Validate route parameters
        const params = Object.keys(req.query).reduce((acc, key) => {
          if (key.startsWith('[') && key.endsWith(']')) {
            acc[key.slice(1, -1)] = req.query[key];
          }
          return acc;
        }, {} as Record<string, any>);
        options.validation.params.parse(params);
      }

      // Cache headers if specified
      if (options.cache && req.method === 'GET') {
        const { maxAge = 0, staleWhileRevalidate = 0 } = options.cache;
        res.setHeader('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`);
        
        if (options.cache.tags) {
          res.setHeader('Cache-Tags', options.cache.tags.join(', '));
        }
      }

      // Execute main handler
      await handler(req, res);

      // Performance monitoring
      if (options.monitoring?.trackPerformance) {
        const duration = Date.now() - startTime;
        logger.info(`API performance: ${req.method} ${req.url}`, {
          duration,
          statusCode: res.statusCode,
          method: req.method,
          url: req.url
        });
      }

    } catch (error) {
      handleApiError(error, req, res);
    }
  };
}

export default createApiHandler;
