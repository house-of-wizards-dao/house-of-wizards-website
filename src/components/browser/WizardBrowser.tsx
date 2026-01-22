import { Dispatch, SetStateAction } from "react";
import { Browser } from "@/components/browser/Browser";
import {
  wizardTraits,
  wizardTraitParts,
  WizardTraitPart,
} from "@/data/wizardTraits";
import { wizardsWithTraits, type Wizard } from "@/data/wizardsWithTraits";

const getWizardImage = (idx: number): string => {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${idx}.png`;
};

export type WizardBrowserProps = {
  onClick?: (v: number) => void;
  selectedTokens?: number[];
  setSelectedTokens?: Dispatch<SetStateAction<number[]>>;
  disabledTokenIds?: number[];
};

export const WizardBrowser = (props: WizardBrowserProps) => {
  return (
    <Browser<WizardTraitPart, Wizard>
      {...props}
      traitParts={wizardTraitParts}
      traits={wizardTraits}
      items={wizardsWithTraits}
      collectionKey="Wizards"
      getImageUrl={getWizardImage}
    />
  );
};
