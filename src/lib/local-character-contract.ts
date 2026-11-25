import { frwcAddresses } from "@/config/addresses";
import type { LocalNftCollection } from "@/types/nft-metadata";

const localCharacterContracts: Record<string, LocalNftCollection> = {
  [frwcAddresses.wizards.toLowerCase()]: "wizards",
  [frwcAddresses.warriors.toLowerCase()]: "warriors",
  [frwcAddresses.souls.toLowerCase()]: "souls",
};

export const localCharacterCollection = (
  contract: string,
): LocalNftCollection | null =>
  localCharacterContracts[contract.toLowerCase()] ?? null;
