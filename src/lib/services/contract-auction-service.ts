// Real Smart Contract Auction Data Service
import { formatEther, Address } from "viem";
import {
  AUCTION_CONTRACT_ADDRESS,
  AUCTION_CONTRACT_ABI,
  AuctionStatus,
} from "@/lib/auction-contract";
import { getRpcClient, readContractWithRetry } from "@/lib/rpc-client";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
import type { Auction } from "@/types";

// Interface for raw contract auction data
interface RawAuctionData {
  name: string;
  initialPrice: bigint;
  currentPrice: bigint;
  bidder: Address;
  deadline: bigint;
  bidCount: bigint;
  status: number;
}

// Interface for contract auction details
interface RawAuctionDetails {
  currentWinner: Address;
  currentPrice: bigint;
  secondsRemaining: bigint;
  status: number;
}

// Service class for fetching auction data from smart contract
export class ContractAuctionService {
  /**
   * Get total number of auctions from smart contract
   */
  static async getTotalAuctions(): Promise<number> {
    try {
      console.log(
        `📊 Reading total auctions from contract ${AUCTION_CONTRACT_ADDRESS}...`,
      );
      const publicClient = getRpcClient();

      const result = (await readContractWithRetry(
        () =>
          publicClient.readContract({
            address: AUCTION_CONTRACT_ADDRESS,
            abi: AUCTION_CONTRACT_ABI,
            functionName: "getTotalAuctions",
          }),
        "total auctions count",
      )) as bigint;

      const totalAuctions = Number(result);
      console.log(`🎯 Found ${totalAuctions} total auctions`);
      return totalAuctions;
    } catch (error) {
      logger.error("Failed to get total auctions", {
        error: (error as Error).message,
        contractAddress: AUCTION_CONTRACT_ADDRESS,
      });
      return 0;
    }
  }

  /**
   * Get full auction struct data from smart contract
   */
  static async getAuctionStruct(
    auctionIndex: number,
  ): Promise<RawAuctionData | null> {
    try {
      console.log(`📊 Reading auction struct for index ${auctionIndex}...`);
      const publicClient = getRpcClient();

      const result = (await readContractWithRetry(
        () =>
          publicClient.readContract({
            address: AUCTION_CONTRACT_ADDRESS,
            abi: AUCTION_CONTRACT_ABI,
            functionName: "auctions",
            args: [BigInt(auctionIndex)],
          }),
        `auction struct for index ${auctionIndex}`,
      )) as [string, bigint, bigint, Address, bigint, bigint, number];

      const auctionData = {
        name: result[0],
        initialPrice: result[1],
        currentPrice: result[2],
        bidder: result[3],
        deadline: result[4],
        bidCount: result[5],
        status: result[6],
      };

      console.log(`✅ Auction ${auctionIndex} data:`, {
        name: auctionData.name,
        bidCount: Number(auctionData.bidCount),
        currentPrice: formatEther(auctionData.currentPrice),
        bidder:
          auctionData.bidder === "0x0000000000000000000000000000000000000000"
            ? "No bids"
            : `${auctionData.bidder.slice(0, 6)}...${auctionData.bidder.slice(-4)}`,
        status: auctionData.status,
      });

      return auctionData;
    } catch (error) {
      logger.error(`Failed to get auction struct for index ${auctionIndex}`, {
        error: (error as Error).message,
        contractAddress: AUCTION_CONTRACT_ADDRESS,
        auctionIndex,
      });
      return null;
    }
  }

  /**
   * Get auction details from smart contract
   */
  static async getAuctionDetails(
    auctionIndex: number,
  ): Promise<RawAuctionDetails | null> {
    try {
      const publicClient = getRpcClient();

      const result = (await readContractWithRetry(
        () =>
          publicClient.readContract({
            address: AUCTION_CONTRACT_ADDRESS,
            abi: AUCTION_CONTRACT_ABI,
            functionName: "getAuctionDetails",
            args: [BigInt(auctionIndex)],
          }),
        `auction details for index ${auctionIndex}`,
      )) as [Address, bigint, bigint, number];

      return {
        currentWinner: result[0],
        currentPrice: result[1],
        secondsRemaining: result[2],
        status: result[3],
      };
    } catch (error) {
      logger.error(`Failed to get auction details for index ${auctionIndex}`, {
        error: (error as Error).message,
        auctionIndex,
      });
      return null;
    }
  }

