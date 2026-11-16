export type CharacterTrait = {
  part: string;
  displayName: string;
  description?: string;
};

export type CharacterAffinity = {
  affinityName: string;
  collectionLabel: "wizard" | "warrior" | "soul";
  traitsInAffinity: number;
  numberOfTraits: number;
  attunement: number;
  maxTraitCount: number;
  isMaxAffinity: boolean;
};

export type CharacterPageData = {
  contract: string;
  backpackAccount: string;
  tokenId: string;
  collectionName: string;
  characterName: string;
  characterTraits: CharacterTrait[];
  characterAffinity: CharacterAffinity | null;
};
