import { Dispatch, SetStateAction } from "react";
import { Browser } from "@/components/browser/Browser";
import { soulTraits, soulTraitParts, SoulTraitPart } from "@/data/soulTraits";
import { soulsWithTraits, type Soul } from "@/data/soulsWithTraits";

const getSoulImage = (idx: number): string => {
  return `https://portal.forgottenrunes.com/api/souls/img/${idx}`;
};

const orderedSouls = [...soulsWithTraits].sort((a, b) => a.idx - b.idx);

export type SoulBrowserProps = {
  onClick?: (v: number) => void;
  selectedTokens?: number[];
  setSelectedTokens?: Dispatch<SetStateAction<number[]>>;
  disabledTokenIds?: number[];
};

export const SoulBrowser = (props: SoulBrowserProps) => {
  return (
    <Browser<SoulTraitPart, Soul>
      {...props}
      traitParts={soulTraitParts}
      traits={soulTraits}
      items={orderedSouls}
      collectionKey="Souls"
      getImageUrl={getSoulImage}
    />
  );
};
