import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import {
  createPublicClient,
  http,
  parseEventLogs,
  type Address,
  type Hex,
} from "viem";
import { mainnet } from "viem/chains";
import { z } from "zod";
import {
  COLLECTIONS,
  COORDINATOR,
  DONOR,
  ERC721_ABI,
  KEY_HASH,
  VRF_ABI,
} from "../src/lib/forgotten-prison/config";
import {
  assertLocalFork,
  confirmed,
  impersonating,
  localChain,
  saveDeployment,
  revertSnapshot,
  type LocalDeployment,
} from "../src/lib/forgotten-prison/local-chain";

const info = await assertLocalFork();
if (!(await localChain.getAutomine()))
  throw new Error("Enable Anvil automining before setup.");
const forkBlock = info.forkedNetwork.forkBlockNumber;
await mkdir(".local", { recursive: true });
execFileSync("forge", ["build", "--quiet"], {
  cwd: "contracts/forgotten-prison",
  stdio: "inherit",
});
execFileSync(process.execPath, ["scripts/generate-prison-abi.mjs"], {
  stdio: "inherit",
});
const { prisonAbi } = await import("../src/lib/forgotten-prison/abi");
const artifact = z
  .object({
    bytecode: z.object({ object: z.string().regex(/^0x[\da-fA-F]+$/) }),
  })
  .parse(
    JSON.parse(
      await readFile(
        "contracts/forgotten-prison/out/ForgottenPrison.sol/ForgottenPrison.json",
        "utf8",
      ),
    ),
  );
const accounts = await localChain.getAddresses();
const owner = accounts[0];
if (!owner) throw new Error("Anvil must have unlocked development accounts.");

const source = createPublicClient({
  chain: mainnet,
  transport: http(
    process.env.MAINNET_RPC_URL || "https://ethereum-rpc.publicnode.com",
    { timeout: 60_000 },
  ),
});
const discoverWarriors = async (collection: Address) => {
  const cache = `.local/prison-warriors-${forkBlock}.json`;
  try {
    return z
      .array(z.string().regex(/^\d+$/))
      .parse(JSON.parse(await readFile(cache, "utf8")))
      .map(BigInt);
  } catch {
    /* A different fork block needs fresh ownership discovery. */
  }
  if ((await source.getChainId()) !== 1)
    throw new Error("MAINNET_RPC_URL must point to Ethereum mainnet.");
  const count = Number(
    await source.readContract({
      address: collection,
      abi: ERC721_ABI,
      functionName: "numMinted",
      blockNumber: BigInt(forkBlock),
    }),
  );
  const ids: bigint[] = [];
  // Warriors is not enumerable. Scan ownerOf on the read-only upstream at the exact fork block.
  for (let start = 0; start <= count; start += 250) {
    const results = await source.multicall({
      blockNumber: BigInt(forkBlock),
      batchSize: 0,
      contracts: Array.from(
        { length: Math.min(250, count + 1 - start) },
        (_, i) =>
          ({
            address: collection,
            abi: ERC721_ABI,
            functionName: "ownerOf",
            args: [BigInt(start + i)],
          }) as const,
      ),
    });
    results.forEach((result, index) => {
      if (
        result.status === "success" &&
        result.result.toLowerCase() === DONOR.toLowerCase()
      )
        ids.push(BigInt(start + index));
    });
    if (start % 2000 === 0)
      console.log(`Warriors: scanned ${start}/${count}, found ${ids.length}`);
  }
  await writeFile(cache, JSON.stringify(ids.map(String)));
  return ids;
};

const seeded: LocalDeployment["seeded"] = [];
for (const [name, collection] of Object.entries(COLLECTIONS)) {
  const count = Number(
    await localChain.readContract({
      address: collection,
      abi: ERC721_ABI,
      functionName: "balanceOf",
      args: [DONOR],
    }),
  );
  const ids =
    name === "Warriors"
      ? await discoverWarriors(collection)
      : await Promise.all(
          Array.from({ length: count }, (_, i) =>
            localChain.readContract({
              address: collection,
              abi: ERC721_ABI,
              functionName: "tokenOfOwnerByIndex",
              args: [DONOR, BigInt(i)],
            }),
          ),
        );
  if (ids.length !== count)
    throw new Error(
      `${name}: discovery found ${ids.length}, but donor holds ${count}. Restart a fresh fork if already seeded.`,
    );
  const owners = await localChain.multicall({
    contracts: ids.map(
      (id) =>
        ({
          address: collection,
          abi: ERC721_ABI,
          functionName: "ownerOf",
          args: [id],
        }) as const,
    ),
  });
  if (
    owners.some(
      (result) =>
        result.status !== "success" ||
        result.result.toLowerCase() !== DONOR.toLowerCase(),
    )
  )
    throw new Error(`${name}: ownership verification failed.`);
  seeded.push({ name, collection, tokenIds: ids.map(String) });
  console.log(
    `${name}: verified ${count} NFTs in source wallet at block ${forkBlock}`,
  );
}
if (!seeded.some((pool) => pool.tokenIds.length))
  throw new Error("The source wallet has no supported NFTs.");

