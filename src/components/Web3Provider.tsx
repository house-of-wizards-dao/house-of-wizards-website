"use client";

// Web3 Provider Component
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { useAccount, WagmiProvider } from "wagmi";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { getClientWeb3Config, getWeb3Config } from "@/lib/web3-config";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";

type Web3ProviderProps = {
  children: ReactNode;
};

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Put thy rune on the door to Sign in",
});

const normalizeAddress = (address?: string | null) =>
  address?.toLowerCase() ?? null;

const WalletSessionSync = () => {
  const { address: walletAddress, status: walletStatus } = useAccount();
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    const sessionAddress = normalizeAddress(session.address);
    const connectedAddress = normalizeAddress(walletAddress);
    const isDisconnected = walletStatus === "disconnected";
    const isMismatchedWallet =
      walletStatus === "connected" && sessionAddress !== connectedAddress;

    if (!isDisconnected && !isMismatchedWallet) return;

    queryClient.removeQueries({ queryKey: ["cms-user"] });
    void signOut({ redirect: false });
  }, [
    queryClient,
    session?.address,
    sessionStatus,
    walletAddress,
    walletStatus,
  ]);

  return null;
};

export const Web3Provider = ({ children }: Web3ProviderProps) => {
  const [config, setConfig] = useState(() => getWeb3Config());
  const [providerInstanceKey, setProviderInstanceKey] = useState(0);
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

  useEffect(() => {
    let active = true;
    getClientWeb3Config()
      .then((nextConfig) => {
        if (active) {
          setConfig(nextConfig);
          // Force provider remount so connector registry refreshes to full client config.
          setProviderInstanceKey(1);
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  return (
    <Web3ErrorBoundary>
      <WagmiProvider
        key={providerInstanceKey}
        config={config}
        reconnectOnMount={true}
      >
        <SessionProvider refetchInterval={0}>
          <QueryClientProvider client={queryClient}>
            <WalletSessionSync />
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
};
