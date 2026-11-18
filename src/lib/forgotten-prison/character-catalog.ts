// Only imported by server routes and local tooling; never send the full catalog
// to the bidding page. Supabase stores the small subset that enters the prison.
import { warriorsWithTraitsMap } from "../../data/warriorsWithTraitsMap";
import { wizardsWithTraitsMap } from "../../data/wizardsWithTraitsMap";
import { COLLECTIONS } from "./config";

export const prisonCharacter = (collection: string, tokenId: string) => {
  if (!/^(0|[1-9]\d*)$/.test(tokenId)) return null;
  const normalized = collection.toLowerCase();
  const wizard = normalized === COLLECTIONS.Wizards.toLowerCase();
  if (!wizard && normalized !== COLLECTIONS.Warriors.toLowerCase()) return null;
  const record = (wizard ? wizardsWithTraitsMap : warriorsWithTraitsMap)[
    tokenId
  ];
  if (!record) return null;
  return {
    collection: normalized,
    tokenId,
    name: record.name,
    imageUrl: wizard
      ? `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${tokenId}.png`
      : `https://portal.forgottenrunes.com/api/warriors/img/${tokenId}.png`,
  };
};
