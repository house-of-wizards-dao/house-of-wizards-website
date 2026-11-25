import { soulsWithTraitsMap } from "@/data/soulsWithTraitsMap";
import { traitRarity } from "@/data/traitRarity";
import { warriorsWithTraitsMap } from "@/data/warriorsWithTraitsMap";
import { wizardsWithTraitsMap } from "@/data/wizardsWithTraitsMap";
import { EMPTY_TRAIT_ID } from "@/lib/trait-rarity";

const countPart = (
  tokens: readonly { [key: string]: unknown }[],
  part: string,
  traitId: number,
) => tokens.filter((token) => token[part] === traitId).length;

it("matches direct counts for wizards, warriors, and souls", () => {
  const wizard = wizardsWithTraitsMap["0"];
  const warrior = warriorsWithTraitsMap["0"];
  const wizards = Object.values(wizardsWithTraitsMap);
  const warriors = Object.values(warriorsWithTraitsMap);
  const souls = Object.values(soulsWithTraitsMap);
  const soul = souls.find((entry) => entry.undesirable !== EMPTY_TRAIT_ID);

  expect(traitRarity.wizards.total).toBe(wizards.length);
  expect(traitRarity.warriors.total).toBe(warriors.length);
  expect(traitRarity.souls.total).toBe(souls.length);
  expect(traitRarity.wizards.parts.head[String(wizard.head)]).toBe(
    countPart(wizards, "head", wizard.head),
  );
  expect(traitRarity.warriors.parts.companion[String(warrior.companion)]).toBe(
    countPart(warriors, "companion", warrior.companion),
  );
  expect(soul).toBeDefined();
  expect(traitRarity.souls.parts.undesirable[String(soul?.undesirable)]).toBe(
    countPart(souls, "undesirable", soul?.undesirable ?? EMPTY_TRAIT_ID),
  );
  expect(
    traitRarity.wizards.parts.head[String(EMPTY_TRAIT_ID)],
  ).toBeUndefined();
  expect(traitRarity.wizards.parts.background).toBeUndefined();
});

it("gives both Purple Yoga bodies the summed rarity", () => {
  expect(traitRarity.wizards.parts.body["31"]).toBe(124);
  expect(traitRarity.wizards.parts.body["32"]).toBe(124);
  expect(traitRarity.wizards.parts.head["170"]).toBe(26);
});
