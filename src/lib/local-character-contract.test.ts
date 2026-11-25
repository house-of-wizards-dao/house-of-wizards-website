import { frwcAddresses } from "@/config/addresses";
import { localCharacterCollection } from "./local-character-contract";

it("maps local character contracts in any letter case", () => {
  expect(localCharacterCollection(frwcAddresses.wizards)).toBe("wizards");
  expect(localCharacterCollection(frwcAddresses.warriors.toLowerCase())).toBe(
    "warriors",
  );
  expect(localCharacterCollection(frwcAddresses.souls)).toBe("souls");
  expect(localCharacterCollection(frwcAddresses.beasts)).toBeNull();
});
