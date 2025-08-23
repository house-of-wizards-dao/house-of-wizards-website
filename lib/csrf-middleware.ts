import { NextApiRequest, NextApiResponse } from "next";
import { createHash, randomBytes } from "crypto";
import { logger } from "./logger";
import { env } from "./env";

interface CSRFOptions {
  secret?: string;
  cookieName?: string;
  headerName?: string;
  tokenLength?: number;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
  httpOnly?: boolean;
  maxAge?: number;
}

const DEFAULT_OPTIONS: Required<CSRFOptions> = {
  secret: env.NODE_ENV === "production" ? "" : "default-dev-secret", // Must be set in production
  cookieName: "_csrf_token",
  headerName: "x-csrf-token",
  tokenLength: 32,
  sameSite: "strict",
  secure: env.NODE_ENV === "production",
  httpOnly: false, // Needs to be accessible by JavaScript for AJAX requests
  maxAge: 86400, // 24 hours in seconds
};

export class CSRFProtection {
  private options: Required<CSRFOptions>;

  constructor(options: CSRFOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Validate secret in production
    if (env.NODE_ENV === "production" && !this.options.secret) {
      logger.logSecurityEvent("csrf_no_secret_production", "critical", {
        environment: env.NODE_ENV
      });
      throw new Error("CSRF secret must be configured in production");
    }
  }

  /**
   * Generate a CSRF token using double-submit cookie pattern
   */
  private generateToken(): string {
    return randomBytes(this.options.tokenLength).toString("hex");
  }

  /**
   * Create HMAC signature for token validation
   */
  private signToken(token: string): string {
    const hmac = createHash("sha256");
    hmac.update(token + this.options.secret);
    return hmac.digest("hex");
  }

  /**
   * Verify CSRF token signature
   */
  private verifyToken(token: string, signature: string): boolean {
    const expectedSignature = this.signToken(token);
    
    // Use timing-safe comparison
    if (signature.length !== expectedSignature.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < expectedSignature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
    }
    
    return result === 0;
  }

  /**
   * Set CSRF cookie on response
   */
  private setCsrfCookie(res: NextApiResponse, token: string): void {
    const signature = this.signToken(token);
    const cookieValue = `${token}.${signature}`;
    
    const cookieOptions = [
      `${this.options.cookieName}=${cookieValue}`,
      `Max-Age=${this.options.maxAge}`,
      `SameSite=${this.options.sameSite}`,
      "Path=/",
    ];

    if (this.options.secure) {
      cookieOptions.push("Secure");
    }

    if (this.options.httpOnly) {
      cookieOptions.push("HttpOnly");
    }

    res.setHeader("Set-Cookie", cookieOptions.join("; "));
  }

  /**
   * Parse CSRF token from cookie
   */
  public parseCsrfCookie(req: NextApiRequest): { token: string; signature: string } | null {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return null;
    }

    const cookieMatch = cookies.match(new RegExp(`${this.options.cookieName}=([^;]+)`));
    if (!cookieMatch) {
      return null;
    }

    const cookieValue = cookieMatch[1];
    const parts = cookieValue.split(".");
    
    if (parts.length !== 2) {
      return null;
    }

