// Service to fetch bid history from smart contract events
import { formatEther, decodeEventLog } from "viem";
import {
  AUCTION_CONTRACT_ADDRESS,
  AUCTION_CONTRACT_ABI,
} from "@/lib/auction-contract";
import {
  getRpcClient,
  readContractWithRetry,
  getLogsWithRetry,
  getBlockWithRetry,
} from "@/lib/rpc-client";
import type { Bid } from "@/types";

// UpdatedBid event signature hash for filtering
// UpdatedBid(uint256,uint256,address) -> keccak256("UpdatedBid(uint256,uint256,address)")
const UPDATED_BID_EVENT_HASH =
  "0x2f2317489eb3b025da5521ea9c4a7bd075188f0b72c209b7d7a29ff80e7b6220";

export class BidHistoryService {
  /**
   * Fetch bid history for a specific auction from blockchain events
   */
  static async getBidHistory(auctionIndex: number): Promise<Bid[]> {
    try {
      console.log(`🔍 Fetching bid history for auction ${auctionIndex}...`);
      console.log(`📡 Contract address: ${AUCTION_CONTRACT_ADDRESS}`);

      // Try multiple methods to get bid history
      let bids: Bid[] = [];

      // Method 1: Get events using event signature filtering
      try {
        console.log(
          `🔎 Method 1: Searching for UpdatedBid events using topic filtering...`,
        );
        bids = await this.getBidHistoryFromEvents(auctionIndex);
        if (bids.length > 0) {
          console.log(
            `✅ Method 1 successful: Found ${bids.length} bids from events`,
          );
          return bids;
        }
      } catch (eventError) {
        console.warn("⚠️ Method 1 (events) failed:", eventError);
      }

      // Method 2: Get events using standard event definition
      try {
        console.log(
          `🔎 Method 2: Searching for UpdatedBid events using standard definition...`,
        );
        bids = await this.getBidHistoryFromEventsStandard(auctionIndex);
        if (bids.length > 0) {
          console.log(
            `✅ Method 2 successful: Found ${bids.length} bids from events`,
          );
          return bids;
        }
      } catch (eventError) {
        console.warn("⚠️ Method 2 (standard events) failed:", eventError);
      }

      // Method 3: Fallback to contract state
      console.log(`🔎 Method 3: Fallback to reading current auction state...`);
      return await this.getBidHistoryFromContractState(auctionIndex);
    } catch (error) {
      console.error("❌ All methods failed to fetch bid history:", error);
      return [];
    }
  }

  /**
   * Method 1: Get bid history using topic-based event filtering
   */
  private static async getBidHistoryFromEvents(
    auctionIndex: number,
  ): Promise<Bid[]> {
    const publicClient = getRpcClient();

    const logs = await getLogsWithRetry(
      () =>
        (publicClient as any).getLogs({
          address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
          topics: [UPDATED_BID_EVENT_HASH], // Use the event signature hash directly
          fromBlock: "earliest",
          toBlock: "latest",
        }),
      `UpdatedBid events for auction ${auctionIndex}`,
    );

    console.log(
      `📊 Found ${(logs as any)?.length || 0} UpdatedBid events using topic filtering`,
    );

    const bids: Bid[] = [];
    const logsArray = (logs as any[]) || [];

    for (let i = 0; i < logsArray.length; i++) {
      const log = logsArray[i];

      try {
        // Try to decode the event - skip if it's not an UpdatedBid event
        let decoded;
        try {
          decoded = decodeEventLog({
            abi: AUCTION_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
          });
        } catch (decodeErr) {
          // Skip events that don't match our ABI (might be other events)
          continue;
        }

        // Check if this is an UpdatedBid event and extract args
        if (decoded.eventName === "UpdatedBid" && decoded.args) {
          const eventAuctionIndex = Number(decoded.args._auctionIndex);
          console.log(
            `📝 Event ${i}: auction ${eventAuctionIndex} (looking for ${auctionIndex}), amount: ${formatEther(decoded.args._newOffer as bigint)} ETH`,
          );

          // Only include bids for our specific auction
          if (eventAuctionIndex === auctionIndex) {
            // Get block timestamp for accurate timing
            let blockTime = new Date().toISOString();
            try {
              const block = await getBlockWithRetry(
                () => publicClient.getBlock({ blockNumber: log.blockNumber }),
                `block ${log.blockNumber} timestamp`,
              );
              blockTime = new Date(
                Number(block.timestamp) * 1000,
              ).toISOString();
            } catch (blockError) {
              console.warn("Failed to get block timestamp:", blockError);
            }

            const bid: Bid = {
              id: `bid-${log.transactionHash}-${log.logIndex}`,
              auction_id: `contract-auction-${auctionIndex}`,
              bidder_address: decoded.args._bidderAddress as string,
              amount: (decoded.args._newOffer as bigint).toString(),
              transaction_hash: log.transactionHash || "0x",
              created_at: blockTime,
              is_winning: false, // Will be set later when we sort
            };

            bids.push(bid);
            console.log(
              `✅ Found bid: ${formatEther(decoded.args._newOffer as bigint)} ETH from ${bid.bidder_address.slice(0, 6)}...${bid.bidder_address.slice(-4)}`,
            );
          }
        }
      } catch (decodeError) {
        console.warn(`Failed to decode log ${i}:`, decodeError);
      }
    }

    return this.processBids(bids, auctionIndex);
  }

