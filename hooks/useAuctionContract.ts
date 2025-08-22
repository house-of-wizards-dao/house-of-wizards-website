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

export function useAuctionContract() {
  const { address, chainId } = useAccount();
  const supabase = useSupabaseClient();
  const user = useUser();
  const publicClient = usePublicClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const contractAddress = chainId ? getContractAddress(chainId) : undefined;

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

        if (auctionIdToUse === undefined) {
          // Get auction details from database
          const { data: auction } = await supabase
            .from("auctions")
            .select("*, on_chain_auction_id")
            .eq("id", auctionId)
            .single();

          if (!auction) throw new Error("Auction not found");

          // Check if we already have an on-chain auction ID stored
          if (auction.on_chain_auction_id !== null) {
            auctionIdToUse = auction.on_chain_auction_id;
            logger.info("Using existing on-chain auction ID", { 
              auctionIdToUse, 
              auctionId 
            });
          } else {
            // We need to create a new on-chain auction
            logger.info("No existing on-chain auction found - will create new one", { 
              auctionId 
            });

            // Calculate remaining duration (ensure minimum 1 hour)
            const now = Date.now();
            const endTime = new Date(auction.end_time).getTime();
            const remainingSeconds = Math.floor((endTime - now) / 1000);

            if (remainingSeconds <= 0) {
              throw new Error("This auction has already ended");
            }

            // Ensure minimum 1 hour duration
            const duration = Math.max(remainingSeconds, 3600); // At least 1 hour

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

        // Ensure auctionIdToUse is valid before proceeding
        if (auctionIdToUse === undefined || auctionIdToUse === null) {
          throw new Error(
            "Failed to determine auction ID for on-chain operations",
          );
        }

        // Check auction status before bidding
        if (publicClient && contractAddress) {
          try {
            const auctionData = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: AUCTION_ABI,
              functionName: "getAuction",
              args: [BigInt(auctionIdToUse)],
            });
            console.log("Auction data from contract:", auctionData);

            // Validate auction data structure
            if (!Array.isArray(auctionData) || auctionData.length < 8) {
              throw new Error(
                "Invalid auction data structure returned from contract - possible ABI mismatch",
              );
            }

            // Check if auction has ended
            const endTime = Number(auctionData[3]); // endTime is the 4th element (index 3)
            if (isNaN(endTime) || endTime <= 0) {
              throw new Error(
                "Invalid endTime value from contract - possible ABI mismatch",
              );
            }

            const now = Math.floor(Date.now() / 1000);
            if (endTime <= now) {
              throw new Error(
                `Auction ${auctionIdToUse} has ended. End time: ${endTime}, Current time: ${now}`,
              );
            }
          } catch (readError: any) {
            console.error("Failed to read auction data:", readError);
            // Only throw if it's specifically about auction being ended
            if (readError.message?.includes("ended")) {
              throw readError;
            }
            // For other errors (like ABI issues), log but continue with bidding
            // since the auction was just created successfully
            console.warn(
              "Continuing with bid despite read error - auction just created",
            );
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

      try {
        const data = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "getAuction",
          args: [BigInt(auctionId)],
        });

        // Validate data structure
        if (!Array.isArray(data) || data.length < 9) {
          console.error(
            "Invalid auction data structure - possible ABI mismatch",
          );
          return null;
        }

        return data;
      } catch (error) {
        console.error("Failed to read auction data:", error);
        return null;
      }
    },
    [contractAddress, publicClient],
  );

  const getMinimumBid = useCallback(
    async (auctionId: number | bigint) => {
      if (!contractAddress || !publicClient) return null;

      try {
        const minBid = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi: AUCTION_ABI,
          functionName: "getMinimumBid",
          args: [BigInt(auctionId)],
        });
        return minBid;
      } catch (error) {
        console.error("Failed to read minimum bid:", error);
        return null;
      }
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
      });
      return tvl;
    } catch (error) {
      console.error("Failed to read total value locked:", error);
      return null;
    }
  }, [contractAddress, publicClient]);

  const isContractPaused = useCallback(async () => {
    if (!contractAddress || !publicClient) return false;

    try {
      const paused = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: AUCTION_ABI,
        functionName: "paused",
      });
      return paused;
    } catch (error) {
      console.error("Failed to check pause status:", error);
      return false;
    }
  }, [contractAddress, publicClient]);

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

    // Transaction state
    isProcessing: isProcessing || isWritePending || isConfirming,
    isConfirmed,
    error: writeError,
    txHash,

    // Contract info
    contractAddress,
  };
}
