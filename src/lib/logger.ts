import { env } from "./env";
import { createLogContext, type LogContext } from "./error-utils";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

// Re-export LogContext for backward compatibility and easier imports
export type { LogContext } from "./error-utils";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  environment: string;
}

class Logger {
  private readonly isProduction = env.NODE_ENV === "production";
  private readonly isDevelopment = env.NODE_ENV === "development";

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context),
      environment: env.NODE_ENV,
    };
  }

  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    // Remove sensitive data from logs
    const sanitized = { ...context };

    // Remove password fields
    Object.keys(sanitized).forEach((key) => {
      if (
        key.toLowerCase().includes("password") ||
        key.toLowerCase().includes("secret") ||
        key.toLowerCase().includes("token") ||
        key.toLowerCase().includes("key")
      ) {
        sanitized[key] = "[REDACTED]";
      }
    });

    // Truncate long strings to prevent log spam
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === "string" && sanitized[key].length > 1000) {
        sanitized[key] = sanitized[key].substring(0, 1000) + "... [TRUNCATED]";
      }
    });

    return sanitized;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;

    // In production, only log warnings and errors
    return level === LogLevel.ERROR || level === LogLevel.WARN;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, context);

    if (this.isDevelopment) {
      // Pretty print for development
      const colorCode = {
        [LogLevel.ERROR]: "\x1b[31m", // Red
        [LogLevel.WARN]: "\x1b[33m", // Yellow
        [LogLevel.INFO]: "\x1b[36m", // Cyan
        [LogLevel.DEBUG]: "\x1b[37m", // White
      };

      console.log(
        `${colorCode[level]}[${level.toUpperCase()}]\x1b[0m ${logEntry.timestamp} - ${message}`,
        context ? "\n  Context:" : "",
        context || "",
      );
    } else {
      // Structured JSON for production (works with log aggregators)
      console.log(JSON.stringify(logEntry));
    }

    // In production, you might want to send to external logging service
    if (this.isProduction && level === LogLevel.ERROR) {
      this.sendToExternalService(logEntry);
    }
  }

  private async sendToExternalService(logEntry: LogEntry): Promise<void> {
    // TODO: Integrate with external logging service (e.g., DataDog, LogRocket, Sentry)
    // For now, just ensure critical errors are visible
    console.error("CRITICAL ERROR:", JSON.stringify(logEntry, null, 2));
  }

  error(message: string, context?: LogContext | unknown): void {
    const safeContext =
      context && typeof context === "object" && "error" in context
        ? (context as LogContext)
        : createLogContext(context);
    this.log(LogLevel.ERROR, message, safeContext);
  }

  warn(message: string, context?: LogContext | unknown): void {
    const safeContext =
      context && typeof context === "object" && "error" in context
        ? (context as LogContext)
        : createLogContext(context);
    this.log(LogLevel.WARN, message, safeContext);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // HTTP request logging
  logRequest(req: any, res: any, startTime: number): void {
    const duration = Date.now() - startTime;
    const context: LogContext = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers["user-agent"],
      ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress,
    };

    if (res.statusCode >= 400) {
      this.error(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, context);
    } else {
      this.info(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, context);
    }
  }

  // Database operation logging
  logDatabaseOperation(
    operation: string,
    table: string,
    duration: number,
    error?: Error,
  ): void {
    const context: LogContext = {
      operation,
      table,
      duration,
    };

    if (error) {
      this.error(`Database operation failed: ${operation} on ${table}`, {
        ...context,
        error,
      });
    } else {
      this.debug(`Database operation: ${operation} on ${table}`, context);
    }
  }

  // Authentication logging
  logAuth(
    event: string,
    userId?: string,
    success: boolean = true,
    details?: any,
  ): void {
    const context: LogContext = {
      userId,
      authEvent: event,
      success,
      ...details,
    };

    if (success) {
      this.info(`Auth event: ${event}`, context);
    } else {
      this.warn(`Auth event failed: ${event}`, context);
    }
  }

  // Security event logging
  logSecurityEvent(
    event: string,
    severity: "low" | "medium" | "high" | "critical",
    context?: LogContext,
  ): void {
    const logContext: LogContext = {
      securityEvent: event,
      severity,
      ...context,
    };

    if (severity === "critical" || severity === "high") {
      this.error(`Security event: ${event}`, logContext);
    } else {
      this.warn(`Security event: ${event}`, logContext);
    }
  }
}

// Singleton instance
export const logger = new Logger();

// Request logging middleware
export function requestLogger() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Generate request ID for tracking
    req.requestId = Math.random().toString(36).substring(2, 15);

    // Log when response finishes
    res.on("finish", () => {
      logger.logRequest(req, res, startTime);
    });

    next();
  };
}

export default logger;
