// Web3 Configuration for House of Wizards DAO
import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import type { Config } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";

const chains = [mainnet, base, baseSepolia] as const;

const transports = {
  [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  [base.id]: http(),
  [baseSepolia.id]: http(),
} as const;

// Get WalletConnect Project ID with validation
const getWalletConnectProjectId = () => {
  const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

  if (
    !projectId ||
    projectId === "YOUR_PROJECT_ID" ||
    projectId === "your-walletconnect-project-id-here"
  ) {
    // Return a development-safe placeholder that won't cause crashes
    return "0123456789abcdef0123456789abcdef";
  }

  return projectId;
};

// One browser store is shared by the navbar wallet island and wallet routes.
// Server renders get their own config so state cannot leak between requests.
let browserConfig: Config | undefined;
export const getWeb3Config = (): Config => {
  if (typeof window !== "undefined" && browserConfig) return browserConfig;
  const config = getDefaultConfig({
    appName: "House of Wizards DAO",
    projectId: getWalletConnectProjectId(),
    chains,
    ssr: true,
    transports,
  });
  if (typeof window !== "undefined") browserConfig = config;
  return config;
};
