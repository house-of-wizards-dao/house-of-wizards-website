import { collectionNames } from "@/config/addresses";
import { soulsWithTraitsMap } from "./soulsWithTraitsMap";
import { wizardsWithTraitsMap } from "./wizardsWithTraitsMap";
import { warriorsWithTraitsMap } from "./warriorsWithTraitsMap";

/**
 * Get friendly collection name from contract address
 */
export const getCollectionName = (contractAddress: string): string => {
  return collectionNames[contractAddress.toLowerCase()] || contractAddress;
};

/**
 * Get character name from contract address and token ID
 */
export const getCharacterName = (
  contractAddress: string,
  tokenId: string,
): string => {
  const collectionName = getCollectionName(contractAddress);
  if (collectionName === "Warriors") {
    return warriorsWithTraitsMap[parseInt(tokenId, 10)].name;
  }
  if (collectionName === "Wizards") {
    return wizardsWithTraitsMap[tokenId].name;
  }
  if (collectionName === "Souls") {
    return soulsWithTraitsMap[tokenId].name;
  }
  return tokenId;
};
