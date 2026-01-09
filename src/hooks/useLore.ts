import { useQuery } from "@tanstack/react-query";

export type LoreEntry = {
  previewText: string;
  tokenId: number;
  index: number;
  token: {
    beast: {
      name: string;
    } | null;
    beastSpawn: {
      name: string;
    } | null;
    wizard: {
      name: string;
    } | null;
    warrior: {
      name: string;
    } | null;
    soul: {
      name: string;
    } | null;
    pony: {
      name: string;
    } | null;
  };
};

export const getTokenName = (token: LoreEntry["token"] | undefined) => {
  if (token == null) return "Unknown";
  if (token.beast) return token.beast.name;
  if (token.beastSpawn) return token.beastSpawn.name;
  if (token.wizard) return token.wizard.name;
  if (token.warrior) return token.warrior.name;
  if (token.soul) return token.soul.name;
  if (token.pony) return token.pony.name;
  return "Unknown";
};

const fetchLore = async (): Promise<LoreEntry[]> => {
  const response = await fetch("/api/lore");

  if (!response.ok) {
    throw new Error("Failed to fetch lore entries");
  }

  return response.json();
}

export const useLore = () => {
  return useQuery({
    queryKey: ["lore"],
    queryFn: fetchLore,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

