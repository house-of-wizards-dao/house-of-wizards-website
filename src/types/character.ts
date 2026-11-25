export type CharacterTrait = {
  part: string;
  partKey: string;
  traitId: number;
  displayName: string;
  description?: string;
};

export type CountedCharacterTrait = CharacterTrait & {
  count: number;
  total: number;
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
  characterTraits: CountedCharacterTrait[];
  characterAffinity: CharacterAffinity | null;
};
