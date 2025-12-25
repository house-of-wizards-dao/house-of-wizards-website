import type { NextApiRequest, NextApiResponse } from "next";
import { OpenSeaSDK, Chain } from "opensea-js";
// @ts-ignore - ethers is a dependency of opensea-js
import { JsonRpcProvider } from "ethers";
import { logger } from "@/lib/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address, limit, next } = req.query;

    // Validate required parameters
    if (!address || typeof address !== "string") {
      return res.status(400).json({
        error: "address parameter is required",
      });
    }

    // Validate address format (basic Ethereum address validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({
        error: "Invalid address format. Must be a valid Ethereum address.",
      });
    }

    // Parse limit if provided
    let limitNum: number | undefined;
    if (limit && typeof limit === "string") {
      limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum <= 0 || limitNum > 50) {
        return res.status(400).json({
          error: "limit must be a number between 1 and 50",
        });
      }
    }

    // Initialize OpenSea SDK with a minimal provider
    // For Base mainnet, we use Chain.Base and pass "base" as chain string to the method
    const apiKey = process.env.OPENSEA_API_KEY;
    const provider = new JsonRpcProvider("https://mainnet.base.org");
    const sdk = new OpenSeaSDK(
      provider,
      {
        apiKey: apiKey || undefined,
        chain: Chain.Base,
      },
      (arg: string) => {
        // Optional logger function
        if (process.env.NODE_ENV === "development") {
          logger.debug("OpenSea API", { message: arg });
        }
      },
    );

    // Fetch NFTs owned by the account
    const data = await sdk.api.getNFTsByAccount(
      address,
      limitNum,
      next as string | undefined,
      "base" as any, // Using string for Base mainnet
    );

    // Set cache headers (OpenSea data can change, so use a shorter cache)
    res.setHeader("Cache-Control", "public, max-age=300"); // 5 minutes

    // Return the NFTs data
    return res.status(200).json({
      nfts: data.nfts || [],
      next: data.next || null,
    });
  } catch (error: any) {
    logger.error("API error in nfts endpoint", { error });

    return res.status(500).json({
      error: "Internal server error",
      details: error?.message || "Unknown error",
    });
  }
}