    return {
      token: parts[0],
      signature: parts[1],
    };
  }

  /**
   * Get CSRF token from request headers
   */
  private getTokenFromHeader(req: NextApiRequest): string | null {
    const headerValue = req.headers[this.options.headerName];
    return Array.isArray(headerValue) ? headerValue[0] : headerValue || null;
  }

  /**
   * Get CSRF token from request body (for form submissions)
   */
  private getTokenFromBody(req: NextApiRequest): string | null {
    if (req.body && typeof req.body === "object") {
      return req.body._csrf_token || req.body.csrfToken || null;
    }
    return null;
  }

  /**
   * Check if the request method requires CSRF protection
   */
  private isStateMutatingMethod(method: string): boolean {
    return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
  }

  /**
   * Get client IP address for logging
   */
  private getClientIp(req: NextApiRequest): string {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? Array.isArray(forwarded)
        ? forwarded[0]
        : forwarded.split(",")[0]
      : req.socket.remoteAddress;
    return ip || "unknown";
  }

  /**
   * Generate a new CSRF token for a request
   */
  public generateTokenForRequest(req: NextApiRequest, res: NextApiResponse): string {
    const token = this.generateToken();
    this.setCsrfCookie(res, token);
    
    logger.debug("CSRF token generated", {
      method: req.method,
      url: req.url,
      ip: this.getClientIp(req),
      tokenLength: token.length
    });
    
    return token;
  }

  /**
   * Validate CSRF token for a request
   */
  public validateToken(req: NextApiRequest): boolean {
    // Skip validation for safe methods
    if (!this.isStateMutatingMethod(req.method || "GET")) {
      return true;
    }

    // Get token from cookie
    const cookieData = this.parseCsrfCookie(req);
    if (!cookieData) {
      logger.logSecurityEvent("csrf_missing_cookie", "medium", {
        method: req.method,
        url: req.url,
        ip: this.getClientIp(req),
        userAgent: req.headers["user-agent"]
      });
      return false;
    }

    // Verify cookie signature
    if (!this.verifyToken(cookieData.token, cookieData.signature)) {
      logger.logSecurityEvent("csrf_invalid_cookie_signature", "high", {
        method: req.method,
        url: req.url,
        ip: this.getClientIp(req),
        userAgent: req.headers["user-agent"]
      });
      return false;
    }

    // Get token from request (header or body)
    const requestToken = this.getTokenFromHeader(req) || this.getTokenFromBody(req);
    if (!requestToken) {
      logger.logSecurityEvent("csrf_missing_token", "medium", {
        method: req.method,
        url: req.url,
        ip: this.getClientIp(req),
        userAgent: req.headers["user-agent"],
        hasCookie: true
      });
      return false;
    }

    // Verify tokens match (double-submit cookie pattern)
    if (cookieData.token !== requestToken) {
      logger.logSecurityEvent("csrf_token_mismatch", "high", {
        method: req.method,
        url: req.url,
        ip: this.getClientIp(req),
        userAgent: req.headers["user-agent"],
        cookieToken: cookieData.token.substring(0, 8) + "...", // Log partial for debugging
        requestToken: requestToken.substring(0, 8) + "..."
      });
      return false;
    }

    // Log successful validation
    logger.debug("CSRF token validation successful", {
      method: req.method,
      url: req.url,
      ip: this.getClientIp(req)
    });

    return true;
  }

  /**
   * Middleware for CSRF protection
   */
  public middleware() {
    return (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
      // Generate token if needed (for GET requests or when missing)
      if (!this.parseCsrfCookie(req) && !this.isStateMutatingMethod(req.method || "GET")) {
        this.generateTokenForRequest(req, res);
      }

      // Validate token for state-changing requests
      if (this.isStateMutatingMethod(req.method || "GET")) {
        if (!this.validateToken(req)) {
          logger.logSecurityEvent("csrf_validation_failed", "high", {
            method: req.method,
            url: req.url,
            ip: this.getClientIp(req),
            userAgent: req.headers["user-agent"]
          });

          return res.status(403).json({
            error: "Forbidden",
            message: "CSRF token validation failed",
            code: "CSRF_INVALID"
          });
        }
      }

      if (next) {
        return next();
      }
    };
  }
}

/**
 * Default CSRF protection instance
 */
export const csrfProtection = new CSRFProtection();

/**
 * Higher-order function to wrap API handlers with CSRF protection
 */
export function withCSRFProtection(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void,
  options?: CSRFOptions
) {
  const csrf = options ? new CSRFProtection(options) : csrfProtection;
  
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const csrfMiddleware = csrf.middleware();

    return new Promise<void>((resolve, reject) => {
      csrfMiddleware(req, res, () => {
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

/**
 * Utility function to get CSRF token for client-side use
 */
export function getCSRFToken(req: NextApiRequest): string | null {
  const cookieData = csrfProtection.parseCsrfCookie(req);
  return cookieData?.token || null;
}

export default csrfProtection;