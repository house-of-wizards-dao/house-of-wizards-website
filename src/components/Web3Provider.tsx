"use client";

// Web3 Provider Component
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { WagmiProvider } from "wagmi";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { config } from "@/lib/web3-config";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";

interface Web3ProviderProps {
  children: ReactNode;
}

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Put thy rune on the door to Sign in",
});

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      }),
  );

  return (
    <Web3ErrorBoundary>
      <WagmiProvider config={config} reconnectOnMount={true}>
        <SessionProvider refetchInterval={0}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <RainbowKitProvider
                theme={darkTheme({
                  accentColor: "#A986D9", // Violet to match your theme
                  accentColorForeground: "white",
                  borderRadius: "medium",
                  fontStack: "system",
                  overlayBlur: "small",
                })}
              >
                {children}
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </QueryClientProvider>
        </SessionProvider>
      </WagmiProvider>
    </Web3ErrorBoundary>
  );
}
