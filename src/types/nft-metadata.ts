import type {
  CharacterAffinity,
  CountedCharacterTrait,
} from "@/types/character";

export type LocalNftCollection = "wizards" | "warriors" | "souls";

export type LocalNftTrait = CountedCharacterTrait;

export type LocalNftAffinity = CharacterAffinity;

export const asLocalNftCollection = (
  collectionKey: string,
): LocalNftCollection | null => {
  if (
    collectionKey === "wizards" ||
    collectionKey === "warriors" ||
    collectionKey === "souls"
  ) {
    return collectionKey;
  }
  return null;
};

export type LocalNftMetadata = {
  traits: LocalNftTrait[];
  affinity: LocalNftAffinity | null;
};
export type CollectionTraitOptions = Record<
  string,
  { value: number; label: string }[]
>;