// Roll back any partial setup, including subscription creation and donor transfers.
const before = await localChain.snapshot();
try {
  // Public Anvil addresses can carry EIP-7702 delegations on mainnet. Make the
  // development accounts ordinary EOAs so they can receive safe NFT transfers.
  for (const account of accounts.slice(0, 10)) {
    await localChain.setCode({ address: account, bytecode: "0x" });
  }
  const subscriptionReceipt = await confirmed(
    await localChain.writeContract({
      account: owner,
      address: COORDINATOR,
      abi: VRF_ABI,
      functionName: "createSubscription",
    }),
  );
  const event = parseEventLogs({
    abi: VRF_ABI,
    logs: subscriptionReceipt.logs,
    eventName: "SubscriptionCreated",
  })[0];
  if (!event) throw new Error("SubscriptionCreated event missing.");
  const subscriptionId = event.args.subId;
  await confirmed(
    await localChain.writeContract({
      account: owner,
      address: COORDINATOR,
      abi: VRF_ABI,
      functionName: "fundSubscriptionWithNative",
      args: [subscriptionId],
      value: 10n ** 19n,
    }),
  );
  const receipt = await confirmed(
    await localChain.deployContract({
      account: owner,
      abi: prisonAbi,
      bytecode: artifact.bytecode.object as Hex,
      args: [
        owner,
        COLLECTIONS.Warriors,
        COLLECTIONS.Wizards,
        COLLECTIONS["Imp boxes"],
        {
          coordinator: COORDINATOR,
          subscriptionId,
          keyHash: KEY_HASH,
          callbackGasLimit: 150_000,
          requestConfirmations: 10,
          nativePayment: true,
        },
      ],
    }),
  );
  const address = receipt.contractAddress;
  if (!address) throw new Error("Deployment returned no contract address.");
  await confirmed(
    await localChain.writeContract({
      account: owner,
      address: COORDINATOR,
      abi: VRF_ABI,
      functionName: "addConsumer",
      args: [subscriptionId, address],
    }),
  );
  await impersonating(DONOR, async () => {
    for (const pool of seeded) {
      for (const [index, id] of pool.tokenIds.entries()) {
        await confirmed(
          await localChain.writeContract({
            account: DONOR,
            address: pool.collection,
            abi: ERC721_ABI,
            functionName: "safeTransferFrom",
            // Local bulk seed: skip repeated gas estimation; still check each receipt.
            gas: 1_000_000n,
            args: [DONOR, address, BigInt(id)],
          }),
        );
        if ((index + 1) % 50 === 0 || index === pool.tokenIds.length - 1)
          console.log(
            `${pool.name}: transferred ${index + 1}/${pool.tokenIds.length} on localhost`,
          );
      }
      const balance = await localChain.readContract({
        address: pool.collection,
        abi: ERC721_ABI,
        functionName: "balanceOf",
        args: [address],
      });
      if (balance !== BigInt(pool.tokenIds.length))
        throw new Error(`${pool.name}: custody balance mismatch.`);
    }
  });
  const prizes = await localChain.readContract({
    address,
    abi: prisonAbi,
    functionName: "availableTokenCount",
  });
  const boxes = await localChain.readContract({
    address,
    abi: prisonAbi,
    functionName: "availableBoxCount",
  });
  if (
    prizes !== BigInt(seeded[0].tokenIds.length + seeded[1].tokenIds.length) ||
    boxes !== BigInt(seeded[2].tokenIds.length)
  )
    throw new Error("Registered prize inventory does not match transfers.");
  const snapshot = await localChain.snapshot();
  await saveDeployment({
    address,
    owner,
    donor: DONOR,
    coordinator: COORDINATOR,
    subscriptionId: String(subscriptionId),
    forkBlock,
    instanceId: info.instanceId,
    deploymentBlock: String(receipt.blockNumber),
    deploymentBlockHash: receipt.blockHash,
    snapshot,
    seeded,
  });
  console.log(
    `Ready: ${address} — ${prizes} main prizes, ${boxes} boxes. Start pnpm prison:dev.`,
  );
} catch (error) {
  await revertSnapshot(before);
  throw error;
}
