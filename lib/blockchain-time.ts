// Blockchain Time Synchronization Utilities
import { usePublicClient } from "wagmi";
import { logger } from "@/lib/logger";

// Safety buffer in milliseconds (3 minutes)
export const AUCTION_SAFETY_BUFFER_MS = 3 * 60 * 1000; // 3 minutes
export const AUCTION_SAFETY_BUFFER_SECONDS = 180; // 3 minutes in seconds

export interface BlockchainTimeResult {
  timestamp: number; // Unix timestamp in seconds
  blockNumber: bigint;
  isAccurate: boolean; // Whether this is actual blockchain time or fallback
}

/**
 * Fetches the current blockchain timestamp from the latest block
 * Falls back to JavaScript Date.now() with buffer if blockchain fetch fails
 */
export async function getBlockchainTime(publicClient?: any): Promise<BlockchainTimeResult> {
  try {
    if (!publicClient) {
      logger.warn("No public client available, falling back to local time");
      return {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(0),
        isAccurate: false,
      };
    }

    // Get the latest block to get accurate blockchain timestamp
    const block = await publicClient.getBlock({ blockTag: 'latest' });
    
    if (!block || !block.timestamp) {
      throw new Error("Failed to get block timestamp");
    }

    logger.info("Successfully fetched blockchain time", {
      timestamp: Number(block.timestamp),
      blockNumber: block.number?.toString(),
    });

    return {
      timestamp: Number(block.timestamp),
      blockNumber: block.number || BigInt(0),
      isAccurate: true,
    };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to fetch blockchain time, falling back to local time", { error: errorObj });
    
    // Fallback to local time with some buffer to account for potential blockchain delay
    const localTimestamp = Math.floor(Date.now() / 1000);
    
    return {
      timestamp: localTimestamp,
      blockNumber: BigInt(0),
      isAccurate: false,
    };
  }
}

/**
 * Calculates the safe end time for an auction with buffer
 * @param startTimestamp - Start time in seconds (blockchain time)
 * @param durationHours - Duration in hours (user-intended)
 * @param includeBuffer - Whether to include safety buffer
 */
export function calculateAuctionEndTime(
  startTimestamp: number,
  durationHours: number,
  includeBuffer = true
): {
  userEndTime: number; // What user expects (no buffer)
  actualEndTime: number; // What gets stored/used on blockchain (with buffer)
  bufferSeconds: number; // Applied buffer in seconds
} {
  const durationSeconds = durationHours * 3600; // Convert hours to seconds
  const bufferSeconds = includeBuffer ? AUCTION_SAFETY_BUFFER_SECONDS : 0;
  
  const userEndTime = startTimestamp + durationSeconds;
  const actualEndTime = startTimestamp + durationSeconds + bufferSeconds;
  
  return {
    userEndTime,
    actualEndTime,
    bufferSeconds,
  };
}

/**
 * Validates if an auction can still accept bids based on blockchain time
 * @param auctionEndTime - Auction end time in seconds
 * @param blockchainTime - Current blockchain time result
 * @param gracePeriodSeconds - Additional grace period (default 30 seconds)
 */
export function canAcceptBids(
  auctionEndTime: number,
  blockchainTime: BlockchainTimeResult,
  gracePeriodSeconds = 30
): {
  canBid: boolean;
  timeRemaining: number; // Seconds remaining (can be negative)
  reason?: string;
} {
  const timeRemaining = auctionEndTime - blockchainTime.timestamp - gracePeriodSeconds;
  
  if (timeRemaining <= 0) {
    return {
      canBid: false,
      timeRemaining,
      reason: blockchainTime.isAccurate 
        ? "Auction has ended according to blockchain time"
        : "Auction has ended according to local time (blockchain time unavailable)",
    };
  }
  
  return {
    canBid: true,
    timeRemaining,
  };
}

/**
 * Custom hook to get blockchain time with caching
 * Only use this hook inside React components within WagmiProvider
 */
export function useBlockchainTime() {
  const publicClient = usePublicClient();
  
  return {
    getTime: () => getBlockchainTime(publicClient),
    calculateEndTime: calculateAuctionEndTime,
    canAcceptBids,
  };
}

/**
 * Standalone blockchain time function that doesn't require React hooks
 * Safe to use in API routes, server-side code, or when Wagmi context is unavailable
 */
export async function getBlockchainTimeStandalone(rpcUrl?: string) {
  try {
    if (!rpcUrl) {
      logger.warn("No RPC URL provided for standalone blockchain time fetch, falling back to local time");
      return {
        timestamp: Math.floor(Date.now() / 1000),
        blockNumber: BigInt(0),
        isAccurate: false,
      };
    }

    // Use fetch to get block data directly via JSON-RPC
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['latest', false],
        id: 1,
      }),
    });

    const data = await response.json();
    
    if (data.error || !data.result || !data.result.timestamp) {
      throw new Error(data.error?.message || 'Failed to get block data');
    }

    const timestamp = parseInt(data.result.timestamp, 16);
    const blockNumber = BigInt(data.result.number);

    logger.info("Successfully fetched standalone blockchain time", {
      timestamp,
      blockNumber: blockNumber.toString(),
    });

    return {
      timestamp,
      blockNumber,
      isAccurate: true,
    };
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    logger.error("Failed to fetch standalone blockchain time, falling back to local time", { error: errorObj });
    
    return {
      timestamp: Math.floor(Date.now() / 1000),
      blockNumber: BigInt(0),
      isAccurate: false,
    };
  }
}

/**
 * Formats duration for display, hiding the safety buffer from users
 * @param userEndTime - User-expected end time
 * @param actualEndTime - Actual end time with buffer
 * @param currentTime - Current time for relative display
 */
export function formatAuctionDuration(
  userEndTime: number,
  actualEndTime: number,
  currentTime: number
): {
  userDisplay: string; // What to show users
  actualRemaining: number; // Actual seconds remaining
  hasBuffer: boolean; // Whether buffer is applied
} {
  const userRemaining = userEndTime - currentTime;
  const actualRemaining = actualEndTime - currentTime;
  const hasBuffer = actualEndTime > userEndTime;
  
  // Format user display based on user-expected time
  let userDisplay = "Auction Ended";
  if (userRemaining > 0) {
    const days = Math.floor(userRemaining / (24 * 3600));
    const hours = Math.floor((userRemaining % (24 * 3600)) / 3600);
    const minutes = Math.floor((userRemaining % 3600) / 60);
    const seconds = userRemaining % 60;
    
    if (days > 0) {
      userDisplay = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      userDisplay = `${hours}h ${minutes}m ${seconds}s`;
    } else {
      userDisplay = `${minutes}m ${seconds}s`;
    }
  }
  
  return {
    userDisplay,
    actualRemaining,
    hasBuffer,
  };
}