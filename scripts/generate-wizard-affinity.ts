/**
 * Generate wizard affinity attunement from local trait data.
 *
 * Run with: pnpm tsx scripts/generate-wizard-affinity.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { affinities, type Affinity } from "../src/data/affinities";
import {
  wizardTraits,
  wizardTraitParts,
  type WizardTraitPart,
} from "../src/data/wizardTraits";
import { wizardsWithTraitsMap } from "../src/data/wizardsWithTraitsMap";

type Wizard = (typeof wizardsWithTraitsMap)[string];

type WizardAffinity = {
  idx: number;
  name: string;
  affinity: Affinity | null;
  traitsInAffinity: number;
  numberOfTraits: number;
  attunement: number;
};

type AffinityCandidate = {
  affinity: Affinity;
  traitsInAffinity: number;
  rarity: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../src/data/wizardAffinity.ts");

const noTrait = 7777;

const toObjectLiteral = (value: unknown): string =>
  JSON.stringify(value, null, 2).replace(/"(\w+)":/g, "$1:");

const affinityKey = (affinity: Affinity): string =>
  affinity.name.trim().toLowerCase();

const canonicalAffinity = (affinity: Affinity): Affinity => ({
  ...affinity,
  name: affinity.name.trim(),
});

const affinityByKey = new Map<string, Affinity>();

for (const affinity of affinities) {
  const key = affinityKey(affinity);
  if (!affinityByKey.has(key)) {
    affinityByKey.set(key, canonicalAffinity(affinity));
  }
}

const traitByIdx = new Map(wizardTraits.map((trait) => [trait.idx, trait]));

const traitAffinityKeys = (traitIdx: number): string[] => {
  const trait = traitByIdx.get(traitIdx);
  if (!trait) {
    throw new Error(`Wizard trait ${traitIdx} is missing from wizardTraits.ts`);
  }

  return Array.from(new Set(trait.affinity.map(affinityKey)));
};

const affinityForKey = (key: string): Affinity => {
  const affinity = affinityByKey.get(key);
  if (affinity) return affinity;

  for (const trait of wizardTraits) {
    const traitAffinity = trait.affinity.find(
      (candidate) => affinityKey(candidate) === key,
    );
    if (traitAffinity) return canonicalAffinity(traitAffinity);
  }

  throw new Error(`Affinity ${key} is missing from affinities.ts`);
};

const wizardTraitIndices = (wizard: Wizard): number[] =>
  wizardTraitParts
    .map((part: WizardTraitPart) => wizard[part])
    .filter((traitIdx) => traitIdx !== noTrait);

const buildAffinityRarity = (wizards: Wizard[]): Map<string, number> => {
  const rarity = new Map<string, number>();

  for (const wizard of wizards) {
    const wizardAffinityIds = new Set<string>();

    for (const traitIdx of wizardTraitIndices(wizard)) {
      for (const key of traitAffinityKeys(traitIdx)) {
        wizardAffinityIds.add(key);
      }
    }

    for (const key of wizardAffinityIds) {
      rarity.set(key, (rarity.get(key) ?? 0) + 1);
    }
  }

  return rarity;
};

const buildWizardAffinity = (
  wizard: Wizard,
  rarityByAffinityIdx: Map<string, number>,
): WizardAffinity => {
  const traitIndices = wizardTraitIndices(wizard);
  const affinityTraitCounts = new Map<string, number>();

  for (const traitIdx of traitIndices) {
    for (const affinityIdx of traitAffinityKeys(traitIdx)) {
      affinityTraitCounts.set(
        affinityIdx,
        (affinityTraitCounts.get(affinityIdx) ?? 0) + 1,
      );
    }
  }

  const candidates: AffinityCandidate[] = Array.from(
    affinityTraitCounts.entries(),
    ([affinityIdx, traitsInAffinity]) => ({
      affinity: affinityForKey(affinityIdx),
      traitsInAffinity,
      rarity: rarityByAffinityIdx.get(affinityIdx) ?? 0,
    }),
  ).sort((a, b) => {
    if (b.traitsInAffinity !== a.traitsInAffinity) {
      return b.traitsInAffinity - a.traitsInAffinity;
    }

    if (a.rarity !== b.rarity) {
      return a.rarity - b.rarity;
    }

    return Number(a.affinity.idx) - Number(b.affinity.idx);
  });

  const bestCandidate = candidates[0];
  const traitsInAffinity = bestCandidate?.traitsInAffinity ?? 0;
  const numberOfTraits = traitIndices.length;

  return {
    idx: wizard.idx,
    name: wizard.name,
    affinity: bestCandidate?.affinity ?? null,
    traitsInAffinity,
    numberOfTraits,
    attunement:
      numberOfTraits === 0
        ? 0
        : Math.floor((traitsInAffinity / numberOfTraits) * 100),
  };
};

const wizards = Object.values(wizardsWithTraitsMap).sort(
  (a, b) => a.idx - b.idx,
);
const rarityByAffinityIdx = buildAffinityRarity(wizards);
const wizardAffinities = Object.fromEntries(
  wizards.map((wizard) => [
    wizard.idx,
    buildWizardAffinity(wizard, rarityByAffinityIdx),
  ]),
);

const output = `export type WizardAffinity = {
  idx: number;
  name: string;
  affinity: {
    idx: string;
    name: string;
  } | null;
  traitsInAffinity: number;
  numberOfTraits: number;
  attunement: number;
};

export const wizardAffinities: Record<number, WizardAffinity> = ${toObjectLiteral(
  wizardAffinities,
)};
`;

fs.writeFileSync(outputPath, output, "utf-8");

console.log(`Generated ${wizards.length} wizard affinities at ${outputPath}`);