  /**
   * Get bid count for a specific auction
   */
  static async getBidCount(auctionIndex: number): Promise<number> {
    try {
      const publicClient = getRpcClient();

      const result = (await readContractWithRetry(
        () =>
          publicClient.readContract({
            address: AUCTION_CONTRACT_ADDRESS,
            abi: AUCTION_CONTRACT_ABI,
            functionName: "getBidCount",
            args: [BigInt(auctionIndex)],
          }),
        `bid count for auction ${auctionIndex}`,
      )) as bigint;

      return Number(result);
    } catch (error) {
      logger.error(`Failed to get bid count for index ${auctionIndex}`, {
        error: (error as Error).message,
        auctionIndex,
      });
      return 0;
    }
  }

  /**
   * Get auction metadata from database
   */
  static async getAuctionMetadata(auctionIndex: number) {
    try {
      const { data, error } = await supabase
        .from("contract_auction_metadata")
        .select("*")
        .eq("contract_auction_id", auctionIndex)
        .single();

      if (error) {
        logger.warn(`No metadata found for auction ${auctionIndex}`, {
          error: error.message,
          auctionIndex,
        });
        return null;
      }

      return data;
    } catch (error) {
      logger.error(`Failed to get metadata for auction ${auctionIndex}`, {
        error: (error as Error).message,
        auctionIndex,
      });
      return null;
    }
  }