  /**
   * Method 2: Get bid history using standard event definition
   */
  private static async getBidHistoryFromEventsStandard(
    auctionIndex: number,
  ): Promise<Bid[]> {
    const publicClient = getRpcClient();

    const logs = await getLogsWithRetry(
      () =>
        publicClient.getLogs({
          address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
          event: {
            type: "event",
            name: "UpdatedBid",
            inputs: [
              { name: "_auctionIndex", type: "uint256", indexed: false },
              { name: "_newOffer", type: "uint256", indexed: false },
              { name: "_bidderAddress", type: "address", indexed: false },
            ],
          },
          fromBlock: "earliest",
          toBlock: "latest",
        }),
      `UpdatedBid events (standard) for auction ${auctionIndex}`,
    );

    console.log(
      `📊 Found ${logs.length} total bid events using standard definition`,
    );

    const bids: Bid[] = [];

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      try {
        // Decode the log data
        const decoded = decodeEventLog({
          abi: AUCTION_CONTRACT_ABI,
          data: log.data,
          topics: log.topics,
          eventName: "UpdatedBid",
        });

        const eventAuctionIndex = Number(decoded.args._auctionIndex);
        console.log(
          `📝 Event ${i}: auction ${eventAuctionIndex} (looking for ${auctionIndex}), amount: ${formatEther(decoded.args._newOffer as bigint)} ETH`,
        );

        // Only include bids for our specific auction
        if (eventAuctionIndex === auctionIndex) {
          // Get block timestamp for accurate timing
          let blockTime = new Date().toISOString();
          try {
            const block = await getBlockWithRetry(
              () => publicClient.getBlock({ blockNumber: log.blockNumber }),
              `block ${log.blockNumber} timestamp`,
            );
            blockTime = new Date(Number(block.timestamp) * 1000).toISOString();
          } catch (blockError) {
            console.warn("Failed to get block timestamp:", blockError);
          }

          const bid: Bid = {
            id: `bid-${log.transactionHash}-${log.logIndex}`,
            auction_id: `contract-auction-${auctionIndex}`,
            bidder_address: decoded.args._bidderAddress as string,
            amount: (decoded.args._newOffer as bigint).toString(),
            transaction_hash: log.transactionHash || "0x",
            created_at: blockTime,
            is_winning: false, // Will be set later when we sort
          };

          bids.push(bid);
          console.log(
            `✅ Found bid: ${formatEther(decoded.args._newOffer as bigint)} ETH from ${bid.bidder_address.slice(0, 6)}...${bid.bidder_address.slice(-4)}`,
          );
        }
      } catch (decodeError) {
        console.warn(`Failed to decode log ${i}:`, decodeError);
      }
    }

    return this.processBids(bids, auctionIndex);
  }

  /**
   * Method 3: Get bid history from current contract state as fallback
   */
  private static async getBidHistoryFromContractState(
    auctionIndex: number,
  ): Promise<Bid[]> {
    try {
      console.log(
        `📊 Reading auction state for auction ${auctionIndex} as fallback...`,
      );
      const auctionState = await this.getAuctionState(auctionIndex);

      if (
        auctionState &&
        auctionState.bidder !== "0x0000000000000000000000000000000000000000" &&
        auctionState.bidCount > 0
      ) {
        console.log(
          `✅ Found current bid from contract state: ${formatEther(auctionState.currentPrice)} ETH`,
        );
        const currentBid: Bid = {
          id: `current-bid-${auctionIndex}`,
          auction_id: `contract-auction-${auctionIndex}`,
          bidder_address: auctionState.bidder,
          amount: auctionState.currentPrice.toString(),
          transaction_hash: "Direct from contract",
          created_at: new Date().toISOString(),
          is_winning: true,
        };
        return [currentBid];
      } else {
        console.log(
          `📭 No bids found in auction ${auctionIndex} (bidCount: ${auctionState?.bidCount || 0})`,
        );
        return [];
      }
    } catch (stateError) {
      console.error("Failed to read auction state:", stateError);
      return [];
    }
  }

  /**
   * Process and sort bids for display
   */
  private static processBids(bids: Bid[], auctionIndex: number): Bid[] {
    if (bids.length === 0) return bids;

    // Sort by block number and log index for chronological order
    bids.sort((a, b) => {
      // If we have transaction hashes, we can't easily sort by block time here
      // So we'll sort by amount (highest first) which is what users expect to see
      return Number(BigInt(b.amount) - BigInt(a.amount));
    });

    // Update is_winning status - highest bid wins
    if (bids.length > 0) {
      const highestAmount = bids[0].amount;
      bids.forEach((bid) => {
        bid.is_winning = bid.amount === highestAmount;
      });
    }

    console.log(`🎉 Processed ${bids.length} bids for auction ${auctionIndex}`);
    return bids;
  }

  /**
   * Get the latest auction state including bid count
   */
  static async getAuctionState(auctionIndex: number) {
    try {
      console.log(`📊 Reading auction state for auction ${auctionIndex}...`);
      const publicClient = getRpcClient();

      const auctionStruct = (await readContractWithRetry(
        () =>
          publicClient.readContract({
            address: AUCTION_CONTRACT_ADDRESS as `0x${string}`,
            abi: AUCTION_CONTRACT_ABI,
            functionName: "auctions",
            args: [BigInt(auctionIndex)],
          }),
        `auction state for index ${auctionIndex}`,
      )) as [string, bigint, bigint, string, bigint, bigint, number];

      const state = {
        name: auctionStruct[0],
        initialPrice: auctionStruct[1],
        currentPrice: auctionStruct[2],
        bidder: auctionStruct[3],
        deadline: auctionStruct[4],
        bidCount: Number(auctionStruct[5]),
        status: auctionStruct[6],
      };

      console.log(`📊 Auction state:`, {
        name: state.name,
        bidCount: state.bidCount,
        currentPrice: formatEther(state.currentPrice),
        bidder: state.bidder,
      });

      return state;
    } catch (error) {
      console.error("Failed to get auction state:", error);
      return null;
    }
  }
}
