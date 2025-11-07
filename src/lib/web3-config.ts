// Web3 Configuration for House of Wizards DAO
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

  if (projectId == null) {
    throw new Error("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set");
  }

  // if (
  //   !projectId ||
  //   projectId === "YOUR_PROJECT_ID" ||
  //   projectId === "your-walletconnect-project-id-here"
  // ) {
  //   console.warn(
  //     "⚠️  WalletConnect Project ID not set or using placeholder. " +
  //       "Get a real Project ID from https://cloud.walletconnect.com for production use.",
  //   );
  //   // Return a development-safe placeholder that won't cause crashes
  //   return "0123456789abcdef0123456789abcdef";
  // }

  return projectId;
};

// RainbowKit configuration
export const config = getDefaultConfig({
  appName: "House of Wizards DAO",
  projectId: getWalletConnectProjectId(),
  chains: [
    mainnet,
  ],
  ssr: true, // Enable server-side rendering
});

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
