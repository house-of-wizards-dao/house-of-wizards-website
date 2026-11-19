import { test } from "node:test";
import assert from "node:assert/strict";
import { InvalidRequestRpcError } from "viem";
import {
  createLogReader,
  type LogRange,
} from "../functions/prison-indexer/logs.ts";

const range: LogRange = {
  address: "0x7a258a7ed776d88ec7e19a03019a632c4f097ef8",
  fromBlock: 26430206n,
  toBlock: 26432205n,
};
const freeTierError = () =>
  new InvalidRequestRpcError(
    new Error(
      "Under the Free tier plan, you can make eth_getLogs requests with up to a 10 block range.",
    ),
  );
const noPause = async () => {};

test("keeps successful 2,000-block reads, including empty results, as a single request", async () => {
  let calls = 0;
  const read = createLogReader(async (chunk) => {
    calls++;
    assert.deepEqual(chunk, range);
    return [];
  }, noPause);
  assert.deepEqual(await read(range), []);
  assert.equal(calls, 1);
});

test("adapts to Alchemy's limit, covers every block once, and remembers the limit", async () => {
  let rejected = 0;
  let active = 0;
  let maxActive = 0;
  const read = createLogReader(async (chunk) => {
    assert.equal(chunk.address, range.address);
    if (chunk.toBlock - chunk.fromBlock >= 10n) {
      rejected++;
      throw freeTierError();
    }
    active++;
    maxActive = Math.max(maxActive, active);
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
    active--;
    return Array.from(
      { length: Number(chunk.toBlock - chunk.fromBlock + 1n) },
      (_, i) => chunk.fromBlock + BigInt(i),
    );
  }, noPause);
  assert.deepEqual(
    await read(range),
    Array.from({ length: 2000 }, (_, i) => range.fromBlock + BigInt(i)),
  );
  assert.deepEqual(
    await read({ ...range, toBlock: range.fromBlock + 14n }),
    Array.from({ length: 15 }, (_, i) => range.fromBlock + BigInt(i)),
  );
  assert.equal(rejected, 1);
  assert.equal(maxActive, 2);
});

test("rejects incomplete batches after a later chunk fails", async () => {
  const failure = new Error("Rate limited");
  const read = createLogReader(async (chunk) => {
    if (chunk.toBlock - chunk.fromBlock >= 10n) throw freeTierError();
    if (chunk.fromBlock > range.fromBlock + 20n) throw failure;
    return [chunk.fromBlock];
  }, noPause);
  await assert.rejects(read(range), (error) => error === failure);
});

test("does not split or swallow unrelated provider failures", async () => {
  for (const failure of [
    new Error("Unauthorized"),
    new InvalidRequestRpcError(new Error("Invalid filter")),
  ]) {
    let calls = 0;
    const read = createLogReader(async () => {
      calls++;
      throw failure;
    }, noPause);
    await assert.rejects(read(range), (error) => error === failure);
    assert.equal(calls, 1);
  }
});

test("does not retry forever if even a valid ten-block request is rejected", async () => {
  let calls = 0;
  const read = createLogReader(async () => {
    calls++;
    throw freeTierError();
  }, noPause);
  await assert.rejects(read(range), InvalidRequestRpcError);
  assert.equal(calls, 3);
});
