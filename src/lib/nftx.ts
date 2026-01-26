/**
 * NFTX v2 integration for marketplace
 * Fetches vault holdings directly from blockchain and prices from DEX
 */

import { unstable_cache } from "next/cache";
import { encodeFunctionData } from "viem";
import { wizardsWithTraits, type Wizard } from "@/data/wizardsWithTraits";
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
 * Get wizard image URL by token ID
 */
function getWizardImageUrl(tokenId: string): string {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${tokenId}.png`;
}

/**
 * Get wizard data by token ID from local data
 */
function getWizardData(tokenId: string): Wizard | undefined {
  const idx = parseInt(tokenId, 10);
  return wizardsWithTraits[idx];
}

/**
 * Public RPC endpoint for Ethereum mainnet
 */
const ETH_RPC = "https://ethereum-rpc.publicnode.com";

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
};

/**
 * Get NFTX vault config for a collection
 */
export function getNFTXVault(
  collectionKey: CollectionKey,
): NFTXVaultConfig | null {
  return nftxVaults[collectionKey] || null;
}

/**
 * Make an eth_call to a contract
 */
async function ethCall(to: string, data: string): Promise<string | null> {
  try {
    const response = await fetch(ETH_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{ to, data }, "latest"],
        id: 1,
      }),
    });

    const json = await response.json();
    if (json.error) {
      console.error("eth_call error:", json.error);
      return null;
    }
    return json.result;
  } catch (error) {
    console.error("eth_call failed:", error);
    return null;
  }
}

/**
 * Pad an address to 32 bytes for ABI encoding
 */
function padAddress(address: string): string {
  return address.toLowerCase().replace("0x", "").padStart(64, "0");
}

/**
 * Pad a number to 32 bytes for ABI encoding
 */
function padNumber(num: number): string {
  return num.toString(16).padStart(64, "0");
}

/**
 * Parse a uint256 result from hex
 */
function parseUint256(hex: string | null): number {
  if (!hex || hex === "0x") return 0;
  return parseInt(hex, 16);
}

/**
 * Query ERC721 balanceOf for an address
 * balanceOf(address) selector: 0x70a08231
 */
async function getERC721Balance(
  nftContract: string,
  owner: string,
): Promise<number> {
  const data = `0x70a08231${padAddress(owner)}`;
  const result = await ethCall(nftContract, data);
  return parseUint256(result);
}

/**
 * Query ERC721 tokenOfOwnerByIndex
 * tokenOfOwnerByIndex(address,uint256) selector: 0x2f745c59
 */
async function getTokenOfOwnerByIndex(
  nftContract: string,
  owner: string,
  index: number,
): Promise<number | null> {
  const data = `0x2f745c59${padAddress(owner)}${padNumber(index)}`;
  const result = await ethCall(nftContract, data);
  if (!result || result === "0x") return null;
  return parseUint256(result);
}

/**
 * Fetch all token IDs owned by an address (vault)
 * Uses ERC721Enumerable interface
 */
async function fetchVaultTokenIds(
  nftContract: string,
  vaultAddress: string,
  maxTokens: number = 500,
): Promise<string[]> {
  // First get the balance
  const balance = await getERC721Balance(nftContract, vaultAddress);
  if (balance === 0) return [];

  const tokenCount = Math.min(balance, maxTokens);
  const tokenIds: string[] = [];

  // Batch fetch token IDs (in groups of 10 concurrent requests)
  const batchSize = 10;
  for (let i = 0; i < tokenCount; i += batchSize) {
    const promises: Promise<number | null>[] = [];
    for (let j = i; j < Math.min(i + batchSize, tokenCount); j++) {
      promises.push(getTokenOfOwnerByIndex(nftContract, vaultAddress, j));
    }
    const results = await Promise.all(promises);
    for (const tokenId of results) {
      if (tokenId !== null) {
        tokenIds.push(tokenId.toString());
      }
    }
  }

  return tokenIds;
}

/**
 * Default NFTX v2 fees (5% redeem fee is standard)
 */
const DEFAULT_NFTX_FEES = {
  mintFee: "50000000000000000", // 5%
  redeemFee: "50000000000000000", // 5%
  swapFee: "50000000000000000", // 5%
};

/**
 * Fetch vault holdings directly from blockchain (cached)
 */
export const fetchVaultHoldings = unstable_cache(
  async (vaultConfig: NFTXVaultConfig): Promise<NFTXVaultData | null> => {
    try {
      const collection = collections[vaultConfig.collectionKey];
      if (!collection) {
        console.warn(`Collection not found for ${vaultConfig.collectionKey}`);
        return null;
      }

      // Fetch token IDs from the NFT contract (vault holds the NFTs)
      const tokenIds = await fetchVaultTokenIds(
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
        dateAdded: 0, // Not available from contract
      }));

      return {
        vault: vaultConfig,
        holdings,
        totalHoldings: holdings.length,
        fees: DEFAULT_NFTX_FEES,
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
    revalidate: 300, // 5 minutes - blockchain data
    tags: ["nftx-holdings"],
  },
);

/**
 * SushiSwap V2 Router address for price quotes
 */
const SUSHISWAP_ROUTER = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

/**
 * Get amounts out from SushiSwap router
 * getAmountsOut(uint256,address[]) selector: 0xd06ca61f
 */
async function getAmountsOut(
  amountIn: bigint,
  path: string[],
): Promise<bigint[] | null> {
  // Encode the function call
  // getAmountsOut(uint256 amountIn, address[] memory path)
  const amountHex = amountIn.toString(16).padStart(64, "0");

  // Offset to path array (32 bytes after amountIn)
  const pathOffset =
    "0000000000000000000000000000000000000000000000000000000000000040";

  // Path array length
  const pathLength = path.length.toString(16).padStart(64, "0");

  // Path addresses
  const pathAddresses = path.map((addr) => padAddress(addr)).join("");

  const data = `0xd06ca61f${amountHex}${pathOffset}${pathLength}${pathAddresses}`;

  const result = await ethCall(SUSHISWAP_ROUTER, data);
  if (!result || result === "0x" || result.length < 130) return null;

  // Parse the result - it's an array of uint256
  // Skip first 64 chars (0x + offset) and next 64 (array length)
  const dataWithoutPrefix = result.slice(2);
  const arrayLength = parseInt(dataWithoutPrefix.slice(64, 128), 16);
  const amounts: bigint[] = [];

  for (let i = 0; i < arrayLength; i++) {
    const start = 128 + i * 64;
    const hex = dataWithoutPrefix.slice(start, start + 64);
    amounts.push(BigInt("0x" + hex));
  }

  return amounts;
}

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
export function calculateNFTXPrice(
  vTokenPriceEth: string,
  redeemFeePercent: string,
): { totalPriceEth: string; feeEth: string } {
  const vTokenPrice = parseFloat(vTokenPriceEth);
  // Fee is in wei format as percentage (50000000000000000 = 5%)
  const feePercent = parseFloat(redeemFeePercent) / 1e18;

  // To buy 1 NFT, you need (1 + fee%) vTokens
  const totalVTokens = 1 + feePercent;
  const totalPriceEth = totalVTokens * vTokenPrice;
  const feeEth = feePercent * vTokenPrice;

  return {
    totalPriceEth: totalPriceEth.toFixed(6),
    feeEth: feeEth.toFixed(6),
  };
}

/**
 * Fetch NFTX listings for a collection
 * Returns MarketplaceItems with NFTX listing data
 */
export async function fetchNFTXListings(
  collectionKey: CollectionKey,
): Promise<MarketplaceItem[]> {
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

  // Calculate price for buying from pool
  const { totalPriceEth, feeEth } = calculateNFTXPrice(
    vTokenPriceEth,
    vaultData.fees.redeemFee,
  );

  // Convert holdings to MarketplaceItems
  const items: MarketplaceItem[] = vaultData.holdings.map((holding) => {
    const nftxListing: NFTXListing = {
      source: "nftx",
      vaultAddress: vaultConfig.vaultAddress,
      tokenId: holding.tokenId,
      priceEth: totalPriceEth,
      vTokenPriceEth: vTokenPriceEth,
      feeEth: feeEth,
      dateAdded: holding.dateAdded,
    };

    // Get wizard data from local cache (for wizards collection)
    const wizardData =
      collectionKey === "wizards" ? getWizardData(holding.tokenId) : undefined;

    // Create NFT data with local wizard data if available
    const nft: MarketplaceNFT = {
      identifier: holding.tokenId,
      collection: collection.slug,
      contract: collection.address,
      token_standard: "erc721",
      name: wizardData?.name || `${collection.name} #${holding.tokenId}`,
      description: "",
      image_url:
        collectionKey === "wizards" ? getWizardImageUrl(holding.tokenId) : "",
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
}

