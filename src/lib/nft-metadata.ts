/**
 * NFT Metadata mapping utilities
 * Maps OpenSea NFT data to GraphQL metadata queries
 */

import type { OpenSeaNFT } from "./opensea-nfts";
import type { WizardGraphQLResponse, SoulGraphQLResponse, WarriorGraphQLResponse, PonyGraphQLResponse } from "./frwc-graphql";

export interface NFTWithMetadata {
  openseaNFT: OpenSeaNFT;
  contractType: "wizard" | "soul" | "warrior" | "pony" | "pfpMint" | "unknown";
  graphQLMetadata?: WizardGraphQLResponse | SoulGraphQLResponse | WarriorGraphQLResponse | PonyGraphQLResponse;
}

/**
 * Determine contract type from contract address
 */
export function getContractType(contractAddress: string): NFTWithMetadata["contractType"] {
  const normalizedAddress = contractAddress.toLowerCase();
  
  // Import addresses dynamically to avoid circular dependency issues
  const { addresses } = require("@/config/addresses");
  
  if (normalizedAddress === addresses.wizards.toLowerCase()) return "wizard";
  if (normalizedAddress === addresses.souls.toLowerCase()) return "soul";
  if (normalizedAddress === addresses.warriors.toLowerCase()) return "warrior";
  if (normalizedAddress === addresses.ponies.toLowerCase()) return "pony";
  if (normalizedAddress === addresses.pfpMint.toLowerCase()) return "pfpMint";
  
  return "unknown";
}

/**
 * Match OpenSea NFT with GraphQL metadata by tokenId
 * This will be expanded when user shows how to query GraphQL metadata
 */
export function matchNFTWithMetadata(
  openseaNFT: OpenSeaNFT,
  graphQLData: {
    wizards?: WizardGraphQLResponse[];
    souls?: SoulGraphQLResponse[];
    warriors?: WarriorGraphQLResponse[];
    ponies?: PonyGraphQLResponse[];
  }
): NFTWithMetadata {
  const contractType = getContractType(openseaNFT.contract);
  const tokenId = openseaNFT.identifier;

  let graphQLMetadata: WizardGraphQLResponse | SoulGraphQLResponse | WarriorGraphQLResponse | PonyGraphQLResponse | undefined;

  // Match based on contract type and tokenId
  switch (contractType) {
    case "wizard":
      graphQLMetadata = graphQLData.wizards?.find(
        (w) => w.token?.tokenId === tokenId
      );
      break;
    case "soul":
      graphQLMetadata = graphQLData.souls?.find(
        (s) => s.token?.tokenId === tokenId
      );
      break;
    case "warrior":
      graphQLMetadata = graphQLData.warriors?.find(
        (w) => w.token?.tokenId === tokenId
      );
      break;
    case "pony":
      graphQLMetadata = graphQLData.ponies?.find(
        (p) => p.token?.tokenId === tokenId
      );
      break;
  }

  return {
    openseaNFT,
    contractType,
    graphQLMetadata,
  };
}

