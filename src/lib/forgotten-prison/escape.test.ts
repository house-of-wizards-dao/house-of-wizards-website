import {
  claimWinnings,
  claimsComplete,
  pendingClaims,
  validDrawId,
  walletCharacters,
  type ClaimState,
} from "./escape";
import { frwcAddresses } from "@/config/addresses";
import type { OpenSeaNFT } from "@/lib/opensea-nfts";

const account = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const fresh = (): ClaimState => ({
  winner: account,
  status: 3,
  claimed: false,
  bonusAwarded: true,
  bonusClaimed: false,
});

it("claims both awards in order and verifies completion", async () => {
  const draw = fresh();
  const submitAndConfirm = jest.fn(async (name) => {
    if (name === "claimNFT") draw.claimed = true;
    else draw.bonusClaimed = true;
  });
  await claimWinnings({
    account,
    read: async () => ({ ...draw }),
    assertAccount: () => {},
    submitAndConfirm,
  });
  expect(submitAndConfirm.mock.calls.map(([name]) => name)).toEqual([
    "claimNFT",
    "claimBonus",
  ]);
  expect(claimsComplete(draw)).toBe(true);
});

it("resumes only the bonus after a rejected second transaction", async () => {
  const draw = fresh();
  const first = jest.fn(async (name) => {
    if (name === "claimNFT") draw.claimed = true;
    else throw new Error("User rejected");
  });
  await expect(
    claimWinnings({
      account,
      read: async () => ({ ...draw }),
      assertAccount: () => {},
      submitAndConfirm: first,
    }),
  ).rejects.toThrow("User rejected");
  expect(pendingClaims(draw)).toEqual(["claimBonus"]);
  const retry = jest.fn(async () => {
    draw.bonusClaimed = true;
  });
  await claimWinnings({
    account,
    read: async () => ({ ...draw }),
    assertAccount: () => {},
    submitAndConfirm: retry,
  });
  expect(retry).toHaveBeenCalledTimes(1);
  expect(retry).toHaveBeenCalledWith("claimBonus");
});

it("never submits a bonus that was not awarded or resends completed claims", async () => {
  const draw = { ...fresh(), bonusAwarded: false };
  const submitAndConfirm = jest.fn(async () => {
    draw.claimed = true;
  });
  const options = {
    account,
    read: async () => ({ ...draw }),
    assertAccount: () => {},
    submitAndConfirm,
  };
  await claimWinnings(options);
  await claimWinnings(options);
  expect(submitAndConfirm).toHaveBeenCalledTimes(1);
  expect(submitAndConfirm).toHaveBeenCalledWith("claimNFT");
});

it.each<Partial<ClaimState>>([
  { winner: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" },
  { status: 2 },
])("rejects unauthorized or unsettled draws", async (change) => {
  const submitAndConfirm = jest.fn();
  await expect(
    claimWinnings({
      account,
      read: async () => ({ ...fresh(), ...change }),
      assertAccount: () => {},
      submitAndConfirm,
    }),
  ).rejects.toThrow();
  expect(submitAndConfirm).not.toHaveBeenCalled();
});

it("stops if the account or chain changes between claims", async () => {
  const draw = fresh();
  let changed = false;
  const submitAndConfirm = jest.fn(async () => {
    draw.claimed = true;
    changed = true;
  });
  await expect(
    claimWinnings({
      account,
      read: async () => ({ ...draw }),
      assertAccount: () => {
        if (changed) throw new Error("Wallet changed");
      },
      submitAndConfirm,
    }),
  ).rejects.toThrow("Wallet changed");
  expect(submitAndConfirm).toHaveBeenCalledTimes(1);
});

it("does not reveal winnings if confirmation did not update the chain", async () => {
  await expect(
    claimWinnings({
      account,
      read: async () => fresh(),
      assertAccount: () => {},
      submitAndConfirm: async () => {},
    }),
  ).rejects.toThrow("still awaiting confirmation");
});

it("selects only supported characters and deduplicates them", () => {
  const nft = (contract: string, identifier: string): OpenSeaNFT => ({
    contract,
    identifier,
    collection: "",
    token_standard: "erc721",
    name: "A visitor",
    description: "",
    image_url: "",
    metadata_url: "",
    opensea_url: "",
    updated_at: "",
    is_disabled: false,
    is_nsfw: false,
  });
  const result = walletCharacters({
    all: [
      nft(frwcAddresses.wizards, "0"),
      nft(frwcAddresses.wizards, "0"),
      nft(frwcAddresses.souls, "10"),
      nft(frwcAddresses.warriors, "9662"),
      nft(frwcAddresses.impBox, "1"),
    ],
  });
  expect(result.map((character) => character.family)).toEqual([
    "wizards",
    "souls",
    "warriors",
  ]);
  expect(validDrawId("1")).toBe("1");
  expect(validDrawId("-1")).toBeUndefined();
  expect(validDrawId("1e3")).toBeUndefined();
});
