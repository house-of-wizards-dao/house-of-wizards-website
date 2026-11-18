import "server-only";
import { projectPrisonInventory, prizeKey, prizeKind } from "./inventory";
import { prisonCharacter } from "./character-catalog";
import { decodeEventLog, getContract } from "viem";
import { prisonAbi } from "./abi";
import { localChain, loadDeployment } from "./local-chain";
import { prisonIndexSchema } from "./index-types";
import { projectPrisonEvents, type PrisonEvent } from "./event-projection";

export const readLocalPrisonIndex = async (page: number) => {
  const deployment = await loadDeployment();
  const block = await localChain.getBlock();
  const logs = await localChain.getLogs({
    address: deployment.address,
    fromBlock: BigInt(deployment.deploymentBlock),
    toBlock: block.number,
  });
  const decoded = logs
    .map((log) => ({
      ...log,
      decoded: decodeEventLog({
        abi: prisonAbi,
        data: log.data,
        topics: log.topics,
        strict: true,
      }),
    }))
    .filter((log) =>
      [
        "BidPlaced",
        "BidCancelled",
        "DrawStarted",
        "RandomnessReceived",
        "DrawFinalized",
        "NFTClaimed",
        "BonusAwarded",
        "BonusClaimed",
        "Shutdown",
        "InventoryDeposited",
        "UnsoldNFTRecovered",
      ].includes(log.decoded.eventName),
    );
  const timestamps = new Map<bigint, string>();
  const blocks = [...new Set(decoded.map((log) => log.blockNumber))];
  for (let i = 0; i < blocks.length; i += 10) {
    await Promise.all(
      blocks.slice(i, i + 10).map(async (blockNumber) => {
        const value = await localChain.getBlock({ blockNumber });
        timestamps.set(
          blockNumber,
          new Date(Number(value.timestamp) * 1000).toISOString(),
        );
      }),
    );
  }
  const events: PrisonEvent[] = decoded.map((log) => ({
    eventName: log.decoded.eventName,
    args: Object.fromEntries(
      Object.entries(log.decoded.args).map(([key, value]) => [
        key,
        typeof value === "boolean" ? value : String(value),
      ]),
    ),
    blockNumber: Number(log.blockNumber),
    transactionIndex: log.transactionIndex,
    logIndex: log.logIndex,
    transactionHash: log.transactionHash,
    timestamp: timestamps.get(log.blockNumber) ?? "",
  }));
  const projection = projectPrisonEvents(events);
  const prison = getContract({
    address: deployment.address,
    abi: prisonAbi,
    client: localChain,
  });
  const at = { blockNumber: block.number };
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
  const pending =
    pendingDrawId > 0n ? await prison.read.getDraw([pendingDrawId], at) : null;
  // A preview can start from a fork of the already-funded mainnet contract.
  // Read its current inventory too, including deposits before the fork baseline.
  const available = await localChain.multicall({
    ...at,
    allowFailure: false,
    contracts: Array.from(
      { length: Number(prizeCount) },
      (_, i) =>
        ({
          address: deployment.address,
          abi: prisonAbi,
          functionName: "availableTokenAt",
          args: [BigInt(i)],
        }) as const,
    ),
  });
  const inventory = new Map(
    projectPrisonInventory(events).map((prize) => [
      prizeKey(prize.collection, prize.tokenId),
      prize,
    ]),
  );
  for (const asset of available) {
    const key = prizeKey(asset.collection, asset.tokenId);
    inventory.set(key, {
      collection: asset.collection.toLowerCase(),
      tokenId: String(asset.tokenId),
      kind: prizeKind(asset.collection),
      status: "available",
      drawId: null,
      updatedAt:
        inventory.get(key)?.updatedAt ??
        new Date(Number(block.timestamp) * 1000).toISOString(),
      name: null,
      imageUrl: null,
    });
  }
  const prizes = [...inventory.values()].map((prize) => ({
    ...prize,
    ...prisonCharacter(prize.collection, prize.tokenId),
  }));
  if (
    (await localChain.getBlock({ blockNumber: block.number })).hash !==
    block.hash
  )
    throw new Error("Local chain changed while reading");
  return prisonIndexSchema.parse({
    source: "local",
    chainId: 31337,
    contract: deployment.address,
    blockNumber: Number(block.number),
    headBlock: Number(block.number),
    blockTimestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
    indexedAt: new Date().toISOString(),
    snapshot: {
      closed,
      nextDrawAt: String(nextDrawAt),
      pendingDrawId: String(pendingDrawId),
      drawCount: String(drawCount),
      prizeCount: String(prizeCount),
      boxCount: String(boxCount),
      highestBidder: highestBid[0],
      highestBid: String(highestBid[1]),
      pendingStatus: pending?.status ?? 0,
    },
    ...projection,
    prizes,
    leaderboard: projection.leaderboard.slice(0, 50),
    history: projection.history.slice(page * 20, page * 20 + 20),
  });
};
