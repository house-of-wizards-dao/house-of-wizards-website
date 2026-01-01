import { getSupabaseClient } from "@/lib/supabase";
import { tableNames } from "@/config/supabase";
import { PfpMintClient } from "./PfpMintClient";

async function getMintedTokenIds(): Promise<number[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(tableNames.WIZZY_PFP_BY_SHADOWS)
      .select("id")
      .eq("minted", true);

    if (error) {
      console.error("Failed to fetch minted tokens:", error);
      return [];
    }

    return data?.map((row) => row.id) || [];
  } catch (error) {
    console.error("Error fetching minted tokens:", error);
    return [];
  }
}

export default async function PfpMintPage() {
  // Pre-fetch minted tokens on the server
  const initialMintedTokenIds = await getMintedTokenIds();

  return <PfpMintClient initialMintedTokenIds={initialMintedTokenIds} />;
}
