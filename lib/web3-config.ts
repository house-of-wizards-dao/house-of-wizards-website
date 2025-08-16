// Web3 Configuration for Auction House
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  sepolia, // testnet for development
} from "wagmi/chains";

// Enhanced Sepolia chain config with multiple RPC endpoints
const sepoliaEnhanced = {
  ...sepolia,
  rpcUrls: {
    default: {
      http: [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://sepolia.gateway.tenderly.co",
        "https://rpc2.sepolia.org",
        "https://rpc.sepolia.org",
      ],
      webSocket: ["wss://ethereum-sepolia-rpc.publicnode.com"],
    },
    public: {
      http: [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://sepolia.gateway.tenderly.co",
        "https://rpc2.sepolia.org",
        "https://rpc.sepolia.org",
      ],
      webSocket: ["wss://ethereum-sepolia-rpc.publicnode.com"],
    },
  },
};

// Get WalletConnect Project ID with validation
const getWalletConnectProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

  if (
    !projectId ||
    projectId === "YOUR_PROJECT_ID" ||
    projectId === "your-walletconnect-project-id-here"
  ) {
    console.warn(
      "⚠️  WalletConnect Project ID not set or using placeholder. " +
        "Get a real Project ID from https://cloud.walletconnect.com for production use.",
    );
    // Return a development-safe placeholder that won't cause crashes
    return "0123456789abcdef0123456789abcdef";
  }

  return projectId;
};

// RainbowKit configuration
export const config = getDefaultConfig({
  appName: "House of Wizards Auction House",
  projectId: getWalletConnectProjectId(),
  chains: [
    sepoliaEnhanced, // Use enhanced Sepolia with multiple RPC endpoints
    mainnet,
    polygon,
    optimism,
    arbitrum,
  ],
  ssr: true, // Enable server-side rendering
});

// Contract addresses (deploy these to use)
export const AUCTION_CONTRACT_ADDRESS = {
  11155111: "0x172084988957cAC63766fa0495f3FfFb89256064", // Sepolia testnet
  // Add other networks when contracts are deployed:
  // 1: "0x...", // Mainnet
  // 137: "0x...", // Polygon
  // 10: "0x...", // Optimism
  // 42161: "0x...", // Arbitrum
} as const;

// Get contract address for current chain
export function getContractAddress(chainId: number): string | undefined {
  return AUCTION_CONTRACT_ADDRESS[
    chainId as keyof typeof AUCTION_CONTRACT_ADDRESS
  ];
}

// Auction contract ABI (complete for hybrid functionality)
export const AUCTION_ABI = [
  // Core auction functions
  {
    inputs: [
      { name: "_offchainId", type: "string" },
      { name: "_minBid", type: "uint256" },
      { name: "_duration", type: "uint256" },
    ],
    name: "createAuction",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "placeBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "settleAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "cancelAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Enhanced view functions
  {
    inputs: [
      {
        internalType: "uint256",
        name: "auctionId",
        type: "uint256"
      }
    ],
    name: "getAuction",
    outputs: [
      {
        internalType: "address",
        name: "seller",
        type: "address"
      },
      {
        internalType: "address",
        name: "highestBidder",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "highestBid",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "settled",
        type: "bool"
      },
      {
        internalType: "uint8",
        name: "timeExtensions",
        type: "uint8"
      },
      {
        internalType: "string",
        name: "offchainId",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "getMinimumBid",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "canExtendTime",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "canSettlePublicly",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalValueLocked",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "auctionCounter",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // User functions
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // Admin functions
  {
    inputs: [{ name: "auctionId", type: "uint256" }],
    name: "emergencyCancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_protocolFee", type: "uint256" }],
    name: "setProtocolFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "auctionId", type: "uint256" },
      { indexed: false, name: "offchainId", type: "string" },
      { indexed: false, name: "seller", type: "address" },
      { indexed: false, name: "endTime", type: "uint256" },
      { indexed: false, name: "minBid", type: "uint256" },
    ],
    name: "AuctionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "auctionId", type: "uint256" },
      { indexed: false, name: "bidder", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "newEndTime", type: "uint256" },
    ],
    name: "BidPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "auctionId", type: "uint256" },
      { indexed: false, name: "newEndTime", type: "uint256" },
      { indexed: false, name: "extensionCount", type: "uint8" },
    ],
    name: "TimeExtension",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "auctionId", type: "uint256" },
      { indexed: false, name: "winner", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "AuctionSettled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "auctionId", type: "uint256" },
      { indexed: false, name: "reason", type: "string" },
    ],
    name: "AuctionCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "account", type: "address" }],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "account", type: "address" }],
    name: "Unpaused",
    type: "event",
  },
] as const;

// Format ETH values
export function formatEth(value: bigint): string {
  const eth = Number(value) / 1e18;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(eth);
}

// Parse ETH values
export function parseEth(value: string): bigint {
  const num = parseFloat(value);
  if (isNaN(num)) return BigInt(0);
  return BigInt(Math.floor(num * 1e18));
}
