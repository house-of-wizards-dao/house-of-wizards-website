"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { hasPersistedWalletConnection } from "@/lib/wallet-storage";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const WalletControls = dynamic(() => import("./WalletControls"), {
  ssr: false,
  loading: () => (
    <button
      type="button"
      disabled
      className="rounded-xl bg-brand-500 px-4 py-2 text-black"
      aria-busy="true"
    >
      Loading wallet…
    </button>
  ),
});

export const WalletButton = ({
  accountStatus = "avatar",
  requestId = 0,
}: {
  accountStatus?: "avatar" | "full";
  requestId?: number;
}) => {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const [ownRequests, setOwnRequests] = useState(0);
  const requests = ownRequests + requestId;
  const [returningWallet, setReturningWallet] = useState(false);

  useEffect(() => {
    const checkWallet = () => {
      setReturningWallet(hasPersistedWalletConnection());
    };
    checkWallet();
    window.addEventListener("storage", checkWallet);
    return () => window.removeEventListener("storage", checkWallet);
  }, [pathname]);

  if (requests > 0 || returningWallet) {
    return (
      <WalletControls accountStatus={accountStatus} requestId={requests} />
    );
  }

  return (
    <button
      type="button"
      disabled={!hydrated}
      onClick={() => setOwnRequests((count) => count + 1)}
      className="rounded-xl bg-brand-500 px-4 py-2 font-sans font-semibold text-black hover:bg-brand-400"
    >
      Connect Wallet
    </button>
  );
};
