"use client";

// Web3 Provider Component
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiContext } from "wagmi";
import { type ReactNode, useEffect, useState } from "react";
import { getWeb3Config } from "@/lib/web3-config";
import { startWallet } from "@/lib/wallet-startup";
import { logger } from "@/lib/logger";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";
import { WalletSessionProvider } from "@/components/WalletSessionProvider";

type Web3ProviderProps = {
  children: ReactNode;
  synchronizeSession?: boolean;
  authenticate?: boolean;
};

export const Web3Provider = ({
  children,
  synchronizeSession = true,
  authenticate = true,
}: Web3ProviderProps) => {
  const [config] = useState(getWeb3Config);
  useEffect(() => {
    void startWallet(config).catch((error: unknown) => {
      logger.error("Wallet initialization failed", { error });
    });
  }, [config]);
  const walletUi = (
    <RainbowKitProvider
      theme={darkTheme({
        accentColor: "#A986D9",
        accentColorForeground: "black",
        borderRadius: "medium",
        fontStack: "system",
        overlayBlur: "small",
      })}
    >
      {children}
    </RainbowKitProvider>
  );
  return (
    <Web3ErrorBoundary>
      <WagmiContext.Provider value={config}>
        {authenticate || synchronizeSession ? (
          <WalletSessionProvider
            authenticate={authenticate}
            synchronizeSession={synchronizeSession}
          >
            {walletUi}
          </WalletSessionProvider>
        ) : (
          walletUi
        )}
      </WagmiContext.Provider>
    </Web3ErrorBoundary>
  );
};
