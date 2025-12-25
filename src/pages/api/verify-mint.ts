import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, http, type Address } from "viem";
import { base } from "viem/chains";
import { addresses } from "@/config/addresses";
import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { wizzyPfpAbi } from "@/config/wizzyPfpAbi";

// Null address constant
const NULL_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;

type TokenResult = {
  tokenId: number;
  success: boolean;
  owner?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the array of IDs from the request body
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        error: "ids parameter is required and must be an array",
      });
    }

    if (ids.length === 0) {
      return res.status(400).json({
        error: "ids array cannot be empty",
      });
    }

    // Validate all IDs are valid numbers
    const tokenIds: number[] = [];
    for (const id of ids) {
      const tokenId = typeof id === "string" ? parseInt(id, 10) : Number(id);
      if (isNaN(tokenId) || tokenId < 0) {
        return res.status(400).json({
          error: `Invalid ID: ${id}. All IDs must be non-negative integers`,
        });
      }
      tokenIds.push(tokenId);
    }

    // Create a public client for reading from the blockchain
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });

    const supabase = getSupabaseClient();

    // First, check all tokens in parallel to see which ones exist
    const tokenChecks = await Promise.all(
      tokenIds.map(async (tokenId) => {
        try {
          // Check if the token exists (owner != nullAddress)
          // Note: ownerOf will revert if token doesn't exist, which we catch below
          const owner = await publicClient.readContract({
            address: addresses.pfpMint as Address,
            abi: wizzyPfpAbi, // erc721
            functionName: "ownerOf",
            args: [BigInt(tokenId)],
          });

          // If owner is null address, token doesn't exist
          if (owner.toLowerCase() === NULL_ADDRESS.toLowerCase()) {
            return {
              tokenId,
              exists: false,
              owner: null,
              error: "Token does not exist (null owner)",
            };
          }

          return {
            tokenId,
            exists: true,
            owner: owner,
            error: null,
          };
        } catch (error: any) {
          // Handle contract errors (e.g., token doesn't exist)
          if (
            error?.message?.includes("ERC721: invalid token ID") ||
            error?.message?.includes("owner query for nonexistent token")
          ) {
            return {
              tokenId,
              exists: false,
              owner: null,
              error: "Token does not exist",
            };
          }

          // Other errors
          console.error(`Error checking token ${tokenId}:`, error);
          return {
            tokenId,
            exists: false,
            owner: null,
            error: error?.message || "Unknown error",
          };
        }
      }),
    );

    // Separate existing and non-existing tokens
    const existingTokens = tokenChecks.filter((check) => check.exists);
    const nonExistingTokens = tokenChecks.filter((check) => !check.exists);

    // Batch update all existing tokens in a single operation
    let batchUpdateError = null;
    if (existingTokens.length > 0) {
      const existingTokenIds = existingTokens.map((t) => t.tokenId);
      const { error: updateError } = await supabase
        .from(tableNames.WIZZY_PFP_BY_SHADOWS)
        .update({ minted: true })
        .in("id", existingTokenIds);

      if (updateError) {
        console.error("Supabase batch update error:", updateError);
        batchUpdateError = updateError;
      }
    }

    // Build results array
    const results: TokenResult[] = [];

    // Add results for existing tokens
    for (const token of existingTokens) {
      if (batchUpdateError) {
        results.push({
          tokenId: token.tokenId,
          success: false,
          owner: token.owner || undefined,
          error: `Failed to update database: ${batchUpdateError.message}`,
        });
      } else {
        results.push({
          tokenId: token.tokenId,
          success: true,
          owner: token.owner || undefined,
        });
      }
    }

    // Add results for non-existing tokens
    for (const token of nonExistingTokens) {
      results.push({
        tokenId: token.tokenId,
        success: false,
        error: token.error || "Token does not exist",
      });
    }

    // Count successes and failures
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return res.status(200).json({
      success: true,
      contractAddress: addresses.pfpMint as Address,
      total: results.length,
      successful: successCount,
      failed: failureCount,
      results: results,
    });
  } catch (error: any) {
    console.error("API error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
}
