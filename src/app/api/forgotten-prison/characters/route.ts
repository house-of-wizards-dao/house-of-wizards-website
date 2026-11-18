import { z } from "zod";
import { prisonCharacter } from "@/lib/forgotten-prison/character-catalog";

export const runtime = "nodejs";
const requestSchema = z.object({
  tokens: z
    .array(
      z.object({
        collection: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
        tokenId: z.string().regex(/^(0|[1-9]\d{0,5})$/),
      }),
    )
    .min(1)
    .max(50),
});

// Public, bounded, read-only catalog lookup used once by the indexer for newly
// arriving prizes. Browser rendering uses the cached database fields instead.
export const POST = async (request: Request) => {
  const text = await request.text();
  if (text.length > 16_000)
    return Response.json({ error: "Request too large" }, { status: 413 });
  let input: unknown;
  try {
    input = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success)
    return Response.json({ error: "Invalid tokens" }, { status: 400 });
  return Response.json({
    characters: parsed.data.tokens.flatMap(({ collection, tokenId }) => {
      const character = prisonCharacter(collection, tokenId);
      return character ? [character] : [];
    }),
  });
};
