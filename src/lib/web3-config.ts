// Web3 Configuration for House of Wizards DAO
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia, mainnet } from "wagmi/chains";

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
  appName: "House of Wizards DAO",
  projectId: getWalletConnectProjectId(),
  chains: [mainnet, base, baseSepolia],
  ssr: true, // Enable server-side rendering
});
