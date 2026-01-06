"use client";

import Link from "next/link";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import { LazyImage } from "@/components/ui/LazyImage";
import { cn } from "@/lib/utils";

interface NFTCardProps {
  nft: OpenSeaNFT;
  imagesOnly?: boolean;
}

export function NFTCard({ nft, imagesOnly = false }: NFTCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        !imagesOnly &&
          "gap-2 p-2 sm:p-3 border border-gray-800 rounded-lg hover:border-brand-500 transition-colors"
      )}
    >
      <Link
        href={nft.opensea_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full aspect-square flex items-center justify-center"
      >
        <LazyImage
          alt={nft.name || `NFT #${nft.identifier}`}
          src={nft.image_url}
          width={200}
          height={200}
          className="object-contain w-full h-full rounded"
        />
      </Link>
      {!imagesOnly && (
        <>
          <h3 className="text-xs sm:text-sm mt-1 text-center w-full break-words">
            {nft.name || `#${nft.identifier}`}
          </h3>
        </>
      )}
    </div>
  );
}
