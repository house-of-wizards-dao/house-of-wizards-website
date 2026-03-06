// Web3 Configuration for House of Wizards DAO
import { createConfig, http } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const chains = [mainnet, base, baseSepolia] as const;

const transports = {
  [mainnet.id]: http(),
  [base.id]: http(),
  [baseSepolia.id]: http(),
} as const;

// Build Wagmi config lazily from client code.
// Use injected connector only to avoid WalletConnect server-side storage access.
export const getWeb3Config = () =>
  createConfig({
    chains,
    transports,
    connectors: [injected()],
    ssr: false,
    multiInjectedProviderDiscovery: false,
  });
