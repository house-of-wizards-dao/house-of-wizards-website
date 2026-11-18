import { createClient } from "@supabase/supabase-js";
import {
  createPublicClient,
  getContract,
  http,
  TransactionReceiptNotFoundError,
  type Hex,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { z } from "zod";
import { prisonAbi } from "../_shared/abi.ts";
import {
  callData,
  prisonAddress,
  runKeeper,
  type Chain,
  type Store,
} from "./runner.ts";

// Also permits the repository's TypeScript check to validate this Deno entrypoint.
declare const Deno: {
  env: { get: (name: string) => string | undefined };
  serve: (handler: (request: Request) => Promise<Response>) => unknown;
};

const decimal = z.string().regex(/^\d+$/).transform(BigInt);
const address = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/)
  .transform((value) => value as Address);
const hex = z
  .string()
  .regex(/^0x[0-9a-f]+$/)
  .transform((value) => value as Hex);
const settingsSchema = z.object({
  enabled: z.boolean(),
  walletAddress: address.nullable(),
  maxFeeWei: decimal,
  maxPriorityFeeWei: decimal,
  maxGas: decimal,
  maxTxCostWei: decimal,
  max24hCostWei: decimal,
  pending: z
    .object({
      hash: hex,
      signer: address,
      rawTx: hex,
      nonce: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .pipe(z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)),
      action: z.enum(["startDailyDraw", "finalizeDraw"]),
      intent: z.string().regex(/^(start|finalize):\d+$/),
      maxCostWei: decimal,
      createdAt: z.string().datetime({ offset: true }).transform(Date.parse),
    })
    .nullable(),
});
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const rpcCall = async (
  name: string,
  parameters: Record<string, unknown>,
): Promise<unknown> => {
  const { data, error } = await db.rpc(name, parameters);
  if (error) throw new Error("Keeper storage unavailable");
  return data;
};

const makeChain = (key: Hex): Chain => {
  const account = privateKeyToAccount(key);
  const client = createPublicClient({
    chain: mainnet,
    cacheTime: 0,
    transport: http(
      Deno.env.get("PRISON_RPC_URL") ?? "https://ethereum-rpc.publicnode.com",
      { timeout: 10_000, retryCount: 0 },
    ),
  });
  const prison = getContract({
    address: prisonAddress,
    abi: prisonAbi,
    client,
  });
  return {
    address: account.address,
    inspect: async () => {
      const chainId = await client.getChainId();
      if (chainId !== 1) throw new Error("Wrong chain");
      const block = await client.getBlock();
      const at = { blockNumber: block.number };
      const [
        closed,
        available,
        nextDrawAt,
        pendingDrawId,
        balance,
        latestNonce,
        pendingNonce,
      ] = await Promise.all([
        prison.read.closed(at),
        prison.read.availableTokenCount(at),
        prison.read.nextDrawAt(at),
        prison.read.pendingDrawId(at),
        client.getBalance({ address: account.address }),
        client.getTransactionCount({
          address: account.address,
          blockTag: "latest",
        }),
        client.getTransactionCount({
          address: account.address,
          blockTag: "pending",
        }),
      ]);
      const draw = pendingDrawId
        ? await prison.read.getDraw([pendingDrawId], at)
        : null;
      let readyAt: bigint | null = null;
      if (draw?.status === 2) {
        // Anchor the delay to the actual callback block, not the first cron run
        // that notices it. Missing or reorged index data fails closed.
        const { data, error } = await db
          .from("prison_events")
          .select("block_number, block_hash")
          .eq("chain_id", 1)
          .eq("contract", prisonAddress)
          .eq("event_name", "RandomnessReceived")
          .contains("args", {
            drawId: pendingDrawId.toString(),
            requestId: draw.requestId.toString(),
          })
          .maybeSingle();
        if (error) throw new Error("Randomness index unavailable");
        if (data && BigInt(data.block_number) <= block.number) {
          const callbackBlock = await client.getBlock({
            blockNumber: BigInt(data.block_number),
          });
          if (
            callbackBlock.hash === data.block_hash &&
            callbackBlock.timestamp >= draw.requestedAt
          )
            readyAt = callbackBlock.timestamp;
        }
      }
      if (block.baseFeePerGas === null) throw new Error("Missing base fee");
      return {
        chainId,
        blockNumber: block.number,
        timestamp: block.timestamp,
        baseFee: block.baseFeePerGas,
        closed,
        available,
        nextDrawAt,
        pendingDrawId,
        pendingStatus: draw?.status ?? 0,
        requestedAt: draw?.requestedAt ?? 0n,
        readyAt,
        balance,
        latestNonce,
        pendingNonce,
      };
    },
    receipt: async (hash) => {
      try {
        const receipt = await client.getTransactionReceipt({ hash });
        return {
          blockNumber: receipt.blockNumber,
          success: receipt.status === "success",
          cost: receipt.gasUsed * receipt.effectiveGasPrice,
        };
      } catch (error) {
        if (error instanceof TransactionReceiptNotFoundError) return null;
        throw new Error("Receipt unavailable");
      }
    },
    confirmedNonce: async () => {
      const head = await client.getBlockNumber();
      return client.getTransactionCount({
        address: account.address,
        blockNumber: head - 11n,
      });
    },
    simulate: async (action) => {
      await client.simulateContract({
        account,
        address: prisonAddress,
        abi: prisonAbi,
        functionName: action,
      });
    },
    estimateGas: (action) =>
      client.estimateGas({
        account: account.address,
        to: prisonAddress,
        data: callData(action),
        value: 0n,
      }),
    priorityFee: () => client.estimateMaxPriorityFeePerGas(),
    sign: ({ action, ...request }) =>
      account.signTransaction({
        ...request,
        type: "eip1559",
        chainId: 1,
        to: prisonAddress,
        data: callData(action),
        value: 0n,
      }),
    broadcast: (serializedTransaction) =>
      client.sendRawTransaction({ serializedTransaction }),
  };
};

