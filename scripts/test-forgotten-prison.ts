import assert from "node:assert/strict";
import { get as httpGet } from "node:http";
import { mkdir } from "node:fs/promises";
import { chromium, expect, type Page } from "@playwright/test";
import { prisonAbi } from "../src/lib/forgotten-prison/abi";
import { COLLECTIONS, ERC721_ABI } from "../src/lib/forgotten-prison/config";
import {
  localChain,
  loadDeployment,
  saveDeployment,
} from "../src/lib/forgotten-prison/local-chain";
import type {
  PrisonCommand,
  PrisonState,
} from "../src/lib/forgotten-prison/controller";

const base = "http://127.0.0.1:3000";
const endpoint = `${base}/api/forgotten-prison/local`;
const state = async (): Promise<PrisonState> => {
  const response = await fetch(endpoint);
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
};
const command = async (body: PrisonCommand, expectedError?: string) => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (expectedError) {
    assert.equal(response.status, 400);
    assert.match(result.error, new RegExp(expectedError));
  } else assert.equal(response.status, 200, JSON.stringify(result));
  return result;
};
const call = (
  account: `0x${string}`,
  functionName: string,
  args: string[] = [],
  value = "0",
  error?: string,
) => command({ action: "call", account, functionName, args, value }, error);
const click = async (page: Page, name: string) => {
  const button = page.getByRole("button", { name, exact: true });
  const response = page.waitForResponse(
    (response) =>
      response.url() === endpoint && response.request().method() === "POST",
  );
  await button.click();
  const result = await response;
  assert.equal(result.status(), 200, await result.text());
  await expect(button).toBeEnabled();
};

