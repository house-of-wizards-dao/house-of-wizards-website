import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createPublicClient,
  custom,
  decodeFunctionData,
  encodeFunctionResult,
  multicall3Abi,
  type Hex,
} from "viem";
import { mainnet } from "viem/chains";
import { prisonAbi } from "../functions/_shared/abi.ts";
import { readSnapshot } from "../functions/prison-indexer/snapshot.ts";

const address = "0x7a258a7ed776d88ec7e19a03019a632c4f097ef8";
const encoded = [
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "closed",
    result: false,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "nextDrawAt",
    result: 2000n,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "pendingDrawId",
    result: 0n,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "drawCount",
    result: 1n,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "availableTokenCount",
    result: 354n,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "availableBoxCount",
    result: 113n,
  }),
  encodeFunctionResult({
    abi: prisonAbi,
    functionName: "highestBid",
    result: [address, 5_000_000_000_000_000n],
  }),
];

test("the real viem client reads all seven snapshot fields in one eth_call at the indexed block", async () => {
  let requests = 0;
  const client = createPublicClient({
    chain: mainnet,
    transport: custom(
      {
        request: async ({ method, params }) => {
          requests++;
          assert.equal(method, "eth_call");
          const [call, block] = params as [{ data: Hex }, string];
          assert.equal(block, "0x1939550"); // 26,449,232, an arbitrary mined block.
          const decoded = decodeFunctionData({
            abi: multicall3Abi,
            data: call.data,
          });
          assert.equal(decoded.functionName, "aggregate3");
          assert.equal(decoded.args[0].length, 7);
          return encodeFunctionResult({
            abi: multicall3Abi,
            functionName: "aggregate3",
            result: encoded.map((returnData) => ({
              success: true,
              returnData,
            })),
          });
        },
      },
      { retryCount: 0 },
    ),
  });
  const snapshot = await readSnapshot(client, address, BigInt("0x1939550"));
  assert.equal(requests, 1);
  assert.equal(snapshot.prizeCount, 354n);
  assert.equal(snapshot.highestBid, 5_000_000_000_000_000n);
  assert.equal(snapshot.pendingStatus, 0);
});

test("a failed multicall field rejects the entire snapshot", async () => {
  const client = createPublicClient({
    chain: mainnet,
    transport: custom(
      {
        request: async () =>
          encodeFunctionResult({
            abi: multicall3Abi,
            functionName: "aggregate3",
            result: encoded.map((returnData, i) => ({
              success: i !== 4,
              returnData: i === 4 ? "0x" : returnData,
            })),
          }),
      },
      { retryCount: 0 },
    ),
  });
  await assert.rejects(readSnapshot(client, address, BigInt("0x1939550")));
});
