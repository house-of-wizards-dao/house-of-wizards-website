import { createClient } from "@supabase/supabase-js";
import { createPublicClient, decodeEventLog, getContract, http } from "viem";
import { mainnet } from "viem/chains";
import { prisonAbi } from "../_shared/abi.ts";
import { fetchPrisonCharacters, missingMetadataSchema } from "./metadata.ts";
import { createLogReader } from "./logs.ts";

declare const Deno: {
  env: { get: (name: string) => string | undefined };
  serve: (handler: (request: Request) => Promise<Response>) => unknown;
};

// This function has no signing key and never sends an Ethereum transaction.
const contract = "0x7a258a7ed776d88ec7e19a03019a632c4f097ef8" as const;
const deploymentBlock = 26428270n;
const rangeSize = 2000n;
const overlap = 64n;
const rpc = createPublicClient({
  chain: mainnet,
  transport: http(
    Deno.env.get("PRISON_RPC_URL") ?? "https://ethereum-rpc.publicnode.com",
    {
      timeout: 15_000,
      retryCount: 1,
    },
  ),
  cacheTime: 0,
});
const readLogs = createLogReader((range) => rpc.getLogs(range));
const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
const prison = getContract({ address: contract, abi: prisonAbi, client: rpc });
const json = (value: unknown, status = 200) => Response.json(value, { status });
const serializable = (value: unknown): unknown =>
  JSON.parse(
    JSON.stringify(value, (_, item) =>
      typeof item === "bigint" ? item.toString() : item,
    ),
  );
type State = {
  cursor_block: number;
  cursor_hash: `0x${string}` | null;
  revision: number;
};

const syncMetadata = async () => {
  // A catalog outage must not stop auction indexing. Missing rows are retried
  // on the next scheduled run; known metadata is never fetched on page views.
  try {
    const missing = await db
      .from("prison_inventory")
      .select("collection,token_id")
      .eq("chain_id", 1)
      .eq("contract", contract)
      .is("name", null)
      .order("collection")
      .order("token_id")
      .limit(50);
    if (missing.error) throw new Error("Inventory unavailable");
    const tokens = missingMetadataSchema.parse(missing.data);
    const rows = await fetchPrisonCharacters(tokens);
    if (rows.length) {
      const saved = await db.from("prison_nft_metadata").upsert(rows, {
        onConflict: "chain_id,collection,token_id",
      });
      if (saved.error) throw new Error("Metadata write failed");
    }
    return { saved: rows.length, pending: tokens.length - rows.length };
  } catch {
    return { status: "retry_next_run" };
  }
};

