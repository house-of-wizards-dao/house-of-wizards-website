/**
 * OpenSea API utilities for fetching NFTs from all contracts
 */

import { OpenSeaSDK, Chain } from "opensea-js";
// @ts-ignore - ethers is a dependency of opensea-js
import { JsonRpcProvider } from "ethers";
import { frwcAddresses } from "@/config/addresses";

export type OpenSeaNFT = {
  identifier: string; // tokenId
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
};

export type OpenSeaNFTsResponse = {
  nfts: OpenSeaNFT[];
  next: string | null;
};

/**
 * Initialize OpenSea SDK
 */
const getOpenSeaSDK = () => {
  const apiKey = process.env.OPENSEA_API_KEY;
  const provider = new JsonRpcProvider("https://eth.llamarpc.com");
  return new OpenSeaSDK(
    provider,
    {
      apiKey: apiKey || undefined,
      chain: Chain.Mainnet,
    },
    (arg: string) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("OpenSea API", { message: arg });
      }
    },
  );
};

/**
 * Fetch NFTs owned by a wallet address for a specific contract
 */
export const fetchNFTsByContract = async (
  walletAddress: string,
  contractAddress: string,
  limit?: number,
  next?: string,
): Promise<OpenSeaNFTsResponse> => {
  const sdk = getOpenSeaSDK();

  try {
    const data = await sdk.api.getNFTsByAccount(
      walletAddress,
      limit,
      next || undefined,
      "ethereum" as any,
    );

    // Filter NFTs by contract address
    const filteredNFTs = data.nfts.filter(
      (nft) => nft.contract.toLowerCase() === contractAddress.toLowerCase(),
    );

    return {
      nfts: filteredNFTs,
      next: data.next || null,
    };
  } catch (error) {
    console.error(
      `Error fetching NFTs for contract ${contractAddress}:`,
      error,
    );
    throw error;
  }
};

/**
 * Fetch NFTs owned by a wallet address across all contracts in addresses config
 * Handles pagination to fetch all NFTs
 */
export const fetchNFTsForAllContracts = async (
  walletAddress: string,
  limit?: number,
): Promise<Map<string, OpenSeaNFT[]>> => {
  const contractMap = new Map<string, OpenSeaNFT[]>();
  const contractAddresses = Object.values(frwcAddresses).map((addr) =>
    addr.toLowerCase(),
  );

  // First, fetch ALL NFTs from the wallet (with pagination)
  // Then filter by our contracts of interest
  const allNFTs: OpenSeaNFT[] = [];
  let next: string | null = null;
  const maxLimit = limit || 200; // Use higher limit or default to 200
  const maxPages = 10; // Safety limit to prevent infinite loops

  try {
    const sdk = getOpenSeaSDK();
    let pageCount = 0;

    do {
      const data = await sdk.api.getNFTsByAccount(
        walletAddress,
        maxLimit,
        next || undefined,
        "ethereum" as any,
      );

      allNFTs.push(...data.nfts);
      next = data.next || null;
      pageCount++;

      // Stop if we've fetched all NFTs or hit the page limit
      if (!next || pageCount >= maxPages) {
        break;
      }
    } while (next);

    // Filter NFTs by our contracts of interest
    allNFTs.forEach((nft) => {
      const contractLower = nft.contract.toLowerCase();
      if (contractAddresses.includes(contractLower)) {
        if (!contractMap.has(contractLower)) {
          contractMap.set(contractLower, []);
        }
        contractMap.get(contractLower)!.push(nft);
      }
    });
  } catch (error) {
    console.error(`Failed to fetch NFTs for wallet ${walletAddress}:`, error);
  }

  return contractMap;
};

/**
 * Fetch NFTs for multiple wallet addresses across all contracts
 */
export const fetchNFTsForWallets = async (
  walletAddresses: string[],
  limit?: number,
): Promise<Map<string, Map<string, OpenSeaNFT[]>>> => {
  // Map: walletAddress -> contractAddress -> NFTs[]
  const walletMap = new Map<string, Map<string, OpenSeaNFT[]>>();

  // Fetch NFTs for all wallets in parallel
  const walletPromises = walletAddresses.map(async (walletAddress) => {
    try {
      const contractMap = await fetchNFTsForAllContracts(walletAddress, limit);
      return { walletAddress, contractMap };
    } catch (error) {
      console.error(`Failed to fetch NFTs for wallet ${walletAddress}:`, error);
      return { walletAddress, contractMap: new Map<string, OpenSeaNFT[]>() };
    }
  });

  const results = await Promise.all(walletPromises);

  // Build the map
  results.forEach(({ walletAddress, contractMap }) => {
    if (contractMap.size > 0) {
      walletMap.set(walletAddress.toLowerCase(), contractMap);
    }
  });

  return walletMap;
};
