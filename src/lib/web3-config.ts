// Web3 Configuration for House of Wizards DAO
import { createConfig, http } from "wagmi";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import type { Config } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { hasPersistedWalletConnection } from "@/lib/wallet-storage";
import { configureConnectorStartup } from "@/lib/wallet-connectors";

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
  const restoreConnection = hasPersistedWalletConnection();
  const hasInjectedProvider =
    typeof window !== "undefined" && Boolean(Reflect.get(window, "ethereum"));
  const { connectors } = getDefaultWallets({
    appName: "House of Wizards DAO",
    projectId: getWalletConnectProjectId(),
  });
  const config = createConfig({
    connectors: connectors.map(
      (createConnector) => (parameters) =>
        configureConnectorStartup(
          createConnector(parameters),
          restoreConnection,
          hasInjectedProvider,
        ),
    ),
    chains,
    ssr: true,
    transports,
  });
  if (typeof window !== "undefined") browserConfig = config;
  return config;
};
