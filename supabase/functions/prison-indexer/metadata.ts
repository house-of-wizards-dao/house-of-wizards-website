import { z } from "zod";

const collections = new Set([
  "0x9690b63eb85467be5267a3603f770589ab12dc95",
  "0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42",
]);
export const missingMetadataSchema = z
  .array(
    z.object({
      collection: z.string().refine((value) => collections.has(value)),
      token_id: z.string().regex(/^(0|[1-9]\d*)$/),
    }),
  )
  .max(50);
type Token = z.infer<typeof missingMetadataSchema>[number];
const charactersSchema = z.object({
  characters: z
    .array(
      z.object({
        collection: z.string().refine((value) => collections.has(value)),
        tokenId: z.string().regex(/^(0|[1-9]\d*)$/),
        name: z.string().min(1).max(250),
        imageUrl: z
          .string()
          .regex(/^https:\/\/(portal|nfts)\.forgottenrunes\.com\//),
      }),
    )
    .max(50),
});

export const fetchPrisonCharacters = async (
  tokens: Token[],
  fetcher = fetch,
) => {
  if (!tokens.length) return [];
  const response = await fetcher(
    "https://www.houseofwizards.xyz/api/forgotten-prison/characters",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tokens: tokens.map((token) => ({
          collection: token.collection,
          tokenId: token.token_id,
        })),
      }),
      signal: AbortSignal.timeout(10_000),
    },
  );
  if (!response.ok) throw new Error("Character catalog unavailable");
  const { characters } = charactersSchema.parse(await response.json());
  const requested = new Set(
    tokens.map((token) => `${token.collection}:${token.token_id}`),
  );
  const seen = new Set<string>();
  return characters.map((character) => {
    const key = `${character.collection}:${character.tokenId}`;
    if (!requested.has(key) || seen.has(key))
      throw new Error("Unexpected catalog character");
    seen.add(key);
    return {
      chain_id: 1,
      collection: character.collection,
      token_id: character.tokenId,
      name: character.name,
      image_url: character.imageUrl,
      updated_at: new Date().toISOString(),
    };
  });
};
