import { artworkTitle } from "./art-titles";

const subject = (collection: string, id: string) => ({
  collection,
  asset_identifier: id,
});
describe("artwork character titles", () => {
  it("uses the local full character name for a single subject", () => {
    expect(artworkTitle("commission filename", [subject("wizards", "1")])).toBe(
      "Evil Arcanist Black Goat of the Wood",
    );
  });
  it("keeps collection identities distinct for the same token number", () => {
    expect(artworkTitle("fallback", [subject("warriors", "1")])).toBe(
      "Gligamesh",
    );
  });
  it("labels group portraits by their represented collections", () => {
    expect(
      artworkTitle("fallback", [
        subject("wizards", "1"),
        subject("warriors", "1"),
      ]),
    ).toBe("Various wizards and warriors");
    expect(
      artworkTitle("fallback", [
        subject("wizards", "1"),
        subject("wizards", "2"),
      ]),
    ).toBe("Various wizards");
  });
  it("recognizes a complete local name in the reviewed source when token links are absent", () => {
    expect(
      artworkTitle(
        "fallback",
        [],
        "Portrait of Evil Arcanist Black Goat of the Wood",
      ),
    ).toBe("Evil Arcanist Black Goat of the Wood");
  });
  it("retains the existing title when no character can be identified", () => {
    expect(artworkTitle("The Summoning", [])).toBe("The Summoning");
    expect(artworkTitle("The Summoning", [subject("wizards", "999999")])).toBe(
      "The Summoning",
    );
  });
});
