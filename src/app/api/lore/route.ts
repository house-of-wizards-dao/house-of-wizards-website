import { NextResponse } from "next/server";

export type LoreEntry = {
  previewText: string;
  tokenId: number;
  index: number;
}

export type LoreResponse = {
  data: {
    PaginatedLore: LoreEntry[];
  };
}

export async function GET() {
  try {
    const query = `{
      PaginatedLore(order_by: {createdAtBlock: desc}, limit: 3, where: {
        _and:{
          isArchivedByHolder:{ _neq: true }
          previewText: { _is_null: false }
        }
      }) {
        previewText
        tokenId
        index
        token {
          beast {
            name
          }
          beastSpawn {
            name
          }
          wizard {
            name
          }
          warrior {
            name
          }
          soul {
            name
          }
          pony {
            name
          }
    }
      }
    }`;

    const response = await fetch("https://api.forgottenrunes.com/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    const result: LoreResponse = await response.json();

    return NextResponse.json(result.data.PaginatedLore);
  } catch (error) {
    console.error("Error fetching lore:", error);
    return NextResponse.json(
      { error: "Failed to fetch lore entries" },
      { status: 500 }
    );
  }
}

