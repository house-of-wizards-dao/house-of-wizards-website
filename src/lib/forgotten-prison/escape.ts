import { frwcAddresses } from "@/config/addresses";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";
import type { PrizeDraw } from "./bidding";

export type CharacterFamily = "wizards" | "souls" | "warriors";
export type EscapeCharacter = {
  family: CharacterFamily;
  tokenId: string;
  name: string;
  imageUrl?: string;
};

export const characterFamily = (collection: string): CharacterFamily | null => {
  for (const family of ["wizards", "souls", "warriors"] as const)
    if (frwcAddresses[family].toLowerCase() === collection.toLowerCase())
      return family;
  return null;
};
export const walletCharacters = (nfts: Record<string, OpenSeaNFT[]> | null) => {
  const unique = new Map<string, EscapeCharacter>();
  for (const nft of Object.values(nfts ?? {}).flat()) {
    const family = characterFamily(nft.contract);
    if (!family || !/^(0|[1-9]\d{0,4})$/.test(nft.identifier)) continue;
    unique.set(`${family}-${nft.identifier}`, {
      family,
      tokenId: nft.identifier,
      name: nft.name || `${family} #${nft.identifier}`,
      imageUrl: nft.image_url || undefined,
    });
  }
  return [...unique.values()];
};
export const VISITOR: EscapeCharacter = {
  family: "wizards",
  tokenId: "44",
  name: "Wild Mage Lumos of the Hollow",
};
export const characterKey = (character: EscapeCharacter) =>
  `${character.family}-${character.tokenId}`;
export const spriteSource = (
  character: EscapeCharacter,
  file: "png" | "json",
) =>
  character.family === "wizards" && character.tokenId === "44"
    ? `/img/forgotten-prison/game/visitor.${file}`
    : `/api/forgotten-prison/sprites/${character.family}/${character.tokenId}/spritesheet.${file}`;
export const validDrawId = (value: string | undefined) =>
  value && /^[1-9]\d{0,19}$/.test(value) ? value : undefined;

export type ClaimState = Pick<
  PrizeDraw,
  "winner" | "status" | "claimed" | "bonusAwarded" | "bonusClaimed"
>;
export type ClaimFunction = "claimNFT" | "claimBonus";
export const pendingClaims = (draw: ClaimState): ClaimFunction[] => [
  ...(!draw.claimed ? (["claimNFT"] as const) : []),
  ...(draw.bonusAwarded && !draw.bonusClaimed ? (["claimBonus"] as const) : []),
];
export const claimsComplete = (draw: ClaimState) =>
  draw.status === 3 && pendingClaims(draw).length === 0;

// Re-read before each write. A cancelled second signature can safely resume
// without attempting to claim the character again. No ETH is sent by either call.
export const claimWinnings = async ({
  account,
  read,
  assertAccount,
  submitAndConfirm,
}: {
  account: string;
  read: () => Promise<ClaimState>;
  assertAccount: () => void;
  submitAndConfirm: (name: ClaimFunction) => Promise<void>;
}) => {
  for (const name of ["claimNFT", "claimBonus"] as const) {
    const draw = await read();
    assertAccount();
    if (draw.winner.toLowerCase() !== account.toLowerCase())
      throw new Error("This round belongs to a different wallet.");
    if (draw.status !== 3) throw new Error("This draw is not settled yet.");
    if (pendingClaims(draw).includes(name)) await submitAndConfirm(name);
  }
  const result = await read();
  assertAccount();
  if (!claimsComplete(result))
    throw new Error(
      "A prize is still awaiting confirmation. Refresh before trying again.",
    );
  return result;
};
