// Hook for interacting with auction smart contract
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { parseEther } from "viem";
import { useState, useCallback } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { logger } from "@/lib/logger";
import { AUCTION_ABI, getContractAddress } from "@/lib/web3-config";
import { getBlockchainTime, canAcceptBids, AUCTION_SAFETY_BUFFER_SECONDS } from "@/lib/blockchain-time";
import { rpcCache, cacheInvalidation } from "@/lib/rpc-cache";
import { getAuctionCircuitBreaker, CircuitBreakerState } from "@/lib/circuit-breaker";
import { AuctionTransactionManager, TransactionStep, TransactionResult } from "@/lib/distributed-transaction";

// Retry configuration - reduced timeouts for faster failover
const RETRY_CONFIG = {
  maxRetries: 2, // Reduced retries, let circuit breaker handle
  baseDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds (reduced)
  timeoutMs: 8000, // 8 seconds (significantly reduced)
};

// Cache-aware contract read wrapper
async function cachedContractRead<T>(
  publicClient: any,
  contractAddress: string,
  functionName: string,
  args?: readonly unknown[],
  options?: { skipCache?: boolean; customTTL?: number }
): Promise<T> {
  const method = `eth_call_${functionName}`;
  const params = [contractAddress, functionName, args || []];
  
  // Check cache first (unless explicitly skipped)
  if (!options?.skipCache) {
    const cached = rpcCache.get<T>(method, params);
    if (cached !== null) {
      return cached;
    }
  }
  
  // Make the actual contract call
  const result = await publicClient.readContract({
    address: contractAddress as `0x${string}`,
    abi: AUCTION_ABI,
    functionName,
    args
  });
  
  // Cache the result
  rpcCache.set(method, params, result, options?.customTTL);
  
  return result;
}

// Contract call timeout wrapper
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = RETRY_CONFIG.timeoutMs): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Exponential backoff retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  retries: number = RETRY_CONFIG.maxRetries,
  baseDelay: number = RETRY_CONFIG.baseDelay
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Don't retry certain errors
    if (
      errorMessage.includes("user rejected") ||
      errorMessage.includes("User rejected") ||
      errorMessage.includes("auction has ended") ||
      errorMessage.includes("Auction ended") ||
      errorMessage.includes("insufficient funds")
    ) {
      throw error;
    }

    const delay = Math.min(baseDelay * (RETRY_CONFIG.maxRetries - retries + 1), RETRY_CONFIG.maxDelay);
    logger.warn(`Operation failed, retrying in ${delay}ms (${retries} retries left)`, {
      errorMessage,
      retries,
      originalError: error instanceof Error ? error : undefined,
    });

    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(operation, retries - 1, baseDelay);
  }
}

// Safe contract call wrapper with comprehensive error handling
async function safeContractCall<T>(
  operation: () => Promise<T>,
  fallback?: T,
  operationName: string = "contract call"
): Promise<T | null> {
  try {
    return await withTimeout(withRetry(operation));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error(`${operationName} failed`, {
      errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      originalError: error instanceof Error ? error : undefined,
    });

    // Return fallback value if provided
    if (fallback !== undefined) {
      logger.info(`Using fallback value for ${operationName}`, { fallback });
      return fallback;
    }

    // Return null for failed operations without fallback
    return null;
  }
}

