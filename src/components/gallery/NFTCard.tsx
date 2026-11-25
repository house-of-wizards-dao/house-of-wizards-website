"use client";

import { useState } from "react";
import Link from "next/link";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { GalleryNFT } from "@/types/gallery";
import { LazyImage } from "@/components/ui/LazyImage";
import { GalleryCharacterOverlay } from "./GalleryCharacterOverlay";

type NFTCardProps = {
  nft: GalleryNFT;
  contract: string;
  imagesOnly?: boolean;
  imageSize?: number;
};

const NFTImageOnly = ({
  nft,
  imageSize,
}: {
  nft: OpenSeaNFT;
  imageSize: number;
}) => {
  return (
    <LazyImage
      alt={nft.name || `NFT #${nft.identifier}`}
      src={nft.image_url}
      width={imageSize}
      height={imageSize}
      className="object-contain w-full h-full"
    />
  );
};

const NFTWithContent = ({ nft }: { nft: OpenSeaNFT }) => {
  return (
    <span className="flex flex-col items-center justify-center gap-2 p-2 h-full w-full border border-gray-800 rounded-lg max-w-[200px] hover:border-brand-500 transition-colors">
      <LazyImage
        alt={nft.name || `NFT #${nft.identifier}`}
        src={nft.image_url}
        width={200}
        height={200}
        className="object-contain w-full h-full p-3 aspect-square"
      />
      <span className="text-xs sm:text-sm mt-1 text-center break-words">
        {nft.name || `#${nft.identifier}`}
      </span>
    </span>
  );
};

export const NFTCard = ({
  nft,
  imagesOnly = false,
  imageSize = 200,
}: NFTCardProps) => {
  const [open, setOpen] = useState(false);
  const label = nft.name || `NFT #${nft.identifier}`;
  const content = imagesOnly ? (
    <NFTImageOnly nft={nft} imageSize={imageSize} />
  ) : (
    <NFTWithContent nft={nft} />
  );

  if (nft.character === null) {
    return (
      <Link
        href={nft.opensea_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
      >
        {content}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className="cursor-pointer text-left"
      >
        {content}
      </button>
      {open && (
        <GalleryCharacterOverlay nft={nft} onClose={() => setOpen(false)} />
      )}
    </>
  );
};
