"use client";

import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { WalletNFTsByCollection } from "@/hooks/useWalletNFTs";
import { NFTCard } from "./NFTCard";
import { useGallery } from "@/contexts/GalleryContext";
import { frwcAddresses } from "@/config/addresses";

interface NFTGridProps {
  nfts: WalletNFTsByCollection | null;
}

function CollectionGrid({
  nfts,
  title,
}: {
  nfts: OpenSeaNFT[];
  title?: string;
}) {
  const { imagesOnly, imageSize } = useGallery();
  // Gap is constant relative to image size (4% of image size)
  const gapRatio = 0.06;
  const gapSize = Math.round(imageSize * gapRatio);

  return (
    <div className="flex flex-col gap-4 h-full">
      {title && (
        <h2 className="text-3xl font-atirose text-brand-500 capitalize">
          {title}
        </h2>
      )}
      <div
        className="flex flex-row flex-wrap items-start justify-stretch"
        style={{ gap: `${gapSize}px` }}
      >
        {nfts.map((nft, index) => (
          <NFTCard
            nft={nft}
            contract={nft.contract}
            imagesOnly={imagesOnly}
            imageSize={imageSize}
            key={`${nft.contract}-${nft.identifier}-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export function NFTGrid({ nfts }: NFTGridProps) {
  const { enabledCollections, viewMode, showCollectionTitles } = useGallery();

  if (!nfts) {
    return (
      <p className="text-gray-400">No NFTs found for the specified wallets.</p>
    );
  }

  // Create a map of contract address to its order in frwcAddresses
  const contractOrder = new Map<string, number>();
  Object.values(frwcAddresses).forEach((address, index) => {
    contractOrder.set(address.toLowerCase(), index);
  });

  // Get collections from the API response (grouped by OpenSea collection name)
  // Each collection name maps to an array of NFTs
  const collections = Object.entries(nfts)
    .map(([collectionName, nftsArray]) => {
      if (!nftsArray || nftsArray.length === 0) return null;

      // Get contract address from first NFT (all NFTs in a collection have same contract)
      const contract = nftsArray[0]?.contract?.toLowerCase();
      if (!contract || !enabledCollections.has(contract)) return null;

      return {
        name: collectionName,
        nfts: nftsArray,
        contract,
      };
    })
    .filter((col): col is NonNullable<typeof col> => col !== null)
    // Sort collections by the order they appear in frwcAddresses
    .sort((a, b) => {
      const orderA = contractOrder.get(a.contract) ?? Infinity;
      const orderB = contractOrder.get(b.contract) ?? Infinity;
      return orderA - orderB;
    });

  if (collections.length === 0) {
    return (
      <p className="text-gray-400">No NFTs found for the specified wallets.</p>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="flex flex-col gap-8 justify-stretch items-stretch w-full">
        {viewMode === "grouped" ? (
          <>
            {collections.map(({ name, nfts = [] }) => (
              <CollectionGrid
                key={name}
                nfts={nfts}
                title={showCollectionTitles ? name : undefined}
              />
            ))}
          </>
        ) : (
          <CollectionGrid nfts={collections.flatMap((c) => c.nfts ?? [])} />
        )}
      </div>
    </div>
  );
}
