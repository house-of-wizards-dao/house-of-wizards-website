"use client";

import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { WalletNFTsByCollection } from "@/hooks/useWalletNFTs";
import { NFTCard } from "./NFTCard";
import { useGallery } from "@/contexts/GalleryContext";
import { frwcAddresses, frwcCollections } from "@/config/addresses";

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

  // Get collections with their contract addresses
  const collections = frwcCollections
    .map((collection) => ({
      name: collection.name,
      nfts: nfts[collection.name],
      contract: collection.address,
    }))
    .filter(
      (col) =>
        col.nfts && col.nfts.length > 0 && enabledCollections.has(col.contract)
    );

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
