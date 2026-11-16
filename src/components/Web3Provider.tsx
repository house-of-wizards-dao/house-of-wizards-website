"use client";

// Web3 Provider Component
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import {
  RainbowKitSiweNextAuthProvider,
  GetSiweMessageOptions,
} from "@rainbow-me/rainbowkit-siwe-next-auth";
import { useAccount, WagmiProvider } from "wagmi";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { getWeb3Config } from "@/lib/web3-config";
import Web3ErrorBoundary from "@/components/Web3ErrorBoundary";

type Web3ProviderProps = {
  children: ReactNode;
  synchronizeSession?: boolean;
};

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Put thy rune on the door to Sign in",
});

const normalizeAddress = (address?: string | null) =>
  address?.toLowerCase() ?? null;

let signOutInFlight: Promise<unknown> | undefined;

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
    signOutInFlight ??= signOut({ redirect: false }).finally(() => {
      signOutInFlight = undefined;
    });
  }, [
    queryClient,
    session?.address,
    sessionStatus,
    walletAddress,
    walletStatus,
  ]);

  return null;
};

export const Web3Provider = ({
  children,
  synchronizeSession = true,
}: Web3ProviderProps) => {
  const [config] = useState(getWeb3Config);
  return (
    <Web3ErrorBoundary>
      <WagmiProvider config={config} reconnectOnMount>
        {synchronizeSession && <WalletSessionSync />}
        <RainbowKitSiweNextAuthProvider
          getSiweMessageOptions={getSiweMessageOptions}
        >
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
        </RainbowKitSiweNextAuthProvider>
      </WagmiProvider>
    </Web3ErrorBoundary>
  );
};
