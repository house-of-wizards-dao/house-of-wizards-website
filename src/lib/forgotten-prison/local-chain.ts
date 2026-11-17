// Shared by the development-only route and setup/verification scripts.
import { readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import {
  createTestClient,
  http,
  publicActions,
  walletActions,
  TransactionReceiptNotFoundError,
  type Hex,
} from "viem";
import { foundry, mainnet } from "viem/chains";
import { z } from "zod";
import { LOCAL_RPC } from "./config";

export const localChain = createTestClient({
  mode: "anvil",
  cacheTime: 0,
  pollingInterval: 100,
  chain: {
    ...foundry,
    contracts: { multicall3: mainnet.contracts.multicall3 },
  },
  transport: http(LOCAL_RPC, { timeout: 60_000, retryCount: 0 }),
})
  .extend(publicActions)
  .extend(walletActions);

const address = z
  .templateLiteral(["0x", z.string()])
  .refine((v) => /^0x[\da-fA-F]{40}$/.test(v));
const hex = z
  .templateLiteral(["0x", z.string()])
  .refine((v) => /^0x[\da-fA-F]+$/.test(v));
export const deploymentSchema = z.object({
  address,
  owner: address,
  donor: address,
  coordinator: address,
  forkBlock: z.number().int().positive(),
  instanceId: z.string(),
  deploymentBlock: z.string(),
  deploymentBlockHash: hex,
  subscriptionId: z.string(),
  snapshot: hex,
  seeded: z.array(
    z.object({
      name: z.string(),
      collection: address,
      tokenIds: z.array(z.string()),
    }),
  ),
});
export type LocalDeployment = z.infer<typeof deploymentSchema>;
export const deploymentPath = path.join(
  process.cwd(),
  ".local/forgotten-prison.json",
);
export const saveDeployment = async (deployment: LocalDeployment) => {
  await writeFile(`${deploymentPath}.tmp`, JSON.stringify(deployment, null, 2));
  await rename(`${deploymentPath}.tmp`, deploymentPath);
};

// Raw RPC is private to this module: callers cannot choose a URL or arbitrary method.
const metadataSchema = z.object({
  instanceId: z.string(),
  chainId: z.number(),
  forkedNetwork: z.object({ chainId: z.number(), forkBlockNumber: z.number() }),
});
export const assertLocalFork = async () => {
  const response = await fetch(LOCAL_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "anvil_metadata",
      params: [],
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  const body: unknown = await response.json();
  const envelope = z.object({ result: metadataSchema }).parse(body);
  const info = envelope.result;
  if (
    info.chainId !== 31337 ||
    info.forkedNetwork.chainId !== 1 ||
    (await localChain.getChainId()) !== 31337
  ) {
    throw new Error(
      "Only an Ethereum mainnet fork on local Anvil chain 31337 is allowed.",
    );
  }
  return info;
};

export const loadDeployment = async () => {
  const info = await assertLocalFork();
  const saved = await readFile(deploymentPath, "utf8").catch(
    (error: unknown) => {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        throw new Error(
          "No local deployment yet. Run pnpm prison:local and wait for NFT seeding to finish.",
        );
      }
      throw error;
    },
  );
  const deployment = deploymentSchema.parse(JSON.parse(saved));
  if (
    deployment.instanceId !== info.instanceId ||
    deployment.forkBlock !== info.forkedNetwork.forkBlockNumber
  ) {
    throw new Error(
      "This fork was restarted. Run pnpm prison:setup before using the page.",
    );
  }
  const block = await localChain.getBlock({
    blockNumber: BigInt(deployment.deploymentBlock),
  });
  if (
    block.hash !== deployment.deploymentBlockHash ||
    !(await localChain.getCode({ address: deployment.address }))
  ) {
    throw new Error(
      "The saved deployment is no longer on this fork. Run pnpm prison:setup.",
    );
  }
  return deployment;
};

export const confirmed = async (hash: Hex) => {
  // Poll the receipt itself: a fork with automining has no next block until the
  // next transaction, so a block-watcher can miss a receipt that appears late.
  for (let attempt = 0; attempt < 600; attempt++) {
    try {
      const receipt = await localChain.getTransactionReceipt({ hash });
      if (receipt.status !== "success")
        throw new Error(`Transaction reverted: ${hash}`);
      return receipt;
    } catch (error) {
      if (!(error instanceof TransactionReceiptNotFoundError)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw new Error(`Local transaction was not mined within 60 seconds: ${hash}`);
};

export const revertSnapshot = async (id: Hex) => {
  const response = await fetch(LOCAL_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "evm_revert",
      params: [id],
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = z.object({ result: z.boolean() }).parse(await response.json());
  if (!result.result)
    throw new Error(
      "The saved reset snapshot no longer exists. Restart a fresh fork and run pnpm prison:setup.",
    );
};

export const impersonating = async <T>(
  account: `0x${string}`,
  action: () => Promise<T>,
) => {
  await localChain.setBalance({ address: account, value: 100n * 10n ** 18n });
  await localChain.impersonateAccount({ address: account });
  try {
    return await action();
  } finally {
    await localChain.stopImpersonatingAccount({ address: account });
  }
};
