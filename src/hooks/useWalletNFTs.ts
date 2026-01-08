"use client";

import { useEffect, useState, useMemo } from "react";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";

export interface WalletNFTsByCollection {
  [key: string]: OpenSeaNFT[];
}

export function useWalletNFTs(walletInputs: string[]) {
  const [data, setData] = useState<WalletNFTsByCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create a stable string key for the wallet inputs to use as dependency
  // This prevents unnecessary re-fetches when the array reference changes but contents are the same
  const walletInputsKey = useMemo(
    () => [...walletInputs].sort().join(","),
    [walletInputs]
  );

  useEffect(() => {
    if (walletInputs.length === 0) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params with multiple wallet parameters
        const params = new URLSearchParams();
        walletInputs.forEach((wallet) => {
          params.append("wallets", wallet);
        });

        const response = await fetch(`/api/nfts/wallets?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch NFTs: ${response.statusText}`
          );
        }

        const json: WalletNFTsByCollection = await response.json();
        setData(json);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        console.error("Error fetching wallet NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletInputsKey, walletInputs]); // Re-fetch when wallet inputs change

  return { data, loading, error };
}

