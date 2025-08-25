// Web3 Provider Component
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState, useEffect } from "react";
import { config } from "@/lib/web3-config";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";

interface Web3ProviderProps {
  children: ReactNode;
}

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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return children without Web3 providers during SSR
    return <>{children}</>;
  }

  return (
    <Web3ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </WagmiProvider>
    </Web3ErrorBoundary>
  );
}
