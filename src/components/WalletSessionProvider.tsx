"use client";

import {
  type AuthenticationConfig,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { useQueryClient } from "@tanstack/react-query";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { createSiweMessage } from "viem/siwe";
import { useAccount, useConfig } from "wagmi";
import { getAccount } from "wagmi/actions";

let signOutInFlight: Promise<unknown> | undefined;

export const WalletSessionProvider = ({
  children,
  authenticate,
  synchronizeSession,
}: {
  children: ReactNode;
  authenticate: boolean;
  synchronizeSession: boolean;
}) => {
  const config = useConfig();
  const wallet = useAccount();
  const { data: session, status } = useSession();
  const sessionAddress = session?.address?.toLowerCase();
  const queryClient = useQueryClient();
  const connectedThisVisit = useRef(false);

  const endChangedSession = useCallback(async () => {
    if (status !== "authenticated") return;
    // Inspect the live store: wallet events can run before React has rendered
    // the updated account, and reconnect replaces connector IDs on every visit.
    const current = getAccount(config);
    if (current.status === "connecting" || current.status === "reconnecting")
      return;
    if (current.status === "connected") {
      if (current.address.toLowerCase() === sessionAddress) return;
    } else if (!connectedThisVisit.current) {
      // Disconnected is the initial state during hydration, not a user logout.
      // A locked/unavailable extension also does not invalidate a signed session.
      return;
    }
    queryClient.removeQueries({ queryKey: ["cms-user"] });
    signOutInFlight ??= signOut({ redirect: false }).finally(() => {
      signOutInFlight = undefined;
    });
    await signOutInFlight;
  }, [config, queryClient, sessionAddress, status]);

  useEffect(() => {
    if (wallet.status === "connected") connectedThisVisit.current = true;
    if (synchronizeSession) void endChangedSession();
  }, [endChangedSession, synchronizeSession, wallet.address, wallet.status]);

  const adapter = useMemo<AuthenticationConfig<string>["adapter"]>(
    () => ({
      getNonce: async () => {
        const nonce = await getCsrfToken();
        if (!nonce) throw new Error("Could not prepare the sign-in message.");
        return nonce;
      },
      createMessage: ({ address, chainId, nonce }) =>
        createSiweMessage({
          address,
          chainId,
          nonce,
          domain: window.location.host,
          uri: window.location.origin,
          version: "1",
          statement: "Put thy rune on the door to Sign in",
        }),
      verify: async ({ message, signature }) => {
        const result = await signIn("credentials", {
          message,
          signature,
          redirect: false,
        });
        return result?.ok ?? false;
      },
      // RainbowKit requests sign-out on any account event, including Rabby's
      // same-address startup announcement. Only end an actually changed session.
      signOut: endChangedSession,
    }),
    [endChangedSession],
  );

  return authenticate ? (
    <RainbowKitAuthenticationProvider adapter={adapter} status={status}>
      {children}
    </RainbowKitAuthenticationProvider>
  ) : (
    children
  );
};
