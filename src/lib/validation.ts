import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Input validation and sanitization utilities
 */

export interface ValidationRule {
  required?: boolean;
  type?: "string" | "email" | "number" | "boolean";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

/**
 * Validate request body against schema
 */
export function validateInput(
  data: any,
  schema: ValidationSchema,
): {
  isValid: boolean;
  errors: string[];
  sanitized: any;
} {
  const errors: string[] = [];
  const sanitized: any = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required fields
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation if field is not required and not provided
    if (!rules.required && (value === undefined || value === null)) {
      continue;
    }

    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case "string":
          if (typeof value !== "string") {
            errors.push(`${field} must be a string`);
            continue;
          }
          break;
        case "email":
          if (
            typeof value !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ) {
            errors.push(`${field} must be a valid email`);
            continue;
          }
          break;
        case "number":
          if (typeof value !== "number" && isNaN(Number(value))) {
            errors.push(`${field} must be a number`);
            continue;
          }
          break;
        case "boolean":
          if (typeof value !== "boolean") {
            errors.push(`${field} must be a boolean`);
            continue;
          }
          break;
      }
    }

    // Length validation for strings
    if (typeof value === "string") {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
        continue;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(
          `${field} must be no more than ${rules.maxLength} characters`,
        );
        continue;
      }
    }

    // Pattern validation
    if (
      rules.pattern &&
      typeof value === "string" &&
      !rules.pattern.test(value)
    ) {
      errors.push(`${field} format is invalid`);
      continue;
    }

    // Sanitize the value
    sanitized[field] = sanitizeValue(value, rules.type);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Sanitize individual values
 */
function sanitizeValue(value: any, type?: string): any {
  if (type === "string" && typeof value === "string") {
    // Basic XSS prevention - remove script tags and dangerous attributes
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .trim();
  }

  if (type === "email" && typeof value === "string") {
    return value.toLowerCase().trim();
  }

  if (type === "number") {
    return Number(value);
  }

  return value;
}

/**
 * Middleware to validate request body
 */
export function withValidation(schema: ValidationSchema) {
  return function (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void> | void,
  ) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const validation = validateInput(req.body, schema);

      if (!validation.isValid) {
        return res.status(400).json({
          error: "Validation failed",
          details: validation.errors,
        });
      }

      // Replace req.body with sanitized data
      req.body = validation.sanitized;

      return handler(req, res);
    };
  };
}

/**
 * Rate limiting utility (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000,
) {
  return function (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void> | void,
  ) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const identifier =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown";
      const key = Array.isArray(identifier) ? identifier[0] : identifier;
      const now = Date.now();

      const current = rateLimitMap.get(key) || {
        count: 0,
        resetTime: now + windowMs,
      };

      if (now > current.resetTime) {
        current.count = 1;
        current.resetTime = now + windowMs;
      } else {
        current.count++;
      }

      rateLimitMap.set(key, current);

      if (current.count > maxRequests) {
        return res.status(429).json({
          error: "Too many requests",
          message: `Rate limit exceeded. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`,
        });
      }

      // Add rate limit headers
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, maxRequests - current.count),
      );
      res.setHeader("X-RateLimit-Reset", Math.ceil(current.resetTime / 1000));

      return handler(req, res);
    };
  };
}
