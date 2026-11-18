import { z } from "zod";
import { getSupabaseClient } from "../src/lib/supabase";
import { prisonCharacter } from "../src/lib/forgotten-prison/character-catalog";

const db = getSupabaseClient();
const schema = z.array(
  z.object({ collection: z.string(), token_id: z.string() }),
);
const rows: {
  chain_id: number;
  collection: string;
  token_id: string;
  name: string;
  image_url: string;
}[] = [];
for (let offset = 0; ; offset += 500) {
  const result = await db
    .from("prison_inventory")
    .select("collection,token_id")
    .eq("chain_id", 1)
    .eq("contract", "0x7a258a7ed776d88ec7e19a03019a632c4f097ef8")
    .is("name", null)
    .order("collection")
    .order("token_id")
    .range(offset, offset + 499);
  if (result.error)
    throw new Error(`Inventory read failed: ${result.error.code}`);
  const tokens = schema.parse(result.data);
  for (const token of tokens) {
    const character = prisonCharacter(token.collection, token.token_id);
    if (!character)
      throw new Error(`Catalog missing ${token.collection}:${token.token_id}`);
    rows.push({
      chain_id: 1,
      collection: character.collection,
      token_id: character.tokenId,
      name: character.name,
      image_url: character.imageUrl,
    });
  }
  if (tokens.length < 500) break;
}
if (process.argv.includes("--write")) {
  for (let start = 0; start < rows.length; start += 100) {
    const result = await db
      .from("prison_nft_metadata")
      .upsert(rows.slice(start, start + 100), {
        onConflict: "chain_id,collection,token_id",
      });
    if (result.error)
      throw new Error(`Metadata write failed: ${result.error.code}`);
  }
  console.log(`Cached names and image URLs for ${rows.length} prison NFTs.`);
} else
  console.log(
    `${rows.length} prison NFTs need metadata. Add --write to cache it.`,
  );
