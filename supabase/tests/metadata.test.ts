import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchPrisonCharacters } from "../functions/prison-indexer/metadata.ts";

const collection = "0x9690b63eb85467be5267a3603f770589ab12dc95";
const tokens = [{ collection, token_id: "5437" }];
const character = {
  collection,
  tokenId: "5437",
  name: "Test Warrior",
  imageUrl: "https://portal.forgottenrunes.com/api/warriors/img/5437.png",
};
test("no missing tokens means no metadata requests", async () => {
  assert.deepEqual(
    await fetchPrisonCharacters([], async () => {
      throw new Error("Unexpected request");
    }),
    [],
  );
});
test("new metadata is fetched once as a bounded batch with no credentials", async () => {
  const rows = await fetchPrisonCharacters(tokens, async (url, init) => {
    assert.equal(
      url,
      "https://www.houseofwizards.xyz/api/forgotten-prison/characters",
    );
    assert.deepEqual(init?.headers, { "Content-Type": "application/json" });
    assert.deepEqual(JSON.parse(String(init?.body)), {
      tokens: [{ collection, tokenId: "5437" }],
    });
    return Response.json({ characters: [character] });
  });
  assert.equal(rows[0].name, character.name);
  assert.equal(rows[0].token_id, "5437");
  assert.equal(rows[0].image_url, character.imageUrl);
});
test("failed, malformed or mismatched catalog responses cannot populate the database", async () => {
  for (const response of [
    new Response("Unavailable", { status: 503 }),
    Response.json({ characters: [{ ...character, tokenId: "999" }] }),
    Response.json({
      characters: [
        { ...character, imageUrl: "https://attacker.example/image" },
      ],
    }),
    Response.json({ characters: [character, character] }),
  ])
    await assert.rejects(fetchPrisonCharacters(tokens, async () => response));
});
