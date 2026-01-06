"use client";

import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { WalletNFTsByCollection } from "@/hooks/useWalletNFTs";
import { NFTCard } from "./NFTCard";

interface NFTGridProps {
  nfts: WalletNFTsByCollection | null;
  enabledCollections: Set<string>;
  imagesOnly?: boolean;
}

export function NFTGrid({ nfts, enabledCollections, imagesOnly = false }: NFTGridProps) {
  // Flatten and filter NFTs
  const allNFTs: Array<{ nft: OpenSeaNFT; contract: string }> = [];
  
  if (nfts) {
    Object.values(nfts).forEach((nftList) => {
      if (!nftList || nftList.length === 0) return;
      
      // Get contract from first NFT (all NFTs in a collection have the same contract)
      const contractAddress = nftList[0]?.contract?.toLowerCase();
      if (!contractAddress) return;

      // Only include NFTs from enabled collections
      if (enabledCollections.has(contractAddress)) {
        nftList.forEach((nft: OpenSeaNFT) => {
          allNFTs.push({ nft, contract: contractAddress });
        });
      }
    });
  }

  if (allNFTs.length === 0) {
    return (
      <p className="text-gray-400">No NFTs found for the specified wallets.</p>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {allNFTs.map(({ nft, contract }, index) => (
          <NFTCard
            key={`${contract}-${nft.identifier}-${index}`}
            nft={nft}
            contract={contract}
            imagesOnly={imagesOnly}
          />
        ))}
      </div>
    </div>
  );
}

