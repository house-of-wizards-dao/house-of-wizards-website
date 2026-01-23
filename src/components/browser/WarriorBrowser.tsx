import { Dispatch, SetStateAction } from "react";
import { Browser } from "@/components/browser/Browser";
import {
  warriorTraits,
  warriorTraitParts,
  WarriorTraitPart,
} from "@/data/warriorTraits";
import { warriorsWithTraits, type Warrior } from "@/data/warriorsWithTraits";

const getWarriorImage = (idx: number): string => {
  return `https://portal.forgottenrunes.com/api/warriors/img/${idx}.png`;
};

const orderedWarriors = warriorsWithTraits.sort((a, b) => a.idx - b.idx);

export type WarriorBrowserProps = {
  onClick?: (v: number) => void;
  selectedTokens?: number[];
  setSelectedTokens?: Dispatch<SetStateAction<number[]>>;
  disabledTokenIds?: number[];
};

export const WarriorBrowser = (props: WarriorBrowserProps) => {
  return (
    <Browser<WarriorTraitPart, Warrior>
      {...props}
      traitParts={warriorTraitParts}
      traits={warriorTraits}
      items={orderedWarriors}
      collectionKey="Warriors"
      getImageUrl={getWarriorImage}
    />
  );
};