  /**
   * Convert raw contract data to frontend Auction type
   */
  static async convertToAuction(
    auctionIndex: number,
    structData: RawAuctionData,
    detailsData: RawAuctionDetails,
  ): Promise<Auction> {
    const now = Math.floor(Date.now() / 1000);
    const deadline = Number(structData.deadline);
    const secondsRemaining = Number(detailsData.secondsRemaining);

    // Determine auction status
    let status: "upcoming" | "active" | "ended" | "cancelled" = "ended";

    if (structData.status === AuctionStatus.Open) {
      if (secondsRemaining > 0) {
        status = "active";
      } else {
        status = "ended";
      }
    } else {
      status = "ended";
    }

    // Use the higher of currentPrice or initialPrice
    const displayPrice =
      structData.currentPrice > 0n
        ? structData.currentPrice
        : structData.initialPrice;

    // Get metadata from database
    const metadata = await this.getAuctionMetadata(auctionIndex);

    // Use metadata if available, otherwise fallback to contract data
    const artworkUrl =
      metadata?.image_url ||
      `https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&h=800&fit=crop&sig=${auctionIndex}`;

    const description =
      metadata?.description ||
      `Blockchain auction created on smart contract. Bids: ${Number(structData.bidCount)}`;

    return {
      id: `contract-auction-${auctionIndex}`,
      artwork_id: `contract-artwork-${auctionIndex}`,
      title: structData.name,
      description: description,
      artwork_url: artworkUrl,
      artwork_metadata: {
        title: structData.name,
        medium: "Digital Art",
        dimensions: "Variable",
        year: "2024",
      },
      artist: {
        name: "House of Wizards DAO",
      },
      start_price: Number(structData.initialPrice),
      starting_bid: Number(structData.initialPrice),
      current_bid: Number(displayPrice),
      bid_increment: 10000000000000000, // 0.01 ETH in wei
      start_time: new Date((deadline - 7 * 24 * 60 * 60) * 1000).toISOString(), // Assume 7 day duration
      end_time: new Date(deadline * 1000).toISOString(),
      status,
      total_bids: Number(structData.bidCount),
      winner_id:
        structData.bidder !== "0x0000000000000000000000000000000000000000"
          ? structData.bidder
          : undefined,
      created_by: "contract-owner",
      featured: false,
      contract_address: AUCTION_CONTRACT_ADDRESS,
      token_id: `auction-${auctionIndex}`,
      created_at: new Date((deadline - 7 * 24 * 60 * 60) * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Fetch all auctions from smart contract
   */
  static async getAllAuctions(): Promise<Auction[]> {
    try {
      console.log("🔍 Fetching auctions from smart contract...");

      // Get total number of auctions
      const totalAuctions = await this.getTotalAuctions();
      console.log(`📊 Total auctions found: ${totalAuctions}`);

      if (totalAuctions === 0) {
        console.log("ℹ️ No auctions found on contract");
        return [];
      }

      const auctions: Auction[] = [];

      // Fetch data for each auction
      for (let i = 0; i < totalAuctions; i++) {
        try {
          console.log(`🔄 Fetching auction ${i}...`);

          // Get both struct and details data in parallel
          const [structData, detailsData] = await Promise.all([
            this.getAuctionStruct(i),
            this.getAuctionDetails(i),
          ]);

          if (structData && detailsData) {
            const auction = await this.convertToAuction(
              i,
              structData,
              detailsData,
            );
            auctions.push(auction);
            console.log(
              `✅ Auction ${i}: "${structData.name}" - ${auction.status}`,
            );
          } else {
            console.warn(`⚠️ Failed to get complete data for auction ${i}`);
          }
        } catch (error) {
          logger.error(`Error fetching auction ${i}`, {
            error: (error as Error).message,
            auctionIndex: i,
          });
          // Continue with other auctions even if one fails
        }
      }

      console.log(`🎉 Successfully fetched ${auctions.length} auctions`);
      return auctions;
    } catch (error) {
      logger.error("Failed to fetch auctions from contract", {
        error: (error as Error).message,
      });
      return [];
    }
  }

  /**
   * Fetch single auction by contract index
   */
  static async getAuctionByIndex(
    auctionIndex: number,
  ): Promise<Auction | null> {
    try {
      const [structData, detailsData] = await Promise.all([
        this.getAuctionStruct(auctionIndex),
        this.getAuctionDetails(auctionIndex),
      ]);

      if (structData && detailsData) {
        return await this.convertToAuction(
          auctionIndex,
          structData,
          detailsData,
        );
      }

      return null;
    } catch (error) {
      logger.error(`Failed to fetch auction ${auctionIndex}`, {
        error: (error as Error).message,
        auctionIndex,
      });
      return null;
    }
  }

  /**
   * Utility function to format time remaining
   */
  static formatTimeRemaining(seconds: bigint): string {
    const totalSeconds = Number(seconds);
    if (totalSeconds <= 0) return "Auction ended";

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  /**
   * Get contract stats
   */
  static async getContractStats() {
    try {
      const totalAuctions = await this.getTotalAuctions();
      const auctions = await this.getAllAuctions();

      const activeAuctions = auctions.filter(
        (a) => a.status === "active",
      ).length;
      const endedAuctions = auctions.filter((a) => a.status === "ended").length;

      // Calculate total volume
      let totalVolume = 0n;
      for (const auction of auctions) {
        if (auction.status === "ended" && auction.winner_id && auction.current_bid) {
          totalVolume += BigInt(auction.current_bid);
        }
      }

      return {
        totalAuctions,
        activeAuctions,
        endedAuctions,
        totalVolume: formatEther(totalVolume),
        contractAddress: AUCTION_CONTRACT_ADDRESS,
      };
    } catch (error) {
      logger.error("Failed to get contract stats", {
        error: (error as Error).message,
      });
      return {
        totalAuctions: 0,
        activeAuctions: 0,
        endedAuctions: 0,
        totalVolume: "0",
        contractAddress: AUCTION_CONTRACT_ADDRESS,
      };
    }
  }
}
