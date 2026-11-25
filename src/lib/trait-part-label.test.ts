import { formatTraitPart } from "./trait-part-label";

it("capitalizes the stored part and does not rename companion", () => {
  expect(formatTraitPart("companion")).toBe("Companion");
  expect(formatTraitPart("familiar")).toBe("Familiar");
  expect(formatTraitPart("head")).toBe("Head");
});