Deno.serve(async (request: Request) => {
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
  const auth = await db.rpc("prison_authorize_indexer", {
    p_timestamp: Number(timestamp),
    p_nonce: nonce,
    p_signature: signature,
  });
  if (auth.error || auth.data !== true)
    return json({ error: "Unauthorized" }, 401);
  let stage = "check_chain";
  try {
    if ((await rpc.getChainId()) !== 1) throw new Error("Wrong RPC chain");
    const deadline = Date.now() + 95_000;
    let batches = 0;
    let indexed = 0;
    while (batches < 8 && Date.now() < deadline) {
      stage = "read_checkpoint";
      const stateResult = await db
        .from("prison_index_state")
        .select("cursor_block,cursor_hash,revision")
        .eq("chain_id", 1)
        .eq("contract", contract)
        .single<State>();
      if (stateResult.error || !stateResult.data)
        throw new Error("Cannot read index cursor");
      const state = stateResult.data;
      stage = "read_blocks";
      const head = await rpc.getBlock({ blockTag: "latest" });
      if (head.number < deploymentBlock)
        throw new Error("RPC head predates deployment");
      // A temporarily stale RPC head is not evidence of a reorg. Preserve the
      // checkpoint instead of deleting newer indexed events and starting over.
      if (head.number < BigInt(state.cursor_block))
        throw new Error("RPC head is behind the index cursor");
      let from = BigInt(state.cursor_block) + 1n;
      if (state.cursor_hash) {
        // Check the cursor itself, including deeper reorgs. If it changed, rebuild
        // from deployment in bounded batches; the UI labels catch-up explicitly.
        const cursor =
          BigInt(state.cursor_block) <= head.number
            ? await rpc.getBlock({ blockNumber: BigInt(state.cursor_block) })
            : null;
        from =
          cursor?.hash === state.cursor_hash
            ? from - overlap > deploymentBlock
              ? from - overlap
              : deploymentBlock
            : deploymentBlock;
      }
      const to =
        from + rangeSize - 1n < head.number
          ? from + rangeSize - 1n
          : head.number;
      const end = await rpc.getBlock({ blockNumber: to });
      stage = "read_logs";
      const logs = await readLogs({
        address: contract,
        fromBlock: from,
        toBlock: to,
      });
      const timestamps = new Map<string, string>([
        [String(to), new Date(Number(end.timestamp) * 1000).toISOString()],
      ]);
      // Bound concurrency when backfilling many deposit blocks.
      const blocks = [...new Set(logs.map((log) => log.blockNumber))];
      for (let i = 0; i < blocks.length; i += 8) {
        await Promise.all(
          blocks.slice(i, i + 8).map(async (blockNumber) => {
            if (!timestamps.has(String(blockNumber))) {
              const block = await rpc.getBlock({ blockNumber });
              timestamps.set(
                String(blockNumber),
                new Date(Number(block.timestamp) * 1000).toISOString(),
              );
            }
          }),
        );
      }
      stage = "decode_events";
      const events = logs.map((log) => {
        // Fail closed on an ABI mismatch; never advance past a skipped event.
        const decoded = decodeEventLog({
          abi: prisonAbi,
          data: log.data,
          topics: log.topics,
          strict: true,
        });
        return {
          block_number: Number(log.blockNumber),
          block_hash: log.blockHash,
          transaction_hash: log.transactionHash,
          transaction_index: log.transactionIndex,
          log_index: log.logIndex,
          block_timestamp: timestamps.get(String(log.blockNumber)),
          event_name: decoded.eventName,
          args: serializable(decoded.args),
        };
      });
      // Historical logs do not require archive state. Only read contract storage
      // when caught up to the current head, keeping public RPC backfills usable.
      let snapshot: unknown = null;
      if (to === head.number) {
        stage = "read_current_snapshot";
        const at = { blockNumber: to };
        const [
          closed,
          nextDrawAt,
          pendingDrawId,
          drawCount,
          prizeCount,
          boxCount,
          highestBid,
        ] = await Promise.all([
          prison.read.closed(at),
          prison.read.nextDrawAt(at),
          prison.read.pendingDrawId(at),
          prison.read.drawCount(at),
          prison.read.availableTokenCount(at),
          prison.read.availableBoxCount(at),
          prison.read.highestBid(at),
        ]);
        const pendingDraw =
          pendingDrawId > 0n
            ? await prison.read.getDraw([pendingDrawId], at)
            : null;
        snapshot = serializable({
          closed,
          nextDrawAt,
          pendingDrawId,
          drawCount,
          prizeCount,
          boxCount,
          highestBidder: highestBid[0],
          highestBid: highestBid[1],
          pendingStatus: pendingDraw?.status ?? 0,
        });
      }
      // Discard a batch if the chain changed while logs and state were read.
      if ((await rpc.getBlock({ blockNumber: to })).hash !== end.hash)
        throw new Error("Chain changed during scan; retry next run");
      stage = "commit_checkpoint";
      const commit = await db.rpc("prison_commit_index", {
        p_chain_id: 1,
        p_contract: contract,
        p_revision: state.revision,
        p_from_block: Number(from),
        p_to_block: Number(to),
        p_block_hash: end.hash,
        p_head_block: Number(head.number),
        p_block_timestamp: timestamps.get(String(to)),
        p_events: events,
        p_snapshot: snapshot,
      });
      if (commit.error)
        throw new Error(`Index commit failed: ${commit.error.code}`);
      if (commit.data !== true)
        return json({ status: "another_run_advanced_cursor" });
      batches++;
      indexed += events.length;
      if (to === head.number)
        return json({
          status: "caught_up",
          block: Number(to),
          batches,
          events: indexed,
          metadata: await syncMetadata(),
        });
    }
    return json({ status: "catching_up", batches, events: indexed });
  } catch (error) {
    // Avoid logging transport errors containing credentials from a custom URL.
    console.error(
      "Prison indexing failed",
      stage,
      error instanceof Error ? error.name : "UnknownError",
    );
    return json(
      {
        error:
          "Indexing failed; cursor preserved. The next scheduled run will retry.",
      },
      500,
    );
  }
});
