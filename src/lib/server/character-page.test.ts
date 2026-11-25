jest.mock("server-only", () => ({}));
jest.mock("@tokenbound/sdk", () => ({
  TokenboundClient: class {
    getAccount() {
      return "0x0000000000000000000000000000000000000001";
    }
  },
}));

import { frwcAddresses } from "@/config/addresses";
import { traitRarity } from "@/data/traitRarity";
import { getCharacterPageData } from "./character-page";
import { getLocalNftMetadata } from "./character-metadata";

it("attaches the per-id rarity count on the character page", () => {
  const wizard = getCharacterPageData(frwcAddresses.wizards, "0");
  const head = wizard.characterTraits.find((trait) => trait.partKey === "head");

  expect(head?.displayName).toBe("Illuminatus");
  expect(head?.traitId).toBe(170);
  expect(head?.count).toBe(traitRarity.wizards.parts.head["170"]);
  expect(head?.total).toBe(traitRarity.wizards.total);
  expect(head?.part).toBe("Head");
});

it("keeps a warrior companion on its own part", () => {
  const warrior = getCharacterPageData(frwcAddresses.warriors, "0");
  const companion = warrior.characterTraits.find(
    (trait) => trait.partKey === "companion",
  );

  expect(companion?.part).toBe("Companion");
  expect(companion?.traitId).toBe(198);
  expect(companion?.count).toBe(traitRarity.warriors.parts.companion["198"]);
});

it("reads traits and affinity from the shared local resolver", () => {
  const page = getCharacterPageData(frwcAddresses.souls, "10");
  const local = getLocalNftMetadata("souls", "10");

  expect(page.characterTraits).toEqual(local?.traits);
  expect(page.characterAffinity).toEqual(local?.affinity);
});

it("has no traits or affinity for collections without local maps", () => {
  const page = getCharacterPageData(frwcAddresses.beasts, "0");

  expect(page.characterTraits).toEqual([]);
  expect(page.characterAffinity).toBeNull();
});
