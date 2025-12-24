/**
 * Environment variable validation and configuration
 */

interface EnvConfig {
  NODE_ENV: "development" | "test" | "production";
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentError";
  }
}

export function validateEnvVar(
  key: string,
  value: string | undefined,
  required = true,
): string {
  if (!value) {
    if (required) {
      throw new EnvironmentError(
        `Missing required environment variable: ${key}`,
      );
    }
    return "";
  }

  if (value.trim().length === 0) {
    throw new EnvironmentError(`Environment variable ${key} cannot be empty`);
  }

  return value.trim();
}

function validateSupabaseUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.includes("supabase")) {
      throw new Error("Invalid Supabase URL format");
    }
    return url;
  } catch (error) {
    throw new EnvironmentError(`Invalid SUPABASE_URL format: ${url}`);
  }
}

function validateSupabaseKey(key: string, type: "anon" | "service"): string {
  // Skip validation in test environment
  if (process.env.NODE_ENV === "test") {
    return key;
  }

  if (key.length < 32) {
    throw new EnvironmentError(`Invalid ${type} key format - too short`);
  }

  const expectedPrefix = type === "anon" ? "eyJ" : "eyJ";
  if (!key.startsWith(expectedPrefix)) {
    throw new EnvironmentError(
      `Invalid ${type} key format - missing JWT prefix`,
    );
  }

  return key;
}

/**
 * Validates and returns environment configuration
 * Throws EnvironmentError if validation fails
 */
export function getValidatedEnv(): EnvConfig {
  try {
    return {
      NODE_ENV:
        (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    };
  } catch (error) {
    if (error instanceof EnvironmentError) {
      throw error;
    }
    throw new EnvironmentError(
      `Environment validation failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Checks if we're in a server-side context
 */
export function isServerSide(): boolean {
  return typeof window === "undefined";
}

/**
 * Gets environment config with fallbacks for build time
 */
export function getEnvWithFallbacks(): EnvConfig {
  if (isServerSide()) {
    try {
      return getValidatedEnv();
    } catch (error) {
      // During build time, environment variables might not be available
      if (process.env.NODE_ENV === "production") {
        throw error;
      }

      // Provide safe fallbacks for development builds
      return {
        NODE_ENV:
          (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
          process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      };
    }
  }

  // Client-side validation
  return getValidatedEnv();
}

// Export the validated environment
export const env = getEnvWithFallbacks();
