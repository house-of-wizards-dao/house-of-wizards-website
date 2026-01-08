import { NextRequest, NextResponse } from "next/server";
import { fetchNFTsForWallets, type OpenSeaNFT } from "@/lib/opensea-nfts";
import { resolveAddressesOrENS } from "@/lib/ens";
import { frwcAddresses, getCollectionName } from "@/config/addresses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    // Get all wallet parameters (supports multiple ?wallets=...&wallets=...)
    const walletInputs = searchParams
      .getAll("wallets")
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);
    const limitParam = searchParams.get("limit");

    // Validate wallets parameter
    if (walletInputs.length === 0) {
      return NextResponse.json(
        { error: "At least one wallets parameter is required (addresses or ENS names)" },
        { status: 400 }
      );
    }

    // Resolve ENS names to addresses
    const resolvedMap = await resolveAddressesOrENS(walletInputs);
    const walletAddresses: string[] = [];
    const unresolved: string[] = [];

    resolvedMap.forEach((resolved, input) => {
      if (resolved) {
        walletAddresses.push(resolved);
      } else {
        unresolved.push(input);
      }
    });

    if (walletAddresses.length === 0) {
      return NextResponse.json(
        {
          error: "No valid wallet addresses could be resolved",
          unresolved: unresolved.length > 0 ? unresolved : undefined,
        },
        { status: 400 }
      );
    }

    if (unresolved.length > 0) {
      console.warn(`Failed to resolve some inputs: ${unresolved.join(", ")}`);
    }

    // Parse limit if provided (for pagination page size, not total limit)
    // Default to 200 per page to fetch more NFTs efficiently
    let limit: number | undefined = 200;
    if (limitParam) {
      const limitNum = parseInt(limitParam, 10);
      if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 200) {
        limit = limitNum;
      }
    }

    // Fetch NFTs for all wallets (with pagination to get all NFTs)
    const walletNFTMap = await fetchNFTsForWallets(walletAddresses, limit);

    // Get the set of contract addresses we care about (from frwcAddresses)
    const allowedContracts = new Set(
      Object.values(frwcAddresses).map((addr) => addr.toLowerCase())
    );

    // Group NFTs by collection name using our lookup table
    const nftsByCollection: Record<string, OpenSeaNFT[]> = {};

    // Flatten and categorize all NFTs by contract address, then map to friendly names
    walletNFTMap.forEach((contractMap) => {
      contractMap.forEach((nfts, contractAddress) => {
        const normalizedAddress = contractAddress.toLowerCase();
        
        // Only process NFTs from contracts we care about
        if (allowedContracts.has(normalizedAddress)) {
          const collectionName = getCollectionName(normalizedAddress);
          
          // Initialize collection array if it doesn't exist
          if (!nftsByCollection[collectionName]) {
            nftsByCollection[collectionName] = [];
          }
          
          nftsByCollection[collectionName].push(...nfts);
        }
      });
    });

    // Sort each collection by tokenId (identifier) numerically
    const sortByTokenId = (a: OpenSeaNFT, b: OpenSeaNFT): number => {
      const tokenIdA = parseInt(a.identifier, 10);
      const tokenIdB = parseInt(b.identifier, 10);
      if (isNaN(tokenIdA) || isNaN(tokenIdB)) {
        // Fallback to string comparison if not numeric
        return a.identifier.localeCompare(b.identifier);
      }
      return tokenIdA - tokenIdB;
    };

    // Sort all collections dynamically
    Object.values(nftsByCollection).forEach((nfts) => {
      nfts.sort(sortByTokenId);
    });

    return NextResponse.json(nftsByCollection, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error in /api/nfts/wallets:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch NFTs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

