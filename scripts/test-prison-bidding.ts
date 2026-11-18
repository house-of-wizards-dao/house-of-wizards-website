import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { formatEther, parseEther } from "viem";
import {
  localChain,
  loadDeployment,
  revertSnapshot,
} from "../src/lib/forgotten-prison/local-chain";
import { ERC721_ABI, COLLECTIONS } from "../src/lib/forgotten-prison/config";
import type {
  PrisonCommand,
  PrisonState,
} from "../src/lib/forgotten-prison/controller";

const base = "http://127.0.0.1:3000";
const state = async (): Promise<PrisonState> => {
  const response = await fetch(`${base}/api/forgotten-prison/local`);
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
};
const command = async (body: PrisonCommand) => {
  const response = await fetch(`${base}/api/forgotten-prison/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, 200, await response.clone().text());
  return response.json();
};
const initial = await state();
await loadDeployment();
const snapshot = await localChain.snapshot();
const testAccount = initial.accounts[7].address;
const call = (functionName: string) =>
  command({
    action: "call",
    account: testAccount,
    functionName,
    args: [],
    value: "0",
  });
await mkdir(".local", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PRISON_BROWSER_EXECUTABLE
    ? { executablePath: process.env.PRISON_BROWSER_EXECUTABLE }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
});
const page = await context.newPage();
const errors: string[] = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  assert.equal(
    initial.closed,
    false,
    "Use an open fork for the bidding flow test.",
  );
  // Settle any existing pending draw only inside our temporary snapshot.
  if (initial.pendingDrawId !== "0") {
    if (
      initial.draws.find((draw) => draw.id === initial.pendingDrawId)
        ?.status === 1
    )
      await command({ action: "fulfill", words: ["1", "1"] });
    await call("finalizeDraw");
  }
  let prepared = await state();
  if (BigInt(prepared.timestamp) >= BigInt(prepared.nextDrawAt)) {
    await call("startDailyDraw");
    prepared = await state();
    if (prepared.pendingDrawId !== "0") {
      await command({ action: "fulfill", words: ["1", "1"] });
      await call("finalizeDraw");
    }
  }

  // Test-only injected wallet; never included in application code. It refuses
  // all writes except to this local prison on chain 31337 and never signs SIWE.
  const installWallet = ({ account, prison }: { account: string; prison: string }) => {
      type Listener = (...args: unknown[]) => void;
      let connected = false,
        chain = "0x1",
        rejectNext = false,
        sent = 0;
      const listeners = new Map<string, Set<Listener>>();
      const emit = (event: string, value: unknown) =>
        listeners.get(event)?.forEach((listener) => listener(value));
      const provider = {
        isMetaMask: true,
        isConnected: () => true,
        on: (event: string, listener: Listener) => {
          if (!listeners.has(event)) listeners.set(event, new Set());
          listeners.get(event)?.add(listener);
        },
        removeListener: (event: string, listener: Listener) => {
          listeners.get(event)?.delete(listener);
        },
        request: async ({
          method,
          params = [],
        }: {
          method: string;
          params?: unknown[];
        }) => {
          if (method === "eth_accounts") return connected ? [account] : [];
          if (method === "eth_requestAccounts") {
            connected = true;
            emit("accountsChanged", [account]);
            return [account];
          }
          if (method === "eth_chainId") return chain;
          if (method === "wallet_switchEthereumChain") {
            const next = params[0] as { chainId: string };
            chain = next.chainId;
            emit("chainChanged", chain);
            return null;
          }
          if (method === "wallet_addEthereumChain") return null;
          if (method === "wallet_requestPermissions") {
            connected = true;
            emit("accountsChanged", [account]);
            return [
              {
                parentCapability: "eth_accounts",
                caveats: [
                  { type: "restrictReturnedAccounts", value: [account] },
                ],
              },
            ];
          }
          if (method === "wallet_getPermissions")
            return connected ? [{ parentCapability: "eth_accounts" }] : [];
          if (method === "wallet_getCapabilities") return {};
          if (method === "personal_sign" || method.startsWith("eth_sign"))
            throw new Error(
              "The bidder page must not request a login signature.",
            );
          if (method === "eth_sendTransaction") {
            const tx = params[0] as { to: string; from: string };
            if (
              chain !== "0x7a69" ||
              tx.to.toLowerCase() !== prison.toLowerCase() ||
              tx.from.toLowerCase() !== account.toLowerCase()
            )
              throw new Error("Test wallet blocked an unexpected transaction.");
            if (rejectNext) {
              rejectNext = false;
              throw Object.assign(new Error("User rejected request"), {
                code: 4001,
              });
            }
            sent++;
          }
          const response = await fetch("http://127.0.0.1:8545", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
          });
          const body = await response.json();
          if (body.error)
            throw Object.assign(new Error(body.error.message), {
              code: body.error.code,
            });
          return body.result;
        },
      };
      Object.defineProperty(window, "ethereum", {
        value: provider,
        configurable: true,
      });
      Object.defineProperty(window, "prisonTestWallet", {
        value: {
          reject: () => {
            rejectNext = true;
          },
          sent: () => sent,
        },
        configurable: true,
      });
      const announce = () =>
        window.dispatchEvent(
          new CustomEvent("eip6963:announceProvider", {
            detail: {
              info: {
                uuid: "ff6b4100-b1f7-4ef6-9f8b-fb9dbdd01864",
                name: "Local test wallet",
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><rect width='32' height='32' fill='purple'/></svg>",
                rdns: "test.qa.wallet",
              },
              provider,
            },
          }),
        );
      window.addEventListener("eip6963:requestProvider", announce);
      announce();
    };
  // tsx preserves function names with a helper; include it when serializing the
  // nested provider callbacks into a separate browser JavaScript context.
  await page.addInitScript({ content: `const __name = (fn) => fn; (${installWallet.toString()})(${JSON.stringify({ account: testAccount, prison: initial.deployment.address })});` });

  await page.goto(`${base}/magic/forgotten-prison`);
  await expect(
    page.getByRole("heading", { name: "Forgotten Prison", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("remaining-prizes")).not.toContainText("—", { timeout: 30_000 });
  assert.equal(
    await page
      .getByRole("button", { name: "Callback with VRF", exact: true })
      .count(),
    0,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Reset to seeded deployment", exact: true })
      .count(),
    0,
  );
  await page.screenshot({
    path: ".local/prison-bidding-desktop.png",
    fullPage: true,
  });
  await page.getByTestId("place-bid").click();
  await page
    .getByRole("button", { name: "Local test wallet", exact: true })
    .first()
    .click();
  await expect(page.getByTestId("place-bid")).toHaveText(
    "Switch to Local prison fork",
    { timeout: 20_000 },
  );
  await page.getByTestId("place-bid").click();
  await expect(page.getByTestId("place-bid")).not.toContainText("Switch");
  await expect(page.getByTestId("speed-up-draw")).toBeDisabled();
  assert.equal(
    await page.evaluate(() =>
      (
        window as unknown as { prisonTestWallet: { sent: () => number } }
      ).prisonTestWallet.sent(),
    ),
    0,
  );
  console.log(
    "PASS: public route has no lab controls; connect → switch network sends no transaction and requests no login signature",
  );

  prepared = await state();
  const originalBid = BigInt(
    prepared.accounts.find(
      (entry) => entry.address.toLowerCase() === testAccount.toLowerCase(),
    )?.bid ?? "0",
  );
  const added = BigInt(prepared.highestBid[1]) + parseEther("1");
  await page.getByLabel("ETH to add to your bid").fill("0.0000000000000000001");
  await expect(page.getByTestId("place-bid")).toBeDisabled();
  await page.getByLabel("ETH to add to your bid").fill(formatEther(added));
  await page.evaluate(() =>
    (
      window as unknown as { prisonTestWallet: { reject: () => void } }
    ).prisonTestWallet.reject(),
  );
  await page.getByTestId("place-bid").click();
  await expect(page.getByRole("alert").filter({ hasText: "cancelled in your wallet" })).toContainText(
    "cancelled in your wallet",
  );
  await expect(page.getByTestId("place-bid")).toBeEnabled();
  const clickAction = async (id: string, message: string) => {
    await page.getByTestId(id).click();
    await expect(
      page.getByRole("status").filter({ hasText: message }),
    ).toBeVisible({ timeout: 30_000 });
  };
  await clickAction("place-bid", "Your bid is confirmed.");
  await expect(page.getByTestId("standing-bid")).toHaveText(
    `${formatEther(originalBid + added)} ETH`,
  );
  await page.getByLabel("ETH to add to your bid").fill("0.1");
  await expect(page.getByTestId("new-bid-total")).toHaveText(
    `${formatEther(originalBid + added + parseEther("0.1"))} ETH`,
  );
  await clickAction("place-bid", "Your bid is confirmed.");
  await expect(page.getByTestId("standing-bid")).toHaveText(
    `${formatEther(originalBid + added + parseEther("0.1"))} ETH`,
  );
  console.log(
    "PASS: exact ETH validation, wallet rejection, bid confirmation and additive top-up",
  );

  await command({ action: "cutoff" });
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByTestId("place-bid")).toBeDisabled();
  await expect(page.getByTestId("withdraw-bid")).toBeDisabled();
  await expect(page.getByTestId("automation-countdown")).toContainText("Eligible in 00h 30m");
  await expect(page.getByTestId("speed-up-draw")).toBeEnabled();
  await page.screenshot({ path: ".local/prison-speed-up-start.png", fullPage: true });
  await clickAction("speed-up-draw", "The draw step is confirmed.");
  const drawId = (await state()).pendingDrawId;
  await expect(page.getByTestId("speed-up-draw")).toHaveCount(0);
  await command({ action: "fulfill", words: ["0", "2"] });
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByTestId("speed-up-draw")).toHaveText("Speed up · reveal prize");
  await expect(page.getByTestId("automation-countdown")).toContainText("Eligible in 00h");
  await page.screenshot({ path: ".local/prison-speed-up-finalize.png", fullPage: true });
  await clickAction("speed-up-draw", "The draw is finalized.");
  await expect(page.getByTestId(`claim-prize-${drawId}`)).toBeVisible({
    timeout: 15_000,
  });
  const won = (await state()).draws.find((draw) => draw.id === drawId);
  assert.ok(won);
  assert.equal(won.winner.toLowerCase(), testAccount.toLowerCase());
  await clickAction(
    `claim-prize-${drawId}`,
    "Your prisoner has been transferred to your wallet.",
  );
  assert.equal(
    (
      await localChain.readContract({
        address: won.collection,
        abi: ERC721_ABI,
        functionName: "ownerOf",
        args: [BigInt(won.tokenId)],
      })
    ).toLowerCase(),
    testAccount.toLowerCase(),
  );
  if (won.bonusAwarded) {
    await clickAction(
      `claim-box-${drawId}`,
      "Your Imp Box has been transferred to your wallet.",
    );
    assert.equal(
      (
        await localChain.readContract({
          address: COLLECTIONS["Imp boxes"],
          abi: ERC721_ABI,
          functionName: "ownerOf",
          args: [BigInt(won.boxTokenId)],
        })
      ).toLowerCase(),
      testAccount.toLowerCase(),
    );
  }
  console.log(
    "PASS: cutoff locks bids; both speed-up actions work before automation with a countdown; VRF wait hides the action; NFT and bonus claims transfer to the connected wallet",
  );

  await page.getByLabel("ETH to add to your bid").fill("0.2");
  await clickAction("place-bid", "Your bid is confirmed.");
  await clickAction(
    "withdraw-bid",
    "Your standing bid has been returned to your wallet.",
  );
  await expect(page.getByTestId("standing-bid")).toHaveText("0 ETH");
  prepared = await state();
  await page
    .getByLabel("ETH to add to your bid")
    .fill(formatEther(BigInt(prepared.highestBid[1]) + parseEther("1")));
  await clickAction("place-bid", "Your bid is confirmed.");
  await command({ action: "cutoff" });
  await call("startDailyDraw");
  await command({ action: "advance", seconds: 7 * 86400 + 1 });
  await call("shutdownStalledAuction");
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByTestId("withdraw-refund")).toBeEnabled();
  await clickAction(
    "withdraw-refund",
    "Your refund has been returned to your wallet.",
  );
  await expect(page.getByTestId("refund-amount")).toHaveText("0 ETH");
  await expect(page.getByTestId("place-bid")).toBeDisabled();
  console.log(
    "PASS: standing-bid withdrawal, aborted-draw refund, closed-state bidding guard",
  );

  const lab = await context.newPage();
  await lab.goto(`${base}/magic/prison-test`);
  await expect(
    lab.getByRole("heading", {
      name: "Forgotten Prison · Test lab",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    lab.getByRole("button", { name: "Callback with VRF", exact: true }),
  ).toBeVisible();
  await lab.close();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
    true,
    "No horizontal overflow on mobile",
  );
  await page.screenshot({
    path: ".local/prison-bidding-mobile.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: developer route retained, responsive bidder page, no uncaught browser errors",
  );
} catch (error) {
  console.log("Browser errors:", errors);
  await page.screenshot({
    path: ".local/prison-bidding-failure.png",
    fullPage: true,
  });
  console.log((await page.locator("body").innerText()).slice(-7000));
  throw error;
} finally {
  await browser.close();
  await revertSnapshot(snapshot);
  const restored = await state();
  assert.equal(restored.totalBidEscrow, initial.totalBidEscrow);
  assert.equal(restored.drawCount, initial.drawCount);
  assert.equal(restored.prizeCount, initial.prizeCount);
  assert.equal(restored.boxCount, initial.boxCount);
  console.log("Original user fork state restored.");
}
