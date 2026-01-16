import { NextRequest, NextResponse } from "next/server";
import { OpenSeaSDK, Chain } from "opensea-js";
// @ts-ignore - ethers is a dependency of opensea-js
import { JsonRpcProvider } from "ethers";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const address = searchParams.get("address");
    const limit = searchParams.get("limit");
    const next = searchParams.get("next");

    // Validate required parameters
    if (!address || typeof address !== "string") {
      return NextResponse.json(
        {
          error: "address parameter is required",
        },
        { status: 400 },
      );
    }

    // Validate address format (basic Ethereum address validation)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          error: "Invalid address format. Must be a valid Ethereum address.",
        },
        { status: 400 },
      );
    }

    // Parse limit if provided
    let limitNum: number | undefined;
    if (limit && typeof limit === "string") {
      limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum <= 0 || limitNum > 50) {
        return NextResponse.json(
          {
            error: "limit must be a number between 1 and 50",
          },
          { status: 400 },
        );
      }
    }

    // Initialize OpenSea SDK with a minimal provider
    const apiKey = process.env.OPENSEA_API_KEY;
    const provider = new JsonRpcProvider("https://mainnet.base.org");
    const sdk = new OpenSeaSDK(
      provider,
      {
        apiKey: apiKey || undefined,
        chain: Chain.Base,
      },
      (arg: string) => {
        if (process.env.NODE_ENV === "development") {
          logger.debug("OpenSea API", { message: arg });
        }
      },
    );

    // Fetch NFTs owned by the account
    const data = await sdk.api.getNFTsByAccount(
      address,
      limitNum,
      next || undefined,
      "base" as any,
    );

    // Return the NFTs data with cache headers
    return NextResponse.json(
      {
        nfts: data.nfts || [],
        next: data.next || null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
        },
      },
    );
  } catch (error: any) {
    logger.error("API error in nfts endpoint", { error });

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
