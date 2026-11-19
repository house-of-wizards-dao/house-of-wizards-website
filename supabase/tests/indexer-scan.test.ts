import assert from "node:assert/strict";
import { test } from "node:test";
import type { Hash } from "viem";
import {
  planScan,
  verifyScan,
  type ScanBlock,
} from "../functions/prison-indexer/scan.ts";

const hash = (number: bigint): Hash =>
  `0x${number.toString(16).padStart(64, "0")}`;
const block = (number: bigint): ScanBlock => ({
  number,
  hash: hash(number),
  timestamp: number * 12n,
});
const checkpoint = { cursor_block: 100, cursor_hash: hash(100n) };

test("normal scans cover only new blocks and verify both boundaries before commit", async () => {
  const reads: bigint[] = [];
  const read = async (number: bigint) => {
    reads.push(number);
    return block(number);
  };
  const scan = await planScan(checkpoint, block(105n), read, 10n, 2000n);
  assert.ok(scan);
  assert.equal(scan.from, 101n);
  assert.equal(scan.end.number, 105n);
  await verifyScan(scan, read);
  // Plus the caller's latest-block read: four block requests in a normal tick.
  assert.deepEqual(reads, [100n, 105n, 100n]);
});

test("an unchanged head skips logs/state reads; a replaced same-height head replays", async () => {
  const read = async (number: bigint) => block(number);
  assert.equal(await planScan(checkpoint, block(100n), read, 10n, 2000n), null);
  const scan = await planScan(
    checkpoint,
    { ...block(100n), hash: hash(999n) },
    read,
    10n,
    2000n,
  );
  assert.equal(scan?.from, 10n);
  assert.equal(scan?.anchor, null);
});

test("a stale RPC head cannot rewind or overwrite the index", async () => {
  await assert.rejects(
    planScan(
      checkpoint,
      block(99n),
      async () => {
        throw new Error("should not read a range");
      },
      10n,
      2000n,
    ),
    /behind the index cursor/,
  );
});

test("a changed checkpoint rebuilds from deployment in bounded batches", async () => {
  const read = async (number: bigint) => ({
    ...block(number),
    hash: hash(number + 1n),
  });
  const scan = await planScan(checkpoint, block(5000n), read, 10n, 2000n);
  assert.ok(scan);
  assert.equal(scan.from, 10n);
  assert.equal(scan.end.number, 2009n);
  assert.equal(scan.anchor, null);
  await verifyScan(scan, read);
});

test("a reorg during the scan discards the batch even when the end block stays stable", async () => {
  const scan = await planScan(
    checkpoint,
    block(105n),
    async (n) => block(n),
    10n,
    2000n,
  );
  assert.ok(scan);
  await assert.rejects(
    verifyScan(scan, async (n) => ({ ...block(n), hash: hash(999n) })),
    /Chain changed/,
  );
  await assert.rejects(
    verifyScan(scan, async (n) =>
      n === 100n ? { ...block(n), hash: hash(999n) } : block(n),
    ),
    /Checkpoint changed/,
  );
});

test("initial checkpoints start at deployment, but missing hashes on advanced cursors fail", async () => {
  const scan = await planScan(
    { cursor_block: 9, cursor_hash: null },
    block(15n),
    async (n) => block(n),
    10n,
    2000n,
  );
  assert.equal(scan?.from, 10n);
  await assert.rejects(
    planScan(
      { ...checkpoint, cursor_hash: null },
      block(105n),
      async (n) => block(n),
      10n,
      2000n,
    ),
    /Missing index checkpoint hash/,
  );
});
