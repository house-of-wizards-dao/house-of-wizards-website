// Real Smart Contract Integration for Auction System
import { parseEther, formatEther, Address } from "viem";
import {
  useWriteContract,
  useReadContract,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import { getContractAddress } from "@/config/contract-config";

// Get contract address from configuration
export const AUCTION_CONTRACT_ADDRESS = getContractAddress();

// Real ABI for your auction contract
export const AUCTION_CONTRACT_ABI = [
  // Create new auction function
  {
    name: "createNewAuction",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_initialPrice", type: "uint256" },
      { name: "_durationInSeconds", type: "uint256" },
    ],
    outputs: [],
  },
  // Send new bid function
  {
    name: "sendNewBid",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "_auctionIndex", type: "uint256" }],
    outputs: [],
  },
  // Get auction details function
  {
    name: "getAuctionDetails",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [
      { name: "currentWinner", type: "address" },
      { name: "currentPrice", type: "uint256" },
      { name: "secondsRemaining", type: "uint256" },
      { name: "status", type: "uint8" }, // 0 = Open, 1 = Closed, 2 = Payed
    ],
  },
  // Get total auctions
  {
    name: "getTotalAuctions",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Get bid count
  {
    name: "getBidCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  // Close auction (owner only)
  {
    name: "closeAuction",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_id", type: "uint256" }],
    outputs: [],
  },
  // Withdraw (owner only)
  {
    name: "withdraw",
    type: "function",
    stateMutability: "payable",
    inputs: [{ name: "_auctionIndex", type: "uint256" }],
    outputs: [],
  },
  // Auctions array getter
  {
    name: "auctions",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "initialPrice", type: "uint256" },
      { name: "currentPrice", type: "uint256" },
      { name: "bidder", type: "address" },
      { name: "deadline", type: "uint256" },
      { name: "bidCount", type: "uint256" },
      { name: "status", type: "uint8" },
    ],
  },
  // Events
  {
    name: "CreateAuction",
    type: "event",
    anonymous: false,
    inputs: [
      { name: "_name", type: "string", indexed: false },
      { name: "_initialPrice", type: "uint256", indexed: false },
    ],
  },
  {
    name: "UpdatedBid",
    type: "event",
    anonymous: false,
    inputs: [
      { name: "_auctionIndex", type: "uint256", indexed: false },
      { name: "_newOffer", type: "uint256", indexed: false },
      { name: "_bidderAddress", type: "address", indexed: false },
    ],
  },
  {
    name: "UpdatedAuctionState",
    type: "event",
    anonymous: false,
    inputs: [
      { name: "_name", type: "string", indexed: false },
      { name: "_currentState", type: "uint8", indexed: false },
      { name: "_auctionIndex", type: "uint256", indexed: false },
    ],
  },
  {
    name: "AuctionWithdraw",
    type: "event",
    anonymous: false,
    inputs: [
      { name: "_auctionIndex", type: "uint256", indexed: false },
      { name: "_amount", type: "uint256", indexed: false },
      { name: "_bidderAddress", type: "address", indexed: false },
    ],
  },
] as const;

// Auction status enum
export enum AuctionStatus {
  Open = 0,
  Closed = 1,
  Payed = 2,
}

// Hook for placing bids on the auction contract
export function useAuctionBid() {
  const { address } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();

  const placeBid = async (auctionIndex: number, bidAmount: string) => {
    if (!address) throw new Error("Wallet not connected");

    const bidAmountWei = parseEther(bidAmount);

    try {
      console.log(
        `Sending bid transaction: ${bidAmount} ETH to auction ${auctionIndex}`,
      );

      // Real contract call - writeContract returns a hash directly
      const hash = await writeContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: "sendNewBid",
        args: [BigInt(auctionIndex)],
        value: bidAmountWei,
      });

      console.log("Transaction hash received:", hash);

      // Return the transaction hash
      return {
        hash: typeof hash === "string" ? hash : "pending",
        success: true,
      };
    } catch (err) {
      console.error("Bid placement failed:", err);
      throw err;
    }
  };

  return {
    placeBid,
    isPending,
    error,
  };
}

// Hook for creating auctions (owner only)
export function useCreateAuction() {
  const { writeContract, isPending, error } = useWriteContract();

  const createAuction = async (
    name: string,
    initialPrice: string,
    durationInSeconds: number,
  ) => {
    const initialPriceWei = parseEther(initialPrice);

    try {
      const result = await writeContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: "createNewAuction",
        args: [name, initialPriceWei, BigInt(durationInSeconds)],
      });

      return {
        hash: result,
        success: true,
      };
    } catch (err) {
      console.error("Auction creation failed:", err);
      throw err;
    }
  };

  return {
    createAuction,
    isPending,
    error,
  };
}

