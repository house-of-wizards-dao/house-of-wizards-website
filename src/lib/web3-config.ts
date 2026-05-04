// Web3 Configuration for House of Wizards DAO
import { createConfig, http } from "wagmi";
import type { Config } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

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

// Server-safe initial config (no WalletConnect storage usage).
export const getWeb3Config = (): Config =>
  createConfig({
    chains,
    transports,
    connectors: [injected()],
    ssr: false,
    multiInjectedProviderDiscovery: false,
  });

// Full RainbowKit config with default wallet providers.
// Dynamically imported so WalletConnect-only browser storage code never runs on SSR.
export const getClientWeb3Config = async (): Promise<Config> => {
  const { getDefaultConfig } = await import("@rainbow-me/rainbowkit");
  return getDefaultConfig({
    appName: "House of Wizards DAO",
    projectId: getWalletConnectProjectId(),
    chains,
    ssr: false,
    transports,
  });
};
