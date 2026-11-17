import { test, expect } from "@playwright/test";
import { collections } from "../../src/config/marketplace";
import type { MarketplaceItem } from "../../src/types/marketplace";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/auth/session", (route) =>
    route.fulfill({ json: null }),
  );
  await page.route("**/api/lore", (route) => route.fulfill({ json: [] }));
});

test("home renders responsive images and opens the wallet on the first click", async ({
  page,
  isMobile,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Cult Content Chronicle" }),
  ).toBeVisible();
  await expect(page.getByAltText("House of Wizards Banner")).toHaveJSProperty(
    "complete",
    true,
  );
  const hero = page.getByAltText("House of Wizards Banner");
  expect(
    await hero.evaluate((image) => (image as HTMLImageElement).currentSrc),
  ).toContain("/_next/image?");
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await expect(
      page.getByRole("dialog", { name: "Mobile navigation" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "Mobile navigation" }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
  }
  await page
    .getByRole("button", {
      name: isMobile ? "Wallet" : "Connect Wallet",
      exact: true,
    })
    .last()
    .click();
  await expect(
    page.getByRole("dialog").filter({ hasText: "Connect a Wallet" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("marketplace paginates and filters without shipping the character database", async ({
  page,
  isMobile,
}) => {
  const collection = collections.warriors;
  const items: MarketplaceItem[] = Array.from({ length: 101 }, (_, id) => ({
    collection,
    nft: {
      identifier: String(id),
      name: `Fixture Warrior ${id}`,
      collection: collection.slug,
      contract: collection.address,
      token_standard: "erc721",
      image_url: "/img/logo-white.png",
      metadata_url: "",
      opensea_url: "",
      description: "",
      updated_at: "",
      is_disabled: false,
      is_nsfw: false,
      localTraitIds: { head: id % 2 ? 10 : 11 },
    },
    listings: [],
    offers: [],
    bestListing: {
      orderHash: `0x${id}`,
      chain: "ethereum",
      protocol: "seaport",
      price: { amount: "1000000000000000000", currency: "ETH", decimals: 18 },
      startTime: "2026-01-01",
      expirationTime: "2030-01-01",
      maker: "0x0000000000000000000000000000000000000001",
    },
  }));
  await page.route("**/api/marketplace/listings?**", (route) =>
    route.fulfill({ json: { collection, listings: items, next: null } }),
  );
  await page.route("**/api/marketplace/nftx?**", (route) =>
    route.fulfill({ json: { listings: [], hasVault: false, vault: null } }),
  );
  await page.route("**/api/characters/warriors/traits", (route) =>
    route.fulfill({
      json: {
        head: [
          { value: 10, label: "Test head" },
          { value: 11, label: "Other head" },
        ],
      },
    }),
  );
  await page.goto("/marketplace");
  await page.waitForLoadState("networkidle");
  const scriptTransferBytes = await page.evaluate(() =>
    performance.getEntriesByType("resource").reduce((total, entry) => {
      if (
        entry instanceof PerformanceResourceTiming &&
        entry.name.includes("/_next/static/chunks/")
      )
        return total + entry.transferSize;
      return total;
    }, 0),
  );
  // Include automatic dynamic imports, which the initial-HTML bundle budget misses.
  expect(scriptTransferBytes).toBeGreaterThan(0);
  expect(scriptTransferBytes).toBeLessThan(550 * 1024);
  await page.getByRole("button", { name: "Warriors", exact: true }).click();
  await expect(page.getByText("Page 1 of 3", { exact: true })).toBeVisible();
  await page
    .getByRole("navigation", { name: "Marketplace pages" })
    .getByRole("button", { name: "Next", exact: true })
    .click();
  await expect(page.getByText("Page 2 of 3", { exact: true })).toBeVisible();
  await page.getByLabel("head", { exact: true }).selectOption("10");
  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Search by name").fill("Fixture Warrior 3");
  await expect(
    page.getByRole("img", { name: "Fixture Warrior 3", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Fixture Warrior 2", exact: true }),
  ).toHaveCount(0);
  if (isMobile)
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .getByRole("button", {
      name: isMobile ? "Wallet" : "Connect Wallet",
      exact: true,
    })
    .last()
    .click();
  await expect(
    page.getByRole("dialog").filter({ hasText: "Connect a Wallet" }),
  ).toBeVisible();
  await expect(page.getByPlaceholder("Search by name")).toHaveValue(
    "Fixture Warrior 3",
  );
});

test("character metadata endpoints return compact cached responses", async ({
  request,
}) => {
  const response = await request.get("/api/characters/wizards/0");
  expect(response.ok()).toBe(true);
  expect(response.headers()["cache-control"]).toContain("s-maxage=86400");
  const body = await response.body();
  expect(body.length).toBeLessThan(5000);
  expect((await response.json()).traits.length).toBeGreaterThan(0);
  expect(
    (await request.get("/api/characters/wizards/999999999")).status(),
  ).toBe(404);
  expect((await request.get("/api/characters/unknown/0")).status()).toBe(404);
});