// Hook for reading auction data from contract
export function useAuctionData(auctionIndex: number) {
  const { data, isError, isLoading } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: "getAuctionDetails",
    args: [BigInt(auctionIndex)],
  });

  return {
    data: data
      ? {
          currentWinner: data[0] as Address,
          currentPrice: data[1] as bigint,
          secondsRemaining: data[2] as bigint,
          status: data[3] as number, // 0 = Open, 1 = Closed, 2 = Payed
        }
      : null,
    isError,
    isLoading,
  };
}

// Hook for reading full auction struct from contract
export function useAuctionStruct(auctionIndex: number) {
  const { data, isError, isLoading } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: "auctions",
    args: [BigInt(auctionIndex)],
  });

  return {
    data: data
      ? {
          name: data[0] as string,
          initialPrice: data[1] as bigint,
          currentPrice: data[2] as bigint,
          bidder: data[3] as Address,
          deadline: data[4] as bigint,
          bidCount: data[5] as bigint,
          status: data[6] as number,
        }
      : null,
    isError,
    isLoading,
  };
}

// Hook for getting total number of auctions
export function useTotalAuctions() {
  const { data, isError, isLoading } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: "getTotalAuctions",
  });

  return {
    totalAuctions: data ? Number(data) : 0,
    isError,
    isLoading,
  };
}

// Hook for getting bid count for specific auction
export function useAuctionBidCount(auctionIndex: number) {
  const { data, isError, isLoading } = useReadContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: "getBidCount",
    args: [BigInt(auctionIndex)],
  });

  return {
    bidCount: data ? Number(data) : 0,
    isError,
    isLoading,
  };
}

// Hook for admin functions (owner only)
export function useAuctionAdmin() {
  const { writeContract, isPending, error } = useWriteContract();

  const closeAuction = async (auctionIndex: number) => {
    try {
      const result = await writeContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: "closeAuction",
        args: [BigInt(auctionIndex)],
      });
      return { hash: result, success: true };
    } catch (err) {
      console.error("Close auction failed:", err);
      throw err;
    }
  };

  const withdrawFromAuction = async (auctionIndex: number) => {
    try {
      const result = await writeContract({
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: "withdraw",
        args: [BigInt(auctionIndex)],
      });
      return { hash: result, success: true };
    } catch (err) {
      console.error("Withdraw failed:", err);
      throw err;
    }
  };

  return {
    closeAuction,
    withdrawFromAuction,
    isPending,
    error,
  };
}

// Event listeners for real-time updates
export function useAuctionEvents(auctionIndex: number) {
  // Listen for bid updates
  useWatchContractEvent({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    eventName: "UpdatedBid",
    onLogs(logs) {
      logs.forEach((log) => {
        const { _auctionIndex, _newOffer, _bidderAddress } = log.args;
        if (_auctionIndex === BigInt(auctionIndex)) {
          console.log(
            `New bid of ${formatEther(_newOffer ?? BigInt(0))} ETH from ${_bidderAddress}`,
          );
          // You can trigger refetch of auction data here
        }
      });
    },
  });

  // Listen for auction state changes
  useWatchContractEvent({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    eventName: "UpdatedAuctionState",
    onLogs(logs) {
      logs.forEach((log) => {
        const { _name, _currentState, _auctionIndex } = log.args;
        if (_auctionIndex === BigInt(auctionIndex)) {
          console.log(`Auction "${_name}" state changed to ${_currentState}`);
          // You can trigger refetch of auction data here
        }
      });
    },
  });
}

// Utility functions for auction contract interaction
export const auctionContractUtils = {
  // Convert auction index to number
  formatAuctionIndex: (auctionId: string): number => {
    const numericId = parseInt(auctionId.replace(/\D/g, "")) || 0;
    return numericId;
  },

  // Format bid amount for display
  formatBidAmount: (amount: bigint): string => {
    return formatEther(amount);
  },

  // Parse bid amount from user input
  parseBidAmount: (amount: string): bigint => {
    return parseEther(amount);
  },

  // Check if bid is valid (must be higher than current price)
  isValidBid: (newBid: bigint, currentBid: bigint): boolean => {
    return newBid > currentBid;
  },

  // Calculate next minimum bid (just higher than current)
  calculateNextMinBid: (currentBid: bigint): bigint => {
    return currentBid + parseEther("0.01"); // 0.01 ETH minimum increment
  },

  // Convert auction status enum to string
  getStatusString: (status: number): string => {
    switch (status) {
      case AuctionStatus.Open:
        return "Open";
      case AuctionStatus.Closed:
        return "Closed";
      case AuctionStatus.Payed:
        return "Paid";
      default:
        return "Unknown";
    }
  },

  // Convert seconds to human readable time
  formatTimeRemaining: (seconds: bigint): string => {
    const totalSeconds = Number(seconds);
    if (totalSeconds <= 0) return "Auction ended";

    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  },

  // Check if address is valid
  isValidAddress: (address: string): boolean => {
    return (
      address !== "0x0000000000000000000000000000000000000000" &&
      address.length === 42
    );
  },
};