export function useAuctionContract() {
  const { address, chainId } = useAccount();
  const supabase = useSupabaseClient();
  const user = useUser();
  const publicClient = usePublicClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const contractAddress = chainId ? getContractAddress(chainId) : undefined;
  
  // Initialize transaction manager for atomic operations
  const transactionManager = new AuctionTransactionManager(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    writeContractAsync,
    data: txHash,
    error: writeError,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Place a bid on-chain
  const placeBidOnChain = useCallback(
    async (auctionId: string, bidAmount: string, onChainAuctionId?: number) => {
      if (!contractAddress) {
        throw new Error("Contract not deployed on this network");
      }

      if (!user) {
        throw new Error("User not authenticated");
      }

      setIsProcessing(true);

      try {
        // If no on-chain auction ID exists, create the auction on-chain first
        let auctionIdToUse = onChainAuctionId;

        logger.info("Initial auction ID to use", { 
          auctionIdToUse, 
          auctionId 
        });

        // Get auction details from database (needed for all validation paths)
        let auction = null;
        try {
          const { data: auctionData } = await supabase
            .from("auctions")
            .select("*, on_chain_auction_id")
            .eq("id", auctionId)
            .single();
          auction = auctionData;
        } catch (error) {
          logger.error("Failed to fetch auction from database", { error, auctionId });
        }
        
        if (!auction) throw new Error("Auction not found");

        if (auctionIdToUse === undefined) {

          // Check if we already have an on-chain auction ID stored
          let shouldCreateNewAuction = false;
          
          if (auction.on_chain_auction_id !== null) {
            // Check if the existing on-chain auction is still valid
            try {
              if (!publicClient) {
                throw new Error("PublicClient not available");
              }
              const blockchainTimeResult = await getBlockchainTime(publicClient);
              const auctionData = await publicClient.readContract({
                address: contractAddress as `0x${string}`,
                abi: AUCTION_ABI,
                functionName: "getAuction",
                args: [BigInt(auction.on_chain_auction_id)],
              });
              
              // Check if auction exists and is still active
              if (Array.isArray(auctionData) && auctionData.length >= 4) {
                const onChainEndTime = Number(auctionData[3]); // endTime
                const isSettled = auctionData[5]; // settled flag
                
                // If auction has ended or is settled, we need to create a new one
                if (onChainEndTime <= blockchainTimeResult.timestamp || isSettled) {
                  logger.info("Existing on-chain auction has ended or is settled, creating new one", {
                    onChainAuctionId: auction.on_chain_auction_id,
                    onChainEndTime,
                    currentTime: blockchainTimeResult.timestamp,
                    isSettled
                  });
                  shouldCreateNewAuction = true;
                } else {
                  // Auction is still active, use it
                  auctionIdToUse = auction.on_chain_auction_id;
                  logger.info("Using existing active on-chain auction ID", { 
                    auctionIdToUse, 
                    auctionId,
                    timeRemaining: onChainEndTime - blockchainTimeResult.timestamp
                  });
                }
              } else {
                // Invalid auction data, create new one
                logger.warn("Invalid auction data from contract, creating new auction", {
                  onChainAuctionId: auction.on_chain_auction_id
                });
                shouldCreateNewAuction = true;
              }
            } catch (error: any) {
              // Error reading auction, it might not exist or have wrong ABI, create a new one
              logger.warn("Error reading existing on-chain auction, creating new one", {
                onChainAuctionId: auction.on_chain_auction_id,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorType: error?.name || 'Unknown'
              });
              shouldCreateNewAuction = true;
              
              // Clear the old auction ID from database to avoid confusion
              await supabase
                .from("auctions")
                .update({ on_chain_auction_id: null })
                .eq("id", auctionId);
            }
          } else {
            shouldCreateNewAuction = true;
          }
          
          if (shouldCreateNewAuction) {
            // We need to create a new on-chain auction
            logger.info("No existing on-chain auction found - will create new one", { 
              auctionId 
            });

            // Get blockchain time for accurate calculation
            const blockchainTimeResult = await getBlockchainTime(publicClient);
            const currentBlockchainTime = blockchainTimeResult.timestamp;
            
            const endTime = Math.floor(new Date(auction.end_time).getTime() / 1000);
            const remainingSeconds = endTime - currentBlockchainTime;

            // Check if auction can accept bids using blockchain time
            const bidValidation = canAcceptBids(endTime, blockchainTimeResult);
            
            if (!bidValidation.canBid) {
              throw new Error(bidValidation.reason || "This auction has already ended");
            }

            // Ensure minimum 1 hour duration, but account for the safety buffer
            const minDurationWithBuffer = 3600 + AUCTION_SAFETY_BUFFER_SECONDS; // 1 hour + buffer
            const duration = Math.max(remainingSeconds, minDurationWithBuffer);
            
            logger.info("Calculated auction duration for on-chain creation", {
              auctionId,
              endTime,
              currentBlockchainTime,
              remainingSeconds,
              duration,
              usedBlockchainTime: blockchainTimeResult.isAccurate
            });

            console.log(
              "Creating auction on-chain for:",
              auctionId,
              "Duration:",
              duration,
              "seconds",
            );

            // Create auction on-chain with timeout handling
            try {
              const createResult = await writeContractAsync({
                address: contractAddress as `0x${string}`,
                abi: AUCTION_ABI,
                functionName: "createAuction",
                args: [
                  auctionId, // offchain ID
                  parseEther(auction.starting_bid.toString()),
                  BigInt(duration),
                ],
              });

              console.log("Auction created with tx:", createResult);

              // Read the auction counter to get the actual auction ID
              try {
                if (publicClient && contractAddress) {
                  const counter = await publicClient.readContract({
                    address: contractAddress as `0x${string}`,
                    abi: AUCTION_ABI,
                    functionName: "auctionCounter",
                    args: [],
                  });
                  // The counter is incremented after creation, so the auction ID is counter - 1
                  auctionIdToUse = Number(counter) - 1;
                  console.log(
                    "Read auction counter:",
                    counter,
                    "Using auction ID:",
                    auctionIdToUse,
                  );

                  // Update database with on-chain auction ID
                  const { error: updateError } = await supabase
                    .from("auctions")
                    .update({ on_chain_auction_id: auctionIdToUse })
                    .eq("id", auctionId);

                  if (updateError) {
                    console.error(
                      "Failed to update database with on-chain ID:",
                      updateError,
                    );
                  }

                  console.log(
                    "Successfully created on-chain auction with ID",
                    auctionIdToUse,
                    "for auction",
                    auctionId,
                  );
                } else {
                  throw new Error("Unable to read auction counter");
                }
              } catch (counterError) {
                console.error("Failed to read auction counter:", counterError);
                // Fallback: use a hash-based ID but still store it
                const hashCode = auctionId.split("").reduce((a, b) => {
                  a = (a << 5) - a + b.charCodeAt(0);
                  return a & a;
                }, 0);
                auctionIdToUse = Math.abs(hashCode) % 1000000;
                console.log("Using fallback auction ID:", auctionIdToUse);

                // Update database with fallback ID
                const { error: updateError } = await supabase
                  .from("auctions")
                  .update({ on_chain_auction_id: auctionIdToUse })
                  .eq("id", auctionId);

                if (updateError) {
                  console.error(
                    "Failed to update database with fallback ID:",
                    updateError,
                  );
                }

                console.log(
                  "Using fallback on-chain auction ID",
                  auctionIdToUse,
                  "for auction",
                  auctionId,
                );
              }
            } catch (createError: any) {
              console.error("Failed to create auction on-chain:", createError);
              if (createError.message?.includes("timeout")) {
                throw new Error(
                  "Transaction timed out. Please try again with a different RPC endpoint or retry later.",
                );
              }
              if (createError.message?.includes("Auction ended")) {
                throw new Error(
                  "Cannot create auction - time has already passed",
                );
              }
              throw createError;
            }
          }
        }

        // Enhanced Validation Chain - Fix for auction ID determination error
        auctionIdToUse = await validateAndRecoverAuctionId(
          auctionId,
          auctionIdToUse,
          auction
        );
        
        // Final validation with enhanced error context
        if (auctionIdToUse === undefined || auctionIdToUse === null) {
          throw new Error(
            `Critical: Failed to determine auction ID for on-chain operations. ` +
            `Database ID: ${auctionId}, Attempted on-chain ID: ${onChainAuctionId}, ` +
            `State: ${JSON.stringify({ hasContract: !!contractAddress, hasPublicClient: !!publicClient, hasUser: !!user })}`
          );
        }

        // Check auction status before bidding using blockchain time
        if (publicClient && contractAddress) {
          try {
            // Get current blockchain time
            const blockchainTimeResult = await getBlockchainTime(publicClient);
            
            // COMPATIBILITY FIX: Use auctions mapping to avoid ABI issues
            const auctionData = await getAuctionData(auctionIdToUse);
            console.log("Auction data from contract:", auctionData);

            // Validate auction data
            if (!auctionData || !auctionData.endTime) {
              throw new Error(
                "Could not retrieve auction data from contract - auction may not exist",
              );
            }

            // Check if auction has ended using blockchain time
            const contractEndTime = Number(auctionData.endTime);
            if (isNaN(contractEndTime) || contractEndTime <= 0) {
              throw new Error(
                "Invalid endTime value from contract",
              );
            }

            // Use blockchain time for validation
            const bidValidation = canAcceptBids(contractEndTime, blockchainTimeResult);
            if (!bidValidation.canBid) {
              throw new Error(
                `Auction ${auctionIdToUse} has ended. ${bidValidation.reason}. Contract end time: ${contractEndTime}, Blockchain time: ${blockchainTimeResult.timestamp}`,
              );
            }

            logger.info("Auction timing validation passed", {
              auctionIdToUse,
              contractEndTime,
              blockchainTime: blockchainTimeResult.timestamp,
              timeRemaining: bidValidation.timeRemaining,
              isBlockchainTimeAccurate: blockchainTimeResult.isAccurate
            });
            
          } catch (readError: any) {
            console.error("Failed to read auction data:", readError);
            
            // Check for common error patterns
            const errorMessage = readError.message || String(readError);
            
            if (errorMessage.includes("auction may not exist")) {
              throw new Error(
                `Auction ID ${auctionIdToUse} does not exist on the contract. Please check if this is a valid auction.`
              );
            }
            
            if (errorMessage.includes("Bytes value") || 
                errorMessage.includes("Invalid") ||
                errorMessage.includes("ABI")) {
              // This is likely an ABI compatibility issue
              logger.warn(
                "ABI compatibility issue detected - proceeding with caution",
                { auctionIdToUse }
              );
            } else if (errorMessage.includes("ended")) {
              // Auction has ended
              throw readError;
            } else {
              // For other errors, log but continue with warning
              logger.warn(
                "Auction validation failed - proceeding with bid attempt",
                { error: errorMessage }
              );
            }
          }
        }

        // Place the bid
        console.log("Placing bid on-chain for auction:", auctionIdToUse);

        try {
          const result = await writeContractAsync({
            address: contractAddress as `0x${string}`,
            abi: AUCTION_ABI,
            functionName: "placeBid",
            args: [BigInt(auctionIdToUse)],
            value: parseEther(bidAmount),
          });

          console.log("Bid placed with tx:", result);
          console.log(
            "Saving bid to database - User ID:",
            user.id,
            "Wallet:",
            address,
          );

          // Update database with transaction hash (use user ID, not wallet address)
          const { error: bidInsertError } = await supabase.from("bids").insert({
            auction_id: auctionId,
            bidder_id: user.id,
            amount: parseFloat(bidAmount),
            transaction_hash: result,
            is_winning: true,
          });

          if (bidInsertError) {
            console.error("Failed to save bid to database:", bidInsertError);
            // Don't throw here since the on-chain transaction succeeded
            // The bid is recorded on-chain even if database fails
          } else {
            console.log("Bid saved to database successfully");
          }

          // Mark previous bids as not winning (only if current bid was saved)
          if (!bidInsertError) {
            const { error: updateError } = await supabase
              .from("bids")
              .update({ is_winning: false })
              .eq("auction_id", auctionId)
              .neq("transaction_hash", result);

            if (updateError) {
              console.error("Failed to update previous bids:", updateError);
            }

            // Update auction's current_bid to match the new highest bid
            const { error: auctionUpdateError } = await supabase
              .from("auctions")
              .update({
                current_bid: parseFloat(bidAmount),
                updated_at: new Date().toISOString(),
              })
              .eq("id", auctionId);

            if (auctionUpdateError) {
              console.error(
                "Failed to update auction current_bid:",
                auctionUpdateError,
              );
            } else {
              console.log("Auction current_bid updated to:", bidAmount);
            }
          }

          setIsProcessing(false);
          return result;
        } catch (bidError: any) {
          console.error("Failed to place bid:", bidError);
          if (bidError.message?.includes("timeout")) {
            throw new Error(
              "Bid transaction timed out. Please try again or check your transaction in your wallet.",
            );
          }
          throw bidError;
        }
      } catch (error: any) {
        console.error("Bidding process failed:", error);
        setIsProcessing(false);
        if (error.message?.includes("timeout")) {
          throw new Error(
            "Request timed out. This might be due to network congestion. Please try again.",
          );
        }
        throw error;
      }
    },
    [contractAddress, writeContractAsync, supabase, user],
  );

  // Settle auction on-chain
  const settleAuction = useCallback(
    async (onChainAuctionId: number) => {
      if (!contractAddress) {
        throw new Error("Contract not deployed on this network");
      }

      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "settleAuction",
        args: [BigInt(onChainAuctionId)],
      });

      return result;
    },
    [contractAddress, writeContractAsync],
  );

  // Cancel auction on-chain
  const cancelAuction = useCallback(
    async (onChainAuctionId: number) => {
      if (!contractAddress) {
        throw new Error("Contract not deployed on this network");
      }

      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "cancelAuction",
        args: [BigInt(onChainAuctionId)],
      });

      return result;
    },
    [contractAddress, writeContractAsync],
  );

  // Emergency cancel (admin only)
  const emergencyCancel = useCallback(
    async (onChainAuctionId: number) => {
      if (!contractAddress) {
        throw new Error("Contract not deployed on this network");
      }

      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "emergencyCancel",
        args: [BigInt(onChainAuctionId)],
      });

      return result;
    },
    [contractAddress, writeContractAsync],
  );

  // Withdraw funds
  const withdraw = useCallback(async () => {
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network");
    }

    const result = await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "withdraw",
    });

    return result;
  }, [contractAddress, writeContractAsync]);

  // Admin functions
  const setProtocolFee = useCallback(
    async (feePercentage: number) => {
      if (!contractAddress) {
        throw new Error("Contract not deployed on this network");
      }

      // Convert percentage to basis points (e.g., 2.5% = 250)
      const feeBasisPoints = Math.floor(feePercentage * 100);

      const result = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "setProtocolFee",
        args: [BigInt(feeBasisPoints)],
      });

      return result;
    },
    [contractAddress, writeContractAsync],
  );

  const pauseContract = useCallback(async () => {
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network");
    }

    const result = await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "pause",
    });

    return result;
  }, [contractAddress, writeContractAsync]);

  const unpauseContract = useCallback(async () => {
    if (!contractAddress) {
      throw new Error("Contract not deployed on this network");
    }

    const result = await writeContractAsync({
      address: contractAddress as `0x${string}`,
      abi: AUCTION_ABI,
      functionName: "unpause",
    });

    return result;
  }, [contractAddress, writeContractAsync]);

  // Enhanced contract read functions
  const getAuctionData = useCallback(
    async (auctionId: number | bigint) => {
      if (!contractAddress || !publicClient) return null;

      const auctionIdBigInt = BigInt(auctionId);

      try {
        // First, validate that auction exists by checking counter
        const auctionCounter = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctionCounter",
          args: [],
        });

        // Check if auction ID is valid (within counter range)
        if (auctionIdBigInt > auctionCounter || auctionIdBigInt <= 0n) {
          logger.warn("Invalid auction ID - outside counter range:", {
            auctionId: auctionIdBigInt.toString(),
            maxValidId: auctionCounter.toString()
          });
          return null;
        }

        // COMPATIBILITY FIX: Use auctions mapping directly with boolean error handling
        const data = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctions",
          args: [auctionIdBigInt],
        });

        // Validate data structure from auctions mapping
        if (!Array.isArray(data) || data.length < 6) {
          logger.error("Invalid auction data structure from auctions mapping", {
            auctionId: auctionIdBigInt.toString(),
            dataLength: Array.isArray(data) ? data.length : 'not array'
          });
          return null;
        }

        // Extract the fields we can safely read
        const [seller, highestBidder, highestBid, minIncrement, endTime, createdAt] = data;
        
        // Return a compatible format (without the problematic boolean fields)
        return {
          seller,
          highestBidder,
          highestBid,
          minIncrement,
          endTime,
          createdAt,
          // Default values for fields we can't read reliably due to ABI issues
          settled: false, // Assume not settled if we can read data
          timeExtensions: 0,
          offchainId: data[8] || '', // Try to get string if available
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Handle specific boolean decoding errors
        if (errorMessage.includes("is not a valid boolean") || errorMessage.includes("bytes array must contain")) {
          logger.warn("Boolean decoding error in auction data - auction may not exist or have corrupted data:", {
            auctionId: auctionIdBigInt.toString(),
            errorMessage
          });
          return null;
        }
        
        logger.error("Failed to read auction data:", {
          auctionId: auctionIdBigInt.toString(),
          errorMessage
        });
        return null;
      }
    },
    [contractAddress, publicClient],
  );

  const getMinimumBid = useCallback(
    async (auctionId: number | bigint) => {
      if (!contractAddress || !publicClient) {
        logger.warn("getMinimumBid: Missing contractAddress or publicClient");
        return null;
      }

      const auctionIdBigInt = BigInt(auctionId);
      
      return await safeContractCall(
        async () => {
          // First, validate that auction exists by checking counter
          const auctionCounter = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: AUCTION_ABI,
            functionName: "auctionCounter",
            args: [],
          });

          // Check if auction ID is valid (within counter range)
          if (auctionIdBigInt > auctionCounter || auctionIdBigInt <= 0n) {
            logger.warn("Invalid auction ID - outside counter range:", {
              auctionId: auctionIdBigInt.toString(),
              maxValidId: auctionCounter.toString()
            });
            throw new Error(`Invalid auction ID ${auctionIdBigInt.toString()}`);
          }

          // Try to read auction data with safer approach
          try {
            const auctionData = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: AUCTION_ABI,
              functionName: "auctions",
              args: [auctionIdBigInt],
            });
            
            // If we can read the data without boolean decoding errors, proceed
            if (Array.isArray(auctionData) && auctionData.length >= 4) {
              const [, , highestBid, minIncrement] = auctionData;
              
              // If no bids yet, return minIncrement
              if (Number(highestBid) === 0) {
                return minIncrement;
              }
              
              // Calculate 5% increment (matching contract logic)
              const increment = (BigInt(highestBid) * BigInt(5)) / BigInt(100);
              return BigInt(highestBid) + increment;
            }
          } catch (decodingError) {
            const decodingErrorMessage = decodingError instanceof Error ? decodingError.message : String(decodingError);
            
            // If boolean decoding fails, use fallback approach
            if (decodingErrorMessage.includes("is not a valid boolean") || 
                decodingErrorMessage.includes("bytes array must contain")) {
              logger.warn("ABI decoding failed, using fallback for minimum bid:", {
                auctionId: auctionIdBigInt.toString(),
                errorMessage: decodingErrorMessage,
                originalError: decodingError instanceof Error ? decodingError : undefined
              });
              
              // Return a reasonable default minimum bid (0.01 ETH)
              return BigInt("10000000000000000"); // 0.01 ETH in wei
            }
            
            // Re-throw other errors to be caught by safeContractCall
            throw decodingError;
          }
          
          throw new Error(`Could not calculate minimum bid for auction ${auctionIdBigInt.toString()}`);
        },
        BigInt("10000000000000000"), // Default fallback: 0.01 ETH in wei
        `getMinimumBid for auction ${auctionIdBigInt.toString()}`
      );
    },
    [contractAddress, publicClient],
  );

  const canExtendTime = useCallback(
    async (auctionId: number | bigint) => {
      if (!contractAddress || !publicClient) return false;

      try {
        const canExtend = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "canExtendTime",
          args: [BigInt(auctionId)],
        });
        return canExtend;
      } catch (error) {
        console.error("Failed to check time extension:", error);
        return false;
      }
    },
    [contractAddress, publicClient],
  );

  const canSettlePublicly = useCallback(
    async (auctionId: number | bigint) => {
      if (!contractAddress || !publicClient) return false;

      try {
        const canSettle = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "canSettlePublicly",
          args: [BigInt(auctionId)],
        });
        return canSettle;
      } catch (error) {
        console.error("Failed to check settlement eligibility:", error);
        return false;
      }
    },
    [contractAddress, publicClient],
  );

  const getTotalValueLocked = useCallback(async () => {
    if (!contractAddress || !publicClient) return null;

    try {
      const tvl = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "getTotalValueLocked",
        args: [],
      });
      return tvl;
    } catch (error) {
      console.error("Failed to read total value locked:", error);
      return null;
    }
  }, [contractAddress, publicClient]);

  const isContractPaused = useCallback(async () => {
    if (!contractAddress || !publicClient) {
      logger.warn("isContractPaused: Missing contractAddress or publicClient");
      return false;
    }

    const pausedResult = await safeContractCall(
      async () => {
        // COMPATIBILITY FIX: paused() function may not exist on deployed contract
        // Try the standard paused() function first
        try {
          const paused = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: AUCTION_ABI,
            functionName: "paused",
            args: [],
          });
          return paused as boolean;
        } catch (pausedError) {
          const errorMessage = pausedError instanceof Error ? pausedError.message : String(pausedError);
          
          // If function doesn't exist, contract is not paused (fallback assumption)
          if (errorMessage.includes("function does not exist") || 
              errorMessage.includes("method does not exist") ||
              errorMessage.includes("execution reverted")) {
            logger.info("paused() function not available, assuming contract is not paused", {
              errorMessage
            });
            return false;
          }
          
          // Re-throw unexpected errors
          throw pausedError;
        }
      },
      false, // Default fallback: assume not paused
      "isContractPaused"
    );

    return pausedResult ?? false;
  }, [contractAddress, publicClient]);

  /**
   * Enhanced Auction ID Validation Chain with Circuit Breaker Protection
   * Implements multi-step validation with fallback mechanisms
   */
  const validateAndRecoverAuctionId = useCallback(
    async (
      databaseAuctionId: string,
      currentOnChainId: number | undefined,
      auctionData: any
    ): Promise<number> => {
      const contractReadCircuit = getAuctionCircuitBreaker('CONTRACT_READ');
      const databaseCircuit = getAuctionCircuitBreaker('DATABASE_OPERATIONS');
      
      logger.info("Starting enhanced auction ID validation chain", {
        databaseAuctionId,
        currentOnChainId,
        hasAuctionData: !!auctionData,
        circuitStates: {
          contractRead: contractReadCircuit.getStats().state,
          database: databaseCircuit.getStats().state
        }
      });

      // Step 1: Validate existing on-chain ID if provided
      if (currentOnChainId !== undefined && currentOnChainId !== null) {
        try {
          const validatedId = await contractReadCircuit.execute(async () => {
            return await validateExistingAuctionId(currentOnChainId, auctionData);
          });
          
          if (validatedId !== null) {
            logger.info("Existing auction ID validated successfully", {
              auctionId: validatedId,
              databaseAuctionId
            });
            return validatedId;
          }
        } catch (error) {
          logger.warn("Existing auction ID validation failed, proceeding to recovery", {
            currentOnChainId,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      // Step 2: Attempt to recover from database
      if (auctionData?.on_chain_auction_id) {
        try {
          const recoveredId = await contractReadCircuit.execute(async () => {
            return await validateExistingAuctionId(auctionData.on_chain_auction_id, auctionData);
          });
          
          if (recoveredId !== null) {
            logger.info("Auction ID recovered from database", {
              recoveredId,
              databaseAuctionId
            });
            return recoveredId;
          }
        } catch (error) {
          logger.warn("Database recovery failed, attempting emergency creation", {
            storedId: auctionData.on_chain_auction_id,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      // Step 3: Emergency auction creation using distributed transaction manager
      logger.info("Initiating emergency auction creation", { databaseAuctionId });
      const emergencyResult = await emergencyCreateAuction(databaseAuctionId, auctionData);
      
      if (emergencyResult.success && emergencyResult.result) {
        logger.info("Emergency auction creation successful", {
          newAuctionId: emergencyResult.result,
          databaseAuctionId
        });
        return emergencyResult.result;
      }

      // Step 4: Final fallback - generate sequential ID based on contract counter
      logger.warn("All validation methods failed, using sequential fallback ID generation", {
        databaseAuctionId,
        emergencyError: emergencyResult.error?.message
      });
      
      try {
        const fallbackId = await generateFallbackAuctionId(databaseAuctionId);
        
        // Validate the fallback ID is within reasonable range
        if (!publicClient || !contractAddress) {
          return fallbackId;
        }
        
        const counter = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctionCounter",
          args: [],
        });
        
        const currentCounter = Number(counter);
        
        // Ensure fallback ID is within valid range (1 to counter+1)
        if (fallbackId < 1 || fallbackId > currentCounter + 1) {
          logger.error("Generated fallback ID is outside valid range", {
            fallbackId,
            currentCounter,
            validRange: `1-${currentCounter + 1}`
          });
          // Return next sequential ID as final fallback
          return currentCounter + 1;
        }
        
        return fallbackId;
      } catch (fallbackError) {
        logger.error("Fallback ID generation failed", {
          databaseAuctionId,
          error: fallbackError
        });
        throw new Error(`Critical: Cannot generate valid auction ID for ${databaseAuctionId}`);
      }
    },
    [contractAddress, publicClient, supabase, writeContractAsync, transactionManager]
  );

  /**
   * Validate an existing auction ID against contract state
   */
  const validateExistingAuctionId = useCallback(
    async (auctionId: number, auctionData: any): Promise<number | null> => {
      if (!publicClient || !contractAddress) {
        throw new Error("PublicClient or contract address not available");
      }

      try {
        // Get blockchain time for accurate validation
        const blockchainTimeResult = await getBlockchainTime(publicClient);
        
        // Read auction data from contract with timeout protection
        const contractAuctionData = await withTimeout(
          publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: AUCTION_ABI,
            functionName: "auctions",
            args: [BigInt(auctionId)],
          }),
          5000 // 5 second timeout
        );

        // Validate auction data structure
        if (!Array.isArray(contractAuctionData) || contractAuctionData.length < 4) {
          logger.warn("Invalid auction data structure from contract", {
            auctionId,
            dataLength: Array.isArray(contractAuctionData) ? contractAuctionData.length : 'not array'
          });
          return null;
        }

        // Extract and validate auction timing
        const [seller, highestBidder, highestBid, minIncrement, endTime] = contractAuctionData;
        const onChainEndTime = Number(endTime);
        
        // Check if auction is still active using blockchain time
        const bidValidation = canAcceptBids(onChainEndTime, blockchainTimeResult);
        
        if (!bidValidation.canBid) {
          logger.info("Auction has ended, cannot use this ID", {
            auctionId,
            onChainEndTime,
            currentTime: blockchainTimeResult.timestamp,
            reason: bidValidation.reason
          });
          return null;
        }

        // Additional validation: check if seller is zero address (uninitialized auction)
        if (seller === "0x0000000000000000000000000000000000000000") {
          logger.warn("Auction appears to be uninitialized (zero seller address)", { auctionId });
          return null;
        }

        logger.info("Auction ID validation successful", {
          auctionId,
          onChainEndTime,
          currentTime: blockchainTimeResult.timestamp,
          timeRemaining: bidValidation.timeRemaining,
          highestBid: highestBid.toString()
        });
        
        return auctionId;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Handle specific error types
        if (errorMessage.includes('execution reverted') || 
            errorMessage.includes('invalid argument') ||
            errorMessage.includes('is not a valid boolean')) {
          logger.warn("Auction does not exist on contract or has invalid data", {
            auctionId,
            errorMessage
          });
          return null;
        }
        
        // Re-throw other errors for circuit breaker handling
        throw error;
      }
    },
    [publicClient, contractAddress]
  );

  /**
   * Emergency auction creation with distributed transaction management
   */
  const emergencyCreateAuction = useCallback(
    async (databaseAuctionId: string, auctionData: any): Promise<TransactionResult<number>> => {
      if (!contractAddress || !publicClient || !user) {
        return {
          success: false,
          error: new Error("Missing required dependencies for emergency creation"),
          executedSteps: [],
          compensatedSteps: []
        };
      }

      logger.info("Starting emergency auction creation transaction", {
        databaseAuctionId,
        hasAuctionData: !!auctionData
      });

      // Prepare contract operation for distributed transaction
      const contractOperation = async (): Promise<number> => {
        // Calculate duration with safety buffer
        const blockchainTimeResult = await getBlockchainTime(publicClient);
        const currentBlockchainTime = blockchainTimeResult.timestamp;
        
        const endTime = Math.floor(new Date(auctionData.end_time).getTime() / 1000);
        const remainingSeconds = endTime - currentBlockchainTime;

        // Check if auction can still accept bids
        const bidValidation = canAcceptBids(endTime, blockchainTimeResult);
        if (!bidValidation.canBid) {
          throw new Error(`Cannot create auction - ${bidValidation.reason}`);
        }

        // Ensure minimum duration with buffer
        const minDurationWithBuffer = 3600 + AUCTION_SAFETY_BUFFER_SECONDS;
        const duration = Math.max(remainingSeconds, minDurationWithBuffer);
        
        logger.info("Creating emergency auction on-chain", {
          databaseAuctionId,
          duration,
          endTime,
          currentBlockchainTime,
          remainingSeconds
        });

        // Create auction on-chain
        const createTxHash = await writeContractAsync({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "createAuction",
          args: [
            databaseAuctionId, // offchain ID
            parseEther(auctionData.starting_bid?.toString() || "0.01"),
            BigInt(duration),
          ],
        });

        logger.info("Emergency auction created, reading counter", { createTxHash });

        // Read the auction counter to get the actual auction ID
        const counter = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctionCounter",
          args: [], // Add empty args to satisfy TypeScript
        });
        
        // The counter is incremented after creation, so the auction ID is the current counter value
        const newAuctionId = Number(counter);
        
        // Validate the ID is reasonable (should be greater than 0)
        if (newAuctionId <= 0) {
          throw new Error(`Invalid auction ID generated: ${newAuctionId}`);
        }
        
        logger.info("Emergency auction ID determined", {
          newAuctionId,
          counter: Number(counter),
          createTxHash,
          validation: "ID is within valid range"
        });
        
        return newAuctionId;
      };

      // Execute atomic transaction
      return await transactionManager.createAuctionAtomically({
        auctionId: databaseAuctionId,
        auctionData: {
          ...auctionData,
          on_chain_auction_id: null, // Will be set after creation
        },
        contractAddress,
        contractOperation,
        userId: user.id,
      });
    },
    [contractAddress, publicClient, writeContractAsync, user, transactionManager]
  );

  /**
   * Get next valid auction ID from contract counter
   */
  const getNextValidAuctionId = useCallback(
    async (): Promise<number> => {
      if (!publicClient || !contractAddress) {
        throw new Error("PublicClient or contract address not available for getting next auction ID");
      }

      try {
        const counter = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctionCounter",
          args: [],
        });
        
        const nextId = Number(counter) + 1;
        
        logger.info("Retrieved next valid auction ID", {
          currentCounter: Number(counter),
          nextValidId: nextId
        });
        
        return nextId;
      } catch (error) {
        logger.error("Failed to get next valid auction ID", { error });
        throw new Error(`Failed to read contract counter: ${error}`);
      }
    },
    [publicClient, contractAddress]
  );

  /**
   * Generate a sequential fallback auction ID based on contract counter
   */
  const generateFallbackAuctionId = useCallback(
    async (databaseAuctionId: string): Promise<number> => {
      if (!publicClient || !contractAddress) {
        logger.error("Cannot generate fallback ID without contract connection");
        throw new Error("PublicClient or contract address not available");
      }

      try {
        // Read current contract counter
        const counter = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "auctionCounter",
          args: [],
        });
        
        const currentCounter = Number(counter);
        
        // Generate ID within valid range (1 to counter)
        // If counter is 12, valid range is 1-12
        // For new auctions, we should use counter + 1
        const fallbackId = currentCounter + 1;
        
        logger.warn("Using sequential fallback auction ID generation", {
          databaseAuctionId,
          currentCounter,
          fallbackId,
          validRange: `1-${currentCounter + 1}`
        });
        
        return fallbackId;
      } catch (error) {
        logger.error("Failed to generate fallback auction ID", { 
          databaseAuctionId, 
          error 
        });
        throw new Error(`Cannot generate valid auction ID: ${error}`);
      }
    },
    [publicClient, contractAddress]
  );

  /**
   * Helper to get auction data from database with circuit breaker protection
   */
  const getAuctionFromDatabase = useCallback(
    async (auctionId: string): Promise<any> => {
      const databaseCircuit = getAuctionCircuitBreaker('DATABASE_OPERATIONS');
      
      return await databaseCircuit.execute(
        async () => {
          const { data, error } = await supabase
            .from("auctions")
            .select("*, on_chain_auction_id")
            .eq("id", auctionId)
            .single();
            
          if (error) throw error;
          if (!data) throw new Error("Auction not found in database");
          
          return data;
        },
        async () => {
          logger.warn("Using fallback auction data");
          return {
            id: auctionId,
            starting_bid: 0.01,
            end_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
            on_chain_auction_id: null
          };
        }
      );
    },
    [supabase]
  );

  return {
    // Core auction functions
    placeBidOnChain,
    settleAuction,
    cancelAuction,
    emergencyCancel,
    withdraw,

    // View functions
    getAuctionData,
    getMinimumBid,
    canExtendTime,
    canSettlePublicly,
    getTotalValueLocked,
    isContractPaused,

    // Admin functions
    setProtocolFee,
    pauseContract,
    unpauseContract,

    // Enhanced validation functions
    validateAndRecoverAuctionId,
    emergencyCreateAuction,
    getAuctionFromDatabase,
    getNextValidAuctionId,

    // Transaction state
    isProcessing: isProcessing || isWritePending || isConfirming,
    isConfirmed,
    error: writeError,
    txHash,

    // Contract info
    contractAddress,
  };
}
