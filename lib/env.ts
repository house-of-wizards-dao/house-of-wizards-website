/**
 * Environment variable validation and configuration
 */

interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  NODE_ENV: "development" | "test" | "production";
  REDIS_URL?: string;
  // Contract addresses (optional, validated separately)
  NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA?: string;
  NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET?: string;
  NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON?: string;
  NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM?: string;
  NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM?: string;
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

function validateContractAddress(address: string, networkName: string): string {
  // Skip validation in test environment
  if (process.env.NODE_ENV === "test") {
    return address;
  }

  const addressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!addressRegex.test(address)) {
    throw new EnvironmentError(
      `Invalid contract address format for ${networkName}: ${address}`,
    );
  }

  return address;
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

    // Validate contract addresses if present
    const contractAddresses = {
      NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA
        ? validateContractAddress(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA, "Sepolia")
        : undefined,
      NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET
        ? validateContractAddress(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET, "Mainnet")
        : undefined,
      NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON
        ? validateContractAddress(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON, "Polygon")
        : undefined,
      NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM
        ? validateContractAddress(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM, "Optimism")
        : undefined,
      NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM
        ? validateContractAddress(process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM, "Arbitrum")
        : undefined,
    };

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
      ...contractAddresses,
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
        // Contract addresses (no validation in fallback mode)
        NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_SEPOLIA,
        NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_MAINNET,
        NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_POLYGON,
        NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_OPTIMISM,
        NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM: process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ARBITRUM,
      };
    }
  }

  // Client-side validation
  return getValidatedEnv();
}

// Export the validated environment
export const env = getEnvWithFallbacks();
