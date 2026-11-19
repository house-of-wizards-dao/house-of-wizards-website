import assert from "node:assert/strict";
import { test } from "node:test";
import { readKeeperDeferral } from "../functions/prison-keeper/defer.ts";

const now = Date.parse("2026-11-19T21:31:00Z");
const seconds = Math.floor(now / 1000);
const iso = (offset: number) => new Date(now + offset * 1000).toISOString();
const fixture = () => ({
  cursor_block: 100,
  head_block: 100,
  indexed_at: iso(-5),
  block_timestamp: iso(-12),
  snapshot: {
    closed: false,
    prizeCount: "354",
    pendingDrawId: "0",
    pendingStatus: 0,
    nextDrawAt: String(seconds + 3600),
  },
});
const noCallback = async () => {
  throw new Error("No callback lookup expected");
};

test("a fresh index defers quiet periods but stops deferring one minute before a due start", async () => {
  const index = fixture();
  assert.equal(
    (await readKeeperDeferral(async () => index, noCallback, now))?.status,
    "waiting_for_cutoff",
  );
  index.snapshot.nextDrawAt = String(seconds - 1739);
  assert.equal(
    (await readKeeperDeferral(async () => index, noCallback, now))?.status,
    "waiting_for_start_delay",
  );
  index.snapshot.nextDrawAt = String(seconds - 1740);
  assert.equal(
    await readKeeperDeferral(async () => index, noCallback, now),
    null,
  );
  index.snapshot.nextDrawAt = String(seconds - 1800);
  assert.equal(
    await readKeeperDeferral(async () => index, noCallback, now),
    null,
  );
});

test("stale, incomplete, future, malformed, and unavailable indexes fall back to live checks", async () => {
  for (const index of [
    null,
    {},
    { ...fixture(), indexed_at: iso(-181) },
    { ...fixture(), block_timestamp: iso(-181) },
    { ...fixture(), indexed_at: iso(1) },
    { ...fixture(), head_block: 101 },
    { ...fixture(), snapshot: null },
  ]) {
    assert.equal(
      await readKeeperDeferral(async () => index, noCallback, now),
      null,
    );
  }
  assert.equal(
    await readKeeperDeferral(
      async () => {
        throw new Error("DB unavailable");
      },
      noCallback,
      now,
    ),
    null,
  );
});

test("the watchdog runs live checks every fifteen minutes even with a healthy index", async () => {
  const auditTime = Date.parse("2026-11-19T21:45:00Z");
  assert.equal(
    await readKeeperDeferral(
      async () => {
        throw new Error("No DB query expected");
      },
      noCallback,
      auditTime,
    ),
    null,
  );
});

test("VRF-ready deferral uses the callback timestamp and never defers missing or mismatched data", async () => {
  const index = fixture();
  index.snapshot.pendingDrawId = "1";
  index.snapshot.pendingStatus = 1;
  assert.equal(
    (await readKeeperDeferral(async () => index, noCallback, now))?.status,
    "waiting_for_vrf",
  );
  index.snapshot.pendingStatus = 2;
  const callback = {
    block_number: 90,
    block_timestamp: iso(-1000),
    args: { drawId: "1" },
  };
  const result = await readKeeperDeferral(
    async () => index,
    async (drawId) => {
      assert.equal(drawId, "1");
      return callback;
    },
    now,
  );
  assert.equal(result?.status, "waiting_for_finalize_delay");
  assert.equal(result?.detail.automationAt, String(seconds + 800));
  for (const value of [
    null,
    { ...callback, args: { drawId: "2" } },
    { ...callback, block_number: 101 },
    { ...callback, block_timestamp: iso(10) },
    { ...callback, block_timestamp: iso(-1740) },
  ]) {
    assert.equal(
      await readKeeperDeferral(
        async () => index,
        async () => value,
        now,
      ),
      null,
    );
  }
});

test("closed/empty indexed auctions can wait but unexpected draw states require live inspection", async () => {
  const index = fixture();
  index.snapshot.closed = true;
  assert.equal(
    (await readKeeperDeferral(async () => index, noCallback, now))?.status,
    "closed",
  );
  index.snapshot.closed = false;
  index.snapshot.prizeCount = "0";
  assert.equal(
    (await readKeeperDeferral(async () => index, noCallback, now))?.status,
    "no_inventory",
  );
  index.snapshot.pendingDrawId = "1";
  index.snapshot.pendingStatus = 3;
  assert.equal(
    await readKeeperDeferral(async () => index, noCallback, now),
    null,
  );
});
