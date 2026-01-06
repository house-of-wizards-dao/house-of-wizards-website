"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { GallerySettings } from "@/components/gallery/GallerySettings";
import { NFTGrid } from "@/components/gallery/NFTGrid";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import Image from "next/image";
import { addresses } from "@/config/addresses";

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get wallets from query params (can be addresses or ENS names)
  // Using getAll to support multiple wallet query parameters
  const [walletInputs, setWalletInputs] = useState<string[]>(() => {
    const wallets = searchParams.getAll("wallets");
    return wallets
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);
  });

  // Initialize enabled collections (all enabled by default)
  const [enabledCollections, setEnabledCollections] = useState<Set<string>>(
    () => {
      const allCollections = new Set(
        Object.values(addresses).map((addr) => addr.toLowerCase())
      );
      return allCollections;
    }
  );

  // Images only toggle
  const [imagesOnly, setImagesOnly] = useState(false);

  // Use the hook to fetch NFTs
  const { data: nfts, loading, error } = useWalletNFTs(walletInputs);

  // Update URL when wallets change
  useEffect(() => {
    if (walletInputs.length > 0) {
      const params = new URLSearchParams();
      // Add each wallet as a separate query parameter
      walletInputs.forEach((wallet) => {
        params.append("wallets", wallet);
      });
      router.replace(`/gallery?${params.toString()}`, { scroll: false });
    }
  }, [walletInputs, router]);

  // Calculate total NFT count for display
  const totalNFTCount = useMemo(() => {
    if (!nfts) return 0;

    let count = 0;
    Object.values(nfts).forEach((nftList) => {
      if (!nftList || nftList.length === 0) return;
      const contractAddress = nftList[0]?.contract?.toLowerCase();
      if (contractAddress && enabledCollections.has(contractAddress)) {
        count += nftList.length;
      }
    });
    return count;
  }, [nfts, enabledCollections]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 max-w-8xl">
        <PageTitle title="NFT Gallery" />
        <Image src="/img/tulip.gif" alt="Loading" width={200} height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
        <PageTitle title="Error loading NFTs" />
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (walletInputs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <PageTitle title="NFT Gallery" />
        <GallerySettings
          walletInputs={walletInputs}
          enabledCollections={enabledCollections}
          imagesOnly={imagesOnly}
          onWalletsChange={setWalletInputs}
          onCollectionsChange={setEnabledCollections}
          onImagesOnlyChange={setImagesOnly}
        />
        <p className="text-gray-400 text-center max-w-2xl">
          Click the Settings button to add wallet addresses or ENS names, or use
          query parameters:{" "}
          <code className="bg-gray-800 px-2 py-1 rounded">
            ?wallets=0x...&wallets=name.eth
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <PageTitle title="NFT Gallery" />
      <div className="flex items-center justify-center gap-4 w-full max-w-2xl px-4">
        <p className="text-gray-400 text-center">
          Showing {totalNFTCount} NFT{totalNFTCount !== 1 ? "s" : ""} from{" "}
          {walletInputs.length} wallet{walletInputs.length !== 1 ? "s" : ""}
        </p>
        <GallerySettings
          walletInputs={walletInputs}
          enabledCollections={enabledCollections}
          imagesOnly={imagesOnly}
          onWalletsChange={setWalletInputs}
          onCollectionsChange={setEnabledCollections}
          onImagesOnlyChange={setImagesOnly}
        />
      </div>

      <NFTGrid
        nfts={nfts}
        enabledCollections={enabledCollections}
        imagesOnly={imagesOnly}
      />
    </div>
  );
}
