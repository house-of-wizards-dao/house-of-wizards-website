"use client";

import Link from "next/link";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import { LazyImage } from "@/components/ui/LazyImage";

interface NFTCardProps {
  nft: OpenSeaNFT;
  contract: string;
  imagesOnly?: boolean;
  imageSize?: number;
}

function NFTImageOnly({
  nft,
  imageSize,
}: {
  nft: OpenSeaNFT;
  imageSize: number;
}) {
  return (
    <LazyImage
      alt={nft.name || `NFT #${nft.identifier}`}
      src={nft.image_url}
      width={imageSize}
      height={imageSize}
      className="object-contain w-full h-full"
    />
  );
}

function NFTWithContent({ nft }: { nft: OpenSeaNFT }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2 h-full w-full border border-gray-800 rounded-lg max-w-[200px] hover:border-brand-500 transition-colors">
      <LazyImage
        alt={nft.name || `NFT #${nft.identifier}`}
        src={nft.image_url}
        width={200}
        height={200}
        className="object-contain w-full h-full p-3 aspect-square"
      />
      <h3 className="text-xs sm:text-sm mt-1 text-center break-words">
        {nft.name || `#${nft.identifier}`}
      </h3>
    </div>
  );
}

export function NFTCard({
  nft,
  imagesOnly = false,
  imageSize = 200,
}: NFTCardProps) {
  return (
    <Link href={nft.opensea_url} target="_blank" rel="noopener noreferrer">
      {imagesOnly ? (
        <NFTImageOnly nft={nft} imageSize={imageSize} />
      ) : (
        <NFTWithContent nft={nft} />
      )}
    </Link>
  );
}
