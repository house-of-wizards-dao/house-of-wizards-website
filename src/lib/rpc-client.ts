// Robust RPC Client with Fallback Transport for Reliable Blockchain Connectivity
import { createPublicClient, http, fallback, PublicClient } from "viem";
import { sepolia } from "viem/chains";

// Browser-friendly RPC endpoints with proven reliability
const RELIABLE_RPC_ENDPOINTS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://sepolia.gateway.tenderly.co",
  "https://sepolia.drpc.org",
  "https://rpc.sepolia.org", // Backup endpoint
] as const;

// Configuration for retry logic
const RPC_CONFIG = {
  retryCount: 3,
  retryDelay: 1000, // Start with 1 second
  timeout: 30000, // 30 second timeout
} as const;

// Create transport with exponential backoff retry logic
function createRetryTransport(endpoint: string) {
  return http(endpoint, {
    retryCount: RPC_CONFIG.retryCount,
    retryDelay: ({ count }) => {
      // Exponential backoff: 1s, 2s, 4s
      return RPC_CONFIG.retryDelay * Math.pow(2, count - 1);
    },
    timeout: RPC_CONFIG.timeout,
  });
}

// Create fallback transport with multiple reliable endpoints
const fallbackTransport = fallback(
  RELIABLE_RPC_ENDPOINTS.map(createRetryTransport),
  {
    rank: true, // Enable ranking to prioritize faster endpoints
    retryCount: 2, // Fallback-level retries
  },
);

// Single instance of the public client with robust configuration
let publicClient: PublicClient | null = null;

/**
 * Get or create a reliable RPC client with fallback endpoints
 */
export function getRpcClient(): PublicClient {
  if (!publicClient) {
    console.log("🚀 Creating RPC client with fallback transport...");
    console.log("📡 Available endpoints:", RELIABLE_RPC_ENDPOINTS);

    publicClient = createPublicClient({
      chain: sepolia,
      transport: fallbackTransport,
    });
  }

  return publicClient;
}

/**
 * Execute RPC calls with comprehensive error handling and retry logic
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        attempt > 1
          ? `🔄 Retry ${attempt}/${maxRetries}: ${operationName}`
          : `📡 Executing: ${operationName}`,
      );

      const result = await operation();

      if (attempt > 1) {
        console.log(`✅ ${operationName} succeeded on retry ${attempt}`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      console.warn(
        `❌ Attempt ${attempt}/${maxRetries} failed for ${operationName}:`,
        error instanceof Error ? error.message : error,
      );

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Waiting ${delayMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  console.error(`💥 All ${maxRetries} attempts failed for ${operationName}`);
  throw new Error(
    `RPC operation "${operationName}" failed after ${maxRetries} attempts. Last error: ${lastError?.message || "Unknown error"}`,
  );
}

/**
 * Health check for RPC endpoints
 */
export async function healthCheck(): Promise<{
  healthy: boolean;
  blockNumber: number | null;
  latency: number;
  endpoint: string | null;
}> {
  const startTime = Date.now();

  try {
    const client = getRpcClient();
    const blockNumber = await client.getBlockNumber();
    const latency = Date.now() - startTime;

    return {
      healthy: true,
      blockNumber: Number(blockNumber),
      latency,
      endpoint: "fallback-transport", // We don't know which specific endpoint was used
    };
  } catch (error) {
    return {
      healthy: false,
      blockNumber: null,
      latency: Date.now() - startTime,
      endpoint: null,
    };
  }
}

/**
 * Contract read operation with automatic retry
 */
export async function readContractWithRetry<T>(
  contractCall: () => Promise<T>,
  operationName: string,
): Promise<T> {
  return executeWithRetry(contractCall, `Contract Read: ${operationName}`, 3);
}

/**
 * Event log fetching with automatic retry
 */
export async function getLogsWithRetry<T>(
  getLogsCall: () => Promise<T>,
  operationName: string,
): Promise<T> {
  return executeWithRetry(getLogsCall, `Event Logs: ${operationName}`, 2);
}

/**
 * Block data fetching with automatic retry
 */
export async function getBlockWithRetry<T>(
  getBlockCall: () => Promise<T>,
  operationName: string,
): Promise<T> {
  return executeWithRetry(getBlockCall, `Block Data: ${operationName}`, 2);
}

// Export the configured endpoints for reference
export { RELIABLE_RPC_ENDPOINTS, RPC_CONFIG };
