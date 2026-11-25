import "server-only";
import { TokenboundClient } from "@tokenbound/sdk";
import { getAddress } from "viem";
import type { CharacterPageData } from "@/types/character";
import { getCharacterName, getCollectionName } from "@/data/traitUtilities";
import { localCharacterCollection } from "@/lib/local-character-contract";
import { getLocalNftMetadata } from "./character-metadata";

export const getCharacterPageData = (
  contract: string,
  tokenId: string,
): CharacterPageData => {
  const collection = localCharacterCollection(contract);
  const local = collection ? getLocalNftMetadata(collection, tokenId) : null;

  return {
    backpackAccount: new TokenboundClient({ chainId: 1 }).getAccount({
      tokenContract: getAddress(contract.toLowerCase()),
      tokenId,
    }),
    contract,
    tokenId,
    collectionName: getCollectionName(contract),
    characterName: getCharacterName(contract, tokenId),
    characterTraits: local?.traits ?? [],
    characterAffinity: local?.affinity ?? null,
  };
};
