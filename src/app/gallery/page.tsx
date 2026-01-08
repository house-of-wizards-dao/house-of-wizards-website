"use client";

import { PropsWithChildren, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageTitle } from "@/components/PageTitle";
import { GallerySettings } from "@/components/gallery/GallerySettings";
import { NFTGrid } from "@/components/gallery/NFTGrid";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { GalleryProvider, useGallery } from "@/contexts/GalleryContext";
import Image from "next/image";
import { frwcAddresses } from "@/config/addresses";

function GalleryContent() {
  const router = useRouter();
  const { walletInputs, enabledCollections } = useGallery();

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
      <GalleryContent.Container>
        <GalleryContent.Title />
        <Image src="/img/tulip.gif" alt="Loading" width={200} height={200} />
      </GalleryContent.Container>
    );
  }

  if (error) {
    return (
      <GalleryContent.Container>
        <GalleryContent.Title />
        <GalleryContent.Info>
          An error occurred: {error.message}
        </GalleryContent.Info>
      </GalleryContent.Container>
    );
  }

  if (walletInputs.length === 0) {
    return (
      <GalleryContent.Container>
        <GalleryContent.Title />
        <GallerySettings />
        <GalleryContent.Info>
          Click the Settings button to add wallet addresses or ENS names, or use
          query parameters: <br />
          <code className="bg-gray-800 px-2 py-1 rounded">
            ?wallets=0x...&wallets=name.eth
          </code>
        </GalleryContent.Info>
      </GalleryContent.Container>
    );
  }

  return (
    <GalleryContent.Container>
      <GalleryContent.Title />
      <GalleryContent.Header>
        <GalleryContent.Info>
          Showing {totalNFTCount} NFT{totalNFTCount !== 1 ? "s" : ""} from{" "}
          {walletInputs.length} wallet{walletInputs.length !== 1 ? "s" : ""}
        </GalleryContent.Info>
        <GallerySettings />
      </GalleryContent.Header>

      <NFTGrid nfts={nfts} />
    </GalleryContent.Container>
  );
}

GalleryContent.Container = function Container({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">{children}</div>
  );
};

GalleryContent.Title = function Title() {
  return <PageTitle title={"Gallery"} />;
};

GalleryContent.Info = function Info({ children }: PropsWithChildren) {
  return <p className="text-gray-400 text-center max-w-2xl">{children}</p>;
};

GalleryContent.Header = function Header({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-2xl px-4">
      {children}
    </div>
  );
};

export default function GalleryPage() {
  const searchParams = useSearchParams();

  // Get wallets from query params (can be addresses or ENS names)
  const initialWalletInputs = useMemo(() => {
    const wallets = searchParams.getAll("wallets");
    return wallets.map((addr) => addr.trim()).filter((addr) => addr.length > 0);
  }, [searchParams]);

  // Initialize enabled collections (all enabled by default)
  const initialEnabledCollections = useMemo(() => {
    return new Set(Object.values(frwcAddresses).map((addr) => addr.toLowerCase()));
  }, []);

  return (
    <GalleryProvider
      initialWalletInputs={initialWalletInputs}
      initialEnabledCollections={initialEnabledCollections}
    >
      <GalleryContent />
    </GalleryProvider>
  );
}
