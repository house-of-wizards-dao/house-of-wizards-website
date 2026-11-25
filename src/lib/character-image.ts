import type { LocalNftCollection } from "@/types/nft-metadata";

const imageUrlByCollection: Record<
  LocalNftCollection,
  (tokenId: string) => string
> = {
  wizards: (tokenId) =>
    `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${tokenId}.png`,
  warriors: (tokenId) =>
    `https://portal.forgottenrunes.com/api/warriors/img/${tokenId}.png`,
  souls: (tokenId) =>
    `https://portal.forgottenrunes.com/api/souls/img/${tokenId}`,
};

const collectionByName: Record<string, LocalNftCollection> = {
  Wizards: "wizards",
  Warriors: "warriors",
  Souls: "souls",
};

export const getLocalCharacterImageUrl = (
  collection: LocalNftCollection,
  tokenId: string,
): string => imageUrlByCollection[collection](tokenId);

export const getCharacterImageUrl = (
  collectionName: string,
  tokenId: string,
): string | null => {
  const collection = collectionByName[collectionName];
  return collection ? getLocalCharacterImageUrl(collection, tokenId) : null;
};