Deno.serve(async (request) => {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405);
  const timestamp = request.headers.get("x-prison-timestamp");
  const nonce = request.headers.get("x-prison-nonce");
  const signature = request.headers.get("x-prison-signature");
  if (
    !timestamp ||
    !/^\d{10}$/.test(timestamp) ||
    !nonce ||
    !/^[a-f0-9]{32}$/.test(nonce) ||
    !signature ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return json({ error: "Unauthorized" }, 401);
  const lease = crypto.randomUUID();
  let acquired = false;
  let stage = "authenticate";
  try {
    const accepted = await rpcCall("prison_authorize_keeper", {
      p_timestamp: Number(timestamp),
      p_nonce: nonce,
      p_signature: signature,
    });
    if (accepted !== true) return json({ error: "Unauthorized" }, 401);
    stage = "acquire";
    const rawSettings = await rpcCall("prison_keeper_acquire", {
      p_lease: lease,
    });
    if (rawSettings === null) return json({ status: "busy" });
    acquired = true;
    const settings = settingsSchema.parse(rawSettings);
    stage = "wallet_configuration";
    const key = Deno.env.get("PRISON_KEEPER_PRIVATE_KEY")?.trim();
    if (!key || !/^0x[0-9a-fA-F]{64}$/.test(key)) {
      await rpcCall("prison_keeper_finish", {
        p_lease: lease,
        p_status: "missing_or_invalid_key",
        p_detail: {},
      });
      return json({ status: "missing_or_invalid_key" }, 503);
    }
    // Never log key material, arbitrary RPC exceptions, signed bytes, or request bodies.
    const chain = makeChain(key as Hex);
    const store: Store = {
      reserve: (tx) =>
        rpcCall("prison_keeper_reserve", {
          p_lease: lease,
          p_tx: {
            ...tx,
            nonce: String(tx.nonce),
            maxCostWei: String(tx.maxCostWei),
          },
        }).then((value) => value === true),
      mayBroadcast: (hash) =>
        rpcCall("prison_keeper_may_broadcast", {
          p_lease: lease,
          p_hash: hash,
        }).then((value) => value === true),
      result: (hash, status, receipt) =>
        rpcCall("prison_keeper_tx_result", {
          p_lease: lease,
          p_hash: hash,
          p_status: status,
          p_block: receipt?.blockNumber.toString() ?? null,
          p_cost: receipt?.cost.toString() ?? null,
        }).then((value) => value === true),
    };
    stage = "run";
    const report = await runKeeper(settings, chain, store);
    await rpcCall("prison_keeper_finish", {
      p_lease: lease,
      p_status: report.status,
      p_detail: report.detail,
      p_wallet: chain.address.toLowerCase(),
      p_balance: report.detail.balanceWei ?? null,
    });
    return json(report);
  } catch {
    if (acquired) {
      try {
        await rpcCall("prison_keeper_finish", {
          p_lease: lease,
          p_status: "error",
          p_detail: { stage },
        });
      } catch {
        /* The short lease expires; any prepared transaction remains durable. */
      }
    }
    return json({ status: "error", stage }, 503);
  }
});