/**
 * Get NFTX buy quote for specific NFT IDs
 * This is used when the user wants to buy a specific NFT from the pool
 */
export async function getNFTXBuyQuote(
  collectionKey: CollectionKey,
  tokenIds: string[],
): Promise<{
  totalPriceEth: string;
  pricePerNft: string;
  feePerNft: string;
  vaultAddress: string;
} | null> {
  const vaultConfig = getNFTXVault(collectionKey);
  if (!vaultConfig) {
    return null;
  }

  const [vaultData, vTokenPriceEth] = await Promise.all([
    fetchVaultHoldings(vaultConfig),
    fetchVTokenPrice(vaultConfig.vTokenAddress),
  ]);

  if (!vaultData || !vTokenPriceEth) {
    return null;
  }

  // Verify all requested token IDs are in the vault
  const holdingIds = new Set(vaultData.holdings.map((h) => h.tokenId));
  for (const tokenId of tokenIds) {
    if (!holdingIds.has(tokenId)) {
      throw new Error(`Token ${tokenId} is not available in the NFTX pool`);
    }
  }

  const { totalPriceEth: pricePerNft, feeEth: feePerNft } = calculateNFTXPrice(
    vTokenPriceEth,
    vaultData.fees.redeemFee,
  );

  // Total price for all NFTs
  // Note: For multiple NFTs, price impact would increase, but for simplicity
  // we're using linear pricing here. A more accurate implementation would
  // use the SushiSwap router to get an exact quote.
  const totalPriceEth = (parseFloat(pricePerNft) * tokenIds.length).toFixed(6);

  return {
    totalPriceEth,
    pricePerNft,
    feePerNft,
    vaultAddress: vaultConfig.vaultAddress,
  };
}

/**
 * Get transaction data for buying NFTs from NFTX pool
 * Returns the transaction parameters to send
 */
export async function getNFTXBuyTransaction(
  collectionKey: CollectionKey,
  tokenIds: string[],
  buyerAddress: string,
): Promise<{
  to: string;
  data: string;
  value: string; // in wei
} | null> {
  const vaultConfig = getNFTXVault(collectionKey);
  if (!vaultConfig) {
    return null;
  }

  // Get quote first
  const quote = await getNFTXBuyQuote(collectionKey, tokenIds);
  if (!quote) {
    return null;
  }

  // Add 5% slippage buffer to the price
  const priceWithSlippage = parseFloat(quote.totalPriceEth) * 1.05;
  const valueWei = BigInt(Math.floor(priceWithSlippage * 1e18)).toString();

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
}
