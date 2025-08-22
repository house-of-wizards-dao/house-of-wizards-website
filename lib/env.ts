/**
 * Environment variable validation and configuration
 */

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NODE_ENV: "development" | "test" | "production";
  REDIS_URL?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvironmentError";
  }
}

function validateEnvVar(
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
    const supabaseUrl = validateEnvVar(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
    const supabaseAnonKey = validateEnvVar(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
    const supabaseServiceKey = validateEnvVar(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      false,
    );

    return {
      NEXT_PUBLIC_SUPABASE_URL: validateSupabaseUrl(supabaseUrl),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: validateSupabaseKey(
        supabaseAnonKey,
        "anon",
      ),
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey
        ? validateSupabaseKey(supabaseServiceKey, "service")
        : undefined,
      NODE_ENV:
        (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
      REDIS_URL: process.env.REDIS_URL,
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
        NEXT_PUBLIC_SUPABASE_URL:
          process.env.NEXT_PUBLIC_SUPABASE_URL ||
          "https://placeholder.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY:
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NODE_ENV:
          (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
        REDIS_URL: process.env.REDIS_URL,
      };
    }
  }

  // Client-side validation
  return getValidatedEnv();
}

// Export the validated environment
export const env = getEnvWithFallbacks();
