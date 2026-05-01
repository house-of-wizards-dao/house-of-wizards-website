/**
 * NFTX v2 integration for marketplace
 * Fetches vault holdings via OpenSea API and prices from DEX
 */

import { unstable_cache } from "next/cache";
import { createPublicClient, encodeFunctionData, http } from "viem";
import { wizardsWithTraits } from "@/data/wizardsWithTraits";
import { warriorsWithTraits } from "@/data/warriorsWithTraits";
import type {
  NFTXVaultConfig,
  NFTXVaultData,
  NFTXHolding,
  NFTXListing,
  MarketplaceNFT,
  MarketplaceItem,
  CollectionKey,
} from "@/types/marketplace";
import { collections } from "./marketplace";

/**
 * NFTX MarketplaceZap ABI for buyAndRedeem function
 */
const MARKETPLACE_ZAP_ABI = [
  {
    name: "buyAndRedeem",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "vaultId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "specificIds", type: "uint256[]" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
    ],
    outputs: [],
  },
] as const;

/**
 * Get NFT image URL by collection and token ID
 */
const getNFTImageUrl = (
  collectionKey: CollectionKey,
  tokenId: string,
): string => {
  switch (collectionKey) {
    case "wizards":
      // Wizards use IPFS (same as WizardBrowser)
      return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${tokenId}.png`;
    case "warriors":
      // Warriors use portal API (same as WarriorBrowser)
      return `https://portal.forgottenrunes.com/api/warriors/img/${tokenId}.png`;
    default:
      return "";
  }
};

/**
 * Get NFT name from local data by collection and token ID
 */
const getNFTName = (
  collectionKey: CollectionKey,
  tokenId: string,
): string | undefined => {
  const idx = parseInt(tokenId, 10);
  if (collectionKey === "wizards") {
    return wizardsWithTraits[idx]?.name;
  }
  if (collectionKey === "warriors") {
    return warriorsWithTraits[idx]?.name;
  }
  return undefined;
};

/**
 * Public RPC endpoint for Ethereum mainnet
 */
const ETH_RPC = "https://ethereum-rpc.publicnode.com";

const ethClient = createPublicClient({
  transport: http(ETH_RPC),
});

/**
 * NFTX v2 contract addresses (Ethereum mainnet)
 */
export const nftxContracts = {
  vaultFactory: "0xBE86f647b167567525cCAAfcd6f881F1Ee558216",
  staking: "0x688c3E4658B5367da06fd629E41879beaB538E37",
  stakingZap: "0x0b8ee2ee7d6f3bfb73c9ae2127558d1172b65fb1",
  marketplaceZap: "0x0fc584529a2aefa997697fafacba5831fac0c22d",
  feeDistributor: "0x7AE9D7Ee8489cAD7aFc84111b8b185EE594Ae090",
  sushiRouter: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
} as const;

/**
 * Known NFTX vaults for FRWC collections
 * Vault addresses verified from https://v2.nftx.io
 */
export const nftxVaults: Record<string, NFTXVaultConfig> = {
  wizards: {
    vaultId: 24, // WIZARD vault ID (verified from on-chain vaultId() call)
    vaultAddress: "0x87931e7ad81914e7898d07c68f145fc0a553d8fb",
    vTokenAddress: "0x87931e7ad81914e7898d07c68f145fc0a553d8fb", // vToken is same as vault in v2
    collectionKey: "wizards",
    name: "Forgotten Runes Wizards Cult",
    symbol: "WIZARD",
  },
  warriors: {
    vaultId: 479, // WARRIOR vault ID (verified from tx 0x7fc82484 calldata)
    vaultAddress: "0xe218a21d03dea706d114d9c4490950375f3b7c05",
    vTokenAddress: "0xe218a21d03dea706d114d9c4490950375f3b7c05", // vToken is same as vault in v2
    collectionKey: "warriors",
    name: "Forgotten Runes Warriors Guild",
    symbol: "WARRIOR",
  },
};

/**
 * Get NFTX vault config for a collection
 */
export const getNFTXVault = (
  collectionKey: CollectionKey,
): NFTXVaultConfig | null => {
  return nftxVaults[collectionKey] || null;
};

