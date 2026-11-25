import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { LocalNftMetadata } from "@/types/nft-metadata";

export type LocalGalleryNFT = OpenSeaNFT & { character: LocalNftMetadata };

export type GalleryNFT = (OpenSeaNFT & { character: null }) | LocalGalleryNFT;