await state();
await mkdir(".local", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PRISON_BROWSER_EXECUTABLE
    ? { executablePath: process.env.PRISON_BROWSER_EXECUTABLE }
    : {}),
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const pageErrors: string[] = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
try {
  await command({ action: "reset" });
  const initial = await state();
  const deployment = await loadDeployment();
  try {
    await saveDeployment({ ...deployment, snapshot: "0xffffffffffff" });
    await command({ action: "reset" }, "snapshot no longer exists");
    assert.equal((await loadDeployment()).snapshot, "0xffffffffffff");
  } finally {
    await saveDeployment(deployment);
  }
  console.log(
    "PASS: invalid reset snapshot fails without overwriting the baseline",
  );
  const [owner, alice, bob, nextOwner] = initial.accounts.map(
    (account) => account.address,
  );
  const ownerOf = (collection: `0x${string}`, tokenId: string) =>
    localChain.readContract({
      address: collection,
      abi: ERC721_ABI,
      functionName: "ownerOf",
      args: [BigInt(tokenId)],
    });
  for (const pool of initial.deployment.seeded) {
    assert.equal(
      await localChain.readContract({
        address: pool.collection,
        abi: ERC721_ABI,
        functionName: "balanceOf",
        args: [initial.deployment.address],
      }),
      BigInt(pool.tokenIds.length),
    );
    assert.equal(
      await localChain.readContract({
        address: pool.collection,
        abi: ERC721_ABI,
        functionName: "balanceOf",
        args: [initial.deployment.donor],
      }),
      0n,
    );
  }
  console.log(
    "PASS: all discovered NFTs are in prison custody; donor balances are zero on the fork",
  );

  const invalidHeaders: HeadersInit[] = [
    { Origin: "https://untrusted.example" },
    { "Sec-Fetch-Site": "cross-site" },
  ];
  for (const headers of invalidHeaders) {
    const response = await fetch(endpoint, { headers });
    assert.equal(response.status, 404);
  }
  // Fetch controls Host itself; raw HTTP is needed to actually send a foreign host.
  const foreignHostStatus = await new Promise<number | undefined>(
    (resolve, reject) => {
      httpGet(
        endpoint,
        { headers: { Host: "untrusted.example" } },
        (response) => {
          response.resume();
          resolve(response.statusCode);
        },
      ).on("error", reject);
    },
  );
  assert.equal(foreignHostStatus, 404);
  const formPost = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: '{"action":"reset"}',
  });
  assert.equal(formPost.status, 415);
  await call(owner, "notAFunction", [], "0", "Unknown");
  console.log(
    "PASS: local API rejects foreign origins, foreign hosts, cross-site requests and unknown functions",
  );

  await page.goto(`${base}/magic/prison-test`);
  await expect(
    page.getByRole("heading", {
      name: "Forgotten Prison · Test lab",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("Available prizes")).toHaveText(
    initial.prizeCount,
  );
  assert.equal(
    await page.locator('form[data-testid^="function-"]').count(),
    prisonAbi.filter((item) => item.type === "function").length,
  );
  await page.getByLabel("Bid ETH").fill("0.1");
  await click(page, "bid()");
  await page.getByLabel("Active account").selectOption(bob);
  await page.getByLabel("Bid ETH").fill("0.2");
  await click(page, "bid()");
  await call(alice, "startDailyDraw", [], "0", "TooEarly");
  await click(page, "Advance to next cutoff");
  await click(page, "startDailyDraw()");
  let current = await state();
  assert.equal(current.draws[0].winner.toLowerCase(), bob.toLowerCase());
  assert.equal(current.draws[0].price, "200000000000000000");
  assert.equal(current.accounts[1].bid, "100000000000000000");
  await call(alice, "finalizeDraw", [], "0", "RandomnessNotReady");
  await call(
    owner,
    "recoverUnsoldNFT",
    [current.inventory[0].collection, current.inventory[0].tokenId, owner],
    "0",
    "NotClosed",
  );
  await page
    .getByRole("button", { name: "Generate random values", exact: true })
    .click();
  await page.getByLabel("Main random word").fill("123");
  await page.getByLabel("Bonus random word").fill("456");
  await click(page, "Callback with VRF");
  assert.equal((await state()).draws[0].status, 2);
  await click(page, "finalizeDraw()");
  current = await state();
  const awarded = current.draws[0];
  assert.equal(current.prizeCount, String(Number(initial.prizeCount) - 1));
  assert.equal(current.boxCount, String(Number(initial.boxCount) - 1));
  assert.equal(awarded.bonusAwarded, true);
  await call(alice, "claimNFT", ["1", alice], "0", "NotWinner");
  await click(page, "claimNFT()");
  await click(page, "claimBonus()");
  assert.equal(
    (await ownerOf(awarded.collection, awarded.tokenId)).toLowerCase(),
    bob.toLowerCase(),
  );
  assert.equal(
    (await ownerOf(COLLECTIONS["Imp boxes"], awarded.boxTokenId)).toLowerCase(),
    bob.toLowerCase(),
  );
  await call(bob, "claimNFT", ["1", bob], "0", "AlreadyClaimed");
  await command({
    action: "fulfill",
    requestId: awarded.requestId,
    words: ["999", "999"],
  });
  assert.equal((await state()).draws[0].randomWord, "123");
  console.log(
    "PASS: browser bids → cutoff → request → mock callback → finalize → both claims; losing bid rolls over; invalid and duplicate calls behave correctly",
  );

  await page.getByLabel("Donation collection").selectOption(awarded.collection);
  await page.getByLabel("Donation token ID").fill(awarded.tokenId);
  await click(page, "transferFrom() without registration");
  assert.equal(
    (await state()).prizeCount,
    String(Number(initial.prizeCount) - 1),
  );
  await page
    .getByLabel("syncReceivedNFT collection", { exact: true })
    .fill(awarded.collection);
  await page
    .getByLabel("syncReceivedNFT tokenId", { exact: true })
    .fill(awarded.tokenId);
  await click(page, "syncReceivedNFT()");
  assert.equal((await state()).prizeCount, initial.prizeCount);
  await command({
    action: "donate",
    account: bob,
    collection: COLLECTIONS["Imp boxes"],
    tokenId: awarded.boxTokenId,
    safe: true,
  });
  assert.equal((await state()).boxCount, initial.boxCount);
  await call(bob, "claimNFT", ["1", bob], "0", "AlreadyClaimed");
  await page.getByLabel("Active account").selectOption(alice);
  await click(page, "cancelBid()");
  assert.equal((await state()).totalBidEscrow, "0");
  await page.getByLabel("Active account").selectOption(owner);
  await click(page, "withdrawProceeds()");
  assert.equal((await state()).balance, "0");
  console.log(
    "PASS: plain and safe NFT returns, sync, consumed historical claims, bid cancellation and proceeds withdrawal",
  );

  await page
    .getByLabel("transferOwnership newOwner", { exact: true })
    .fill(nextOwner);
  await click(page, "transferOwnership()");
  assert.equal((await state()).owner.toLowerCase(), owner.toLowerCase());
  await page.getByLabel("Active account").selectOption(nextOwner);
  await click(page, "acceptOwnership()");
  assert.equal((await state()).owner.toLowerCase(), nextOwner.toLowerCase());
  await click(page, "renounceOwnership()");
  assert.equal(
    (await state()).owner,
    "0x0000000000000000000000000000000000000000",
  );
  await click(page, "Reset to seeded deployment");
  assert.equal((await state()).owner.toLowerCase(), owner.toLowerCase());
  console.log(
    "PASS: browser ownership nomination, acceptance, renunciation and reset",
  );

  await call(alice, "bid", [], "0.3");
  await call(bob, "bid", [], "0.1");
  await command({ action: "cutoff" });
  await call(bob, "startDailyDraw");
  await call(bob, "shutdownStalledAuction", [], "0", "CannotShutdown");
  await command({ action: "advance", seconds: 7 * 86400 + 1 });
  await call(bob, "shutdownStalledAuction");
  current = await state();
  assert.equal(current.closed, true);
  assert.equal(current.draws[0].status, 4);
  assert.equal(current.accounts[1].refund, "300000000000000000");
  await call(alice, "withdrawRefund", [alice]);
  await call(bob, "cancelBid", [bob]);
  const recovered = current.inventory[0];
  await call(
    bob,
    "recoverUnsoldNFT",
    [recovered.collection, recovered.tokenId, bob],
    "0",
    "OwnableUnauthorizedAccount",
  );
  await call(owner, "recoverUnsoldNFT", [
    recovered.collection,
    recovered.tokenId,
    owner,
  ]);
  assert.equal(
    (await ownerOf(recovered.collection, recovered.tokenId)).toLowerCase(),
    owner.toLowerCase(),
  );
  assert.equal((await state()).balance, "0");
  await call(alice, "bid", [], "0.1", "AuctionClosed");
  console.log(
    "PASS: requested-draw timeout, permanent closure, refund, standing-bid cancellation and owner-only unsold recovery",
  );

  await command({ action: "reset" });
  await command({ action: "cutoff" });
  await call(alice, "startDailyDraw");
  assert.equal((await state()).drawCount, "0");
  await call(alice, "bid", [], "0.1");
  await command({ action: "cutoff" });
  await call(alice, "startDailyDraw");
  await command({ action: "fulfill", words: ["0", "1"] });
  await command({ action: "advance", seconds: 7 * 86400 + 1 });
  await call(owner, "shutdownStalledAuction", [], "0", "CannotShutdown");
  await call(alice, "finalizeDraw");
  current = await state();
  assert.equal(current.draws[0].bonusAwarded, false);
  await call(alice, "claimBonus", ["1", alice], "0", "NoBonus");
  await command({ action: "advance", seconds: 7 * 86400 + 1 });
  await call(owner, "shutdownStalledAuction");
  await call(
    owner,
    "recoverUnsoldNFT",
    [current.draws[0].collection, current.draws[0].tokenId, owner],
    "0",
    "InvalidToken",
  );
  await call(alice, "claimNFT", ["1", alice]);
  console.log(
    "PASS: empty day, odd-word no-bonus draw, Ready cannot abort, reserved prize protected and winner can claim after shutdown",
  );

  // Every view accessor is available and decodes via the same ABI used for deployment.
  current = await state();
  for (const fn of prisonAbi) {
    if (fn.type !== "function" || fn.stateMutability !== "view") continue;
    const args = fn.inputs.map((input) =>
      input.type === "address" ? alice : input.name === "drawId" ? "1" : "0",
    );
    await call(alice, fn.name, args);
  }
  await call(
    alice,
    "rawFulfillRandomWords",
    ["1", "[1,2]"],
    "0",
    "OnlyCoordinatorCanFulfill",
  );
  await call(
    alice,
    "onERC721Received",
    [alice, alice, "1", "0x"],
    "0",
    "AuctionClosed",
  );
  console.log(
    "PASS: all view functions and direct callback access restrictions",
  );

  await command({ action: "reset" });
  await page.reload();
  await expect(page.getByTestId("Available prizes")).toHaveText(
    initial.prizeCount,
  );
  await page.screenshot({ path: ".local/prison-desktop.png", fullPage: true });
  await page.screenshot({ path: ".local/prison-preview.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("heading", {
      name: "Forgotten Prison · Test lab",
      exact: true,
    }),
  ).toBeVisible();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    "Mobile layout must not overflow horizontally",
  );
  await page.screenshot({ path: ".local/prison-mobile.png", fullPage: true });
  assert.deepEqual(pageErrors, []);
  console.log(
    "PASS: desktop/mobile page, no uncaught browser errors, seeded state restored",
  );
} finally {
  await command({ action: "reset" });
  await browser.close();
}