const NFTX_VAULT_ABI = [
  {
    name: "randomRedeemFee",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "targetRedeemFee",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/**
 * Fetch token IDs owned by a vault for a specific collection using OpenSea API
 * Uses collection-specific query for efficiency
 */
const fetchVaultTokenIds = async (
  collectionSlug: string,
  nftContract: string,
  vaultAddress: string,
  maxTokens: number = 500,
): Promise<string[]> => {
  const tokenIds: string[] = [];
  let next: string | undefined;
  const pageSize = 200;
  const maxPages = Math.ceil(maxTokens / pageSize);

  // Use OpenSea REST API directly with collection filter for efficiency
  const apiKey = process.env.OPENSEA_API_KEY;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  try {
    for (let page = 0; page < maxPages; page++) {
      const params = new URLSearchParams({
        collection: collectionSlug,
        limit: pageSize.toString(),
      });
      if (next) {
        params.set("next", next);
      }

      const response = await fetch(
        `https://api.opensea.io/api/v2/chain/ethereum/account/${vaultAddress}/nfts?${params}`,
        { headers },
      );

      if (!response.ok) {
        console.error(
          `OpenSea API error: ${response.status} ${response.statusText}`,
        );
        break;
      }

      const data = await response.json();

      // Filter by contract to be extra safe
      for (const nft of data.nfts || []) {
        if (nft.contract?.toLowerCase() === nftContract.toLowerCase()) {
          tokenIds.push(nft.identifier);
        }
      }

      // Stop if we have enough or no more pages
      if (!data.next || tokenIds.length >= maxTokens) {
        break;
      }
      next = data.next;
    }
  } catch (error) {
    console.error(
      `Error fetching vault token IDs via OpenSea for ${vaultAddress}:`,
      error,
    );
  }

  return tokenIds.slice(0, maxTokens);
};

/**
 * Fetch vault holdings via OpenSea API (cached)
 */
export const fetchVaultHoldings = unstable_cache(
  async (vaultConfig: NFTXVaultConfig): Promise<NFTXVaultData | null> => {
    try {
      const collection = collections[vaultConfig.collectionKey];
      if (!collection) {
        console.warn(`Collection not found for ${vaultConfig.collectionKey}`);
        return null;
      }

      // Fetch token IDs via OpenSea API (filtered by collection)
      const tokenIds = await fetchVaultTokenIds(
        collection.slug,
        collection.address,
        vaultConfig.vaultAddress,
      );

      if (tokenIds.length === 0) {
        console.warn(`No tokens found in NFTX vault ${vaultConfig.symbol}`);
        return null;
      }

      const holdings: NFTXHolding[] = tokenIds.map((tokenId) => ({
        tokenId,
        amount: 1,
        dateAdded: 0, // Not available from OpenSea
      }));
      const [randomRedeemFee, targetRedeemFee] = await Promise.all([
        ethClient.readContract({
          address: vaultConfig.vaultAddress as `0x${string}`,
          abi: NFTX_VAULT_ABI,
          functionName: "randomRedeemFee",
        }),
        ethClient.readContract({
          address: vaultConfig.vaultAddress as `0x${string}`,
          abi: NFTX_VAULT_ABI,
          functionName: "targetRedeemFee",
        }),
      ]);

      return {
        vault: vaultConfig,
        holdings,
        totalHoldings: holdings.length,
        fees: {
          randomRedeemFee: randomRedeemFee.toString(),
          targetRedeemFee: targetRedeemFee.toString(),
        },
        usesFactoryFees: true,
      };
    } catch (error) {
      console.error(
        `Error fetching NFTX vault holdings for ${vaultConfig.symbol}:`,
        error,
      );
      return null;
    }
  },
  ["nftx-vault-holdings"],
  {
    revalidate: 300, // 5 minutes
    tags: ["nftx-holdings"],
  },
);

/**
 * SushiSwap V2 Router address for price quotes
 */
const SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const SUSHI_ROUTER_ABI = [
  {
    name: "getAmountsOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
  {
    name: "getAmountsIn",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountOut", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
] as const;

/**
 * Get amounts out from SushiSwap router
 * getAmountsOut(uint256,address[]) selector: 0xd06ca61f
 */
const getAmountsOut = async (
  amountIn: bigint,
  path: string[],
): Promise<bigint[] | null> => {
  try {
    const amounts = await ethClient.readContract({
      address: SUSHISWAP_ROUTER,
      abi: SUSHI_ROUTER_ABI,
      functionName: "getAmountsOut",
      args: [amountIn, path as `0x${string}`[]],
    });
    return [...amounts];
  } catch (error) {
    console.error("getAmountsOut failed:", error);
    return null;
  }
};

/**
 * Get amounts in from SushiSwap router
 * getAmountsIn(uint256,address[]) selector: 0x1f00ca74
 */
const getAmountsIn = async (
  amountOut: bigint,
  path: string[],
): Promise<bigint[] | null> => {
  try {
    const amounts = await ethClient.readContract({
      address: SUSHISWAP_ROUTER,
      abi: SUSHI_ROUTER_ABI,
      functionName: "getAmountsIn",
      args: [amountOut, path as `0x${string}`[]],
    });
    return [...amounts];
  } catch (error) {
    console.error("getAmountsIn failed:", error);
    return null;
  }
};

/**
 * Convert wei bigint to ETH decimal string.
 */
const weiToEthString = (wei: bigint, decimals: number = 6): string => {
  const whole = wei / 1000000000000000000n;
  const fraction = wei % 1000000000000000000n;
  const fractionStr = fraction.toString().padStart(18, "0").slice(0, decimals);
  return `${whole.toString()}.${fractionStr}`;
};

/**
 * Fetch vToken price in ETH from SushiSwap (cached)
 */
export const fetchVTokenPrice = unstable_cache(
  async (vTokenAddress: string): Promise<string | null> => {
    try {
      // Get price for 1 vToken (1e18 wei) in ETH
      const oneToken = BigInt("1000000000000000000"); // 1e18

      // Path: vToken -> WETH
      const amounts = await getAmountsOut(oneToken, [
        vTokenAddress,
        WETH_ADDRESS,
      ]);

      if (!amounts || amounts.length < 2) {
        console.warn(`Could not get SushiSwap price for ${vTokenAddress}`);
        return null;
      }

      // amounts[1] is the WETH amount for 1 vToken
      const ethAmount = amounts[1];
      // Convert to decimal string (18 decimals)
      const ethPrice = Number(ethAmount) / 1e18;

      return ethPrice.toFixed(6);
    } catch (error) {
      console.error(`Error fetching vToken price for ${vTokenAddress}:`, error);
      return null;
    }
  },
  ["nftx-vtoken-price"],
  {
    revalidate: 60, // 1 minute - prices change more frequently
    tags: ["nftx-price"],
  },
);

/**
 * Calculate the total price to buy an NFT from NFTX pool
 * Price = 1 vToken + redeem fee (in vToken equivalent converted to ETH)
 */
export const calculateNFTXPrice = (
  vTokenPriceEth: string,
  redeemFeeWei: string,
): { totalPriceEth: string; feeEth: string } => {
  const vTokenPrice = parseFloat(vTokenPriceEth);
  // NFTX fees are stored as vToken wei (30000000000000000 = 0.03 vTokens).
  const feePercent = parseFloat(redeemFeeWei) / 1e18;

  // To buy 1 NFT, you need (1 + fee%) vTokens
  const totalVTokens = 1 + feePercent;
  const totalPriceEth = totalVTokens * vTokenPrice;
  const feeEth = feePercent * vTokenPrice;

  return {
    totalPriceEth: totalPriceEth.toFixed(6),
    feeEth: feeEth.toFixed(6),
  };
};

/**
 * Fetch NFTX listings for a collection
 * Returns MarketplaceItems with NFTX listing data
 */
export const fetchNFTXListings = async (
  collectionKey: CollectionKey,
): Promise<MarketplaceItem[]> => {
  const vaultConfig = getNFTXVault(collectionKey);
  if (!vaultConfig) {
    return []; // No NFTX vault for this collection
  }

  const collection = collections[collectionKey];
  if (!collection) {
    return [];
  }

  // Fetch vault holdings and vToken price in parallel
  const [vaultData, vTokenPriceEth] = await Promise.all([
    fetchVaultHoldings(vaultConfig),
    fetchVTokenPrice(vaultConfig.vTokenAddress),
  ]);

  if (!vaultData || !vTokenPriceEth) {
    return [];
  }

  // Estimate the redeem fee for display, then price the actual buy path with
  // exact-output routing. This same listing price is later used as msg.value.
  const { feeEth } = calculateNFTXPrice(
    vTokenPriceEth,
    vaultData.fees.targetRedeemFee,
  );
  const redeemFeeWei = BigInt(vaultData.fees.targetRedeemFee);
  const perNftVTokenWei = 1000000000000000000n + redeemFeeWei;
  const amountsIn = await getAmountsIn(perNftVTokenWei, [
    WETH_ADDRESS,
    vaultConfig.vTokenAddress,
  ]);
  if (!amountsIn || amountsIn.length < 2) {
    return [];
  }

  const quotedPriceEth = weiToEthString(amountsIn[0]);
  const quotedPriceWei = amountsIn[0].toString();

  // Convert holdings to MarketplaceItems
  const items: MarketplaceItem[] = vaultData.holdings.map((holding) => {
    const nftxListing: NFTXListing = {
      source: "nftx",
      vaultAddress: vaultConfig.vaultAddress,
      tokenId: holding.tokenId,
      priceEth: quotedPriceEth,
      priceWei: quotedPriceWei,
      vTokenPriceEth: vTokenPriceEth,
      feeEth: feeEth,
      dateAdded: holding.dateAdded,
    };

    // Get NFT name from local data if available
    const nftName = getNFTName(collectionKey, holding.tokenId);

    // Create NFT data with local data if available
    const nft: MarketplaceNFT = {
      identifier: holding.tokenId,
      collection: collection.slug,
      contract: collection.address,
      token_standard: "erc721",
      name: nftName || `${collection.name} #${holding.tokenId}`,
      description: "",
      image_url: getNFTImageUrl(collectionKey, holding.tokenId),
      metadata_url: "",
      opensea_url: `https://opensea.io/assets/ethereum/${collection.address}/${holding.tokenId}`,
      updated_at: new Date(holding.dateAdded * 1000).toISOString(),
      is_disabled: false,
      is_nsfw: false,
    };

    return {
      nft,
      collection,
      listings: [], // No OpenSea listings
      offers: [],
      nftxListing,
      source: "nftx" as const,
    };
  });

  return items;
};

const assertNFTXTokensAvailable = async (
  collectionKey: CollectionKey,
  tokenIds: string[],
): Promise<boolean> => {
  const vaultConfig = getNFTXVault(collectionKey);
  if (!vaultConfig) {
    return false;
  }

  const vaultData = await fetchVaultHoldings(vaultConfig);
  if (!vaultData) {
    return false;
  }

  const holdingIds = new Set(vaultData.holdings.map((h) => h.tokenId));
  for (const tokenId of tokenIds) {
    if (!holdingIds.has(tokenId)) {
      throw new Error(`Token ${tokenId} is not available in the NFTX pool`);
    }
  }

  return true;
};

/**
 * Get transaction data for buying NFTs from NFTX pool
 * Returns the transaction parameters to send
 */
export const getNFTXBuyTransaction = async (
  collectionKey: CollectionKey,
  tokenIds: string[],
  buyerAddress: string,
  priceWei: string,
): Promise<{
  to: string;
  data: string;
  value: string; // in wei
} | null> => {
  const vaultConfig = getNFTXVault(collectionKey);
  if (!vaultConfig) {
    return null;
  }

  if (!(await assertNFTXTokensAvailable(collectionKey, tokenIds))) {
    return null;
  }

  const valueWei = BigInt(priceWei).toString();

  // Encode the buyAndRedeem function call using viem
  const data = encodeFunctionData({
    abi: MARKETPLACE_ZAP_ABI,
    functionName: "buyAndRedeem",
    args: [
      BigInt(vaultConfig.vaultId), // vaultId
      BigInt(tokenIds.length), // amount
      tokenIds.map((id) => BigInt(id)), // specificIds
      [
        nftxContracts.weth as `0x${string}`, // WETH
        vaultConfig.vaultAddress as `0x${string}`, // vToken
      ], // path: swap WETH -> vToken
      buyerAddress as `0x${string}`, // to
    ],
  });

  return {
    to: nftxContracts.marketplaceZap,
    data,
    value: valueWei,
  };
};
