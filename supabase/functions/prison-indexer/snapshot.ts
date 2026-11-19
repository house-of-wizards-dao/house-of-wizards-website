import type { Address, PublicClient } from "viem";
import { prisonAbi } from "../_shared/abi.ts";

export const readSnapshot = async (
  client: Pick<PublicClient, "multicall" | "readContract">,
  address: Address,
  blockNumber: bigint,
) => {
  const contract = { address, abi: prisonAbi } as const;
  const [
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    prizeCount,
    boxCount,
    highestBid,
  ] = await client.multicall({
    blockNumber,
    allowFailure: false,
    contracts: [
      { ...contract, functionName: "closed" },
      { ...contract, functionName: "nextDrawAt" },
      { ...contract, functionName: "pendingDrawId" },
      { ...contract, functionName: "drawCount" },
      { ...contract, functionName: "availableTokenCount" },
      { ...contract, functionName: "availableBoxCount" },
      { ...contract, functionName: "highestBid" },
    ],
  });
  const pendingDraw =
    pendingDrawId > 0n
      ? await client.readContract({
          ...contract,
          functionName: "getDraw",
          args: [pendingDrawId],
          blockNumber,
        })
      : null;
  return {
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    prizeCount,
    boxCount,
    highestBidder: highestBid[0],
    highestBid: highestBid[1],
    pendingStatus: pendingDraw?.status ?? 0,
  };
};
