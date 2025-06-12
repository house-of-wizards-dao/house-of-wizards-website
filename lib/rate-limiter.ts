import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

interface RateLimitInfo {
  count: number;
  reset_time: number;
  window_start: number;
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (req: NextApiRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

class RateLimiter {
  private supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  constructor() {
    this.initializeTable();
  }

  private async initializeTable() {
    // Create rate_limits table if it doesn't exist
    const { error } = await this.supabase.rpc(
      "create_rate_limits_table_if_not_exists",
    );
    if (error && !error.message.includes("already exists")) {
      console.error("Failed to initialize rate limits table:", error);
    }
  }

  public getDefaultKey(req: NextApiRequest): string {
    // Use IP address and endpoint as key
    const ip = this.getClientIp(req);
    const endpoint = req.url || "unknown";
    return `${ip}:${endpoint}`;
  }

  private getClientIp(req: NextApiRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(",")[0]
      : req.socket.remoteAddress;
    return ip || "unknown";
  }

  async checkLimit(
    key: string,
    options: RateLimitOptions,
  ): Promise<{
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
  }> {
    const now = Date.now();
    const windowStart = now - (now % options.windowMs);

    try {
      // Get current rate limit info
      const { data: existing, error: fetchError } = await this.supabase
        .from("rate_limits")
        .select("count, reset_time, window_start")
        .eq("key", key)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // Not found error
        throw fetchError;
      }

      let currentCount = 0;

      if (existing) {
        // Check if we're in the same window
        if (existing.window_start === windowStart) {
          currentCount = existing.count;
        }
        // If window has expired, count resets to 0
      }

      const newCount = currentCount + 1;
      const allowed = newCount <= options.maxRequests;
      const resetTime = windowStart + options.windowMs;

      // Update or insert rate limit record
      const { error: upsertError } = await this.supabase
        .from("rate_limits")
        .upsert(
          {
            key,
            count: newCount,
            reset_time: resetTime,
            window_start: windowStart,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "key",
          },
        );

      if (upsertError) {
        throw upsertError;
      }

      return {
        allowed,
        limit: options.maxRequests,
        remaining: Math.max(0, options.maxRequests - newCount),
        reset: Math.ceil(resetTime / 1000),
        retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000),
      };
    } catch (error) {
      console.error("Rate limiting error:", error);
      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        limit: options.maxRequests,
        remaining: options.maxRequests - 1,
        reset: Math.ceil((now + options.windowMs) / 1000),
      };
    }
  }

  async cleanupExpired(): Promise<void> {
    const now = Date.now();
    try {
      await this.supabase.from("rate_limits").delete().lt("reset_time", now);
    } catch (error) {
      console.error("Failed to cleanup expired rate limits:", error);
    }
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware
 */
export function rateLimit(options: RateLimitOptions) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next?: () => void,
  ) => {
    const key = options.keyGenerator
      ? options.keyGenerator(req)
      : rateLimiter.getDefaultKey(req);

    const result = await rateLimiter.checkLimit(key, options);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", result.reset);

    if (!result.allowed) {
      if (result.retryAfter) {
        res.setHeader("Retry-After", result.retryAfter);
      }

      return res.status(429).json({
        error: "Too Many Requests",
        message:
          options.message ||
          `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
      });
    }

    if (next) {
      return next();
    }
  };
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 */
export function withRateLimit(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options: RateLimitOptions,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const rateLimitMiddleware = rateLimit(options);

    return new Promise<void>((resolve, reject) => {
      rateLimitMiddleware(req, res, () => {
        try {
          const result = handler(req, res);
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  };
}

// Cleanup expired rate limits every hour
setInterval(
  () => {
    rateLimiter.cleanupExpired();
  },
  60 * 60 * 1000,
);

export default rateLimiter;
