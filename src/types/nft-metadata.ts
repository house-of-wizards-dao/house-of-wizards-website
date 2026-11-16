export type LocalNftCollection = "wizards" | "warriors";

export type LocalNftTrait = {
  part: string;
  displayName: string;
  description?: string;
};

export type LocalNftAffinity = {
  affinityName: string;
  collectionLabel: LocalNftCollection;
  traitsInAffinity: number;
  numberOfTraits: number;
  attunement: number;
  maxTraitCount: number;
  isMaxAffinity: boolean;
};

export const asLocalNftCollection = (
  collectionKey: string,
): LocalNftCollection | null => {
  if (collectionKey === "wizards" || collectionKey === "warriors") {
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
