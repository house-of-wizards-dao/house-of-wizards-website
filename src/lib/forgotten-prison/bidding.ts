import {
  createPublicClient,
  getContract,
  http,
  formatEther,
  parseEther,
  TransactionReceiptNotFoundError,
  BaseError,
  ContractFunctionRevertedError,
  type Address,
  type Hex,
} from "viem";
import { mainnet, foundry } from "viem/chains";
import { prisonAbi } from "./abi";
import { LOCAL_RPC } from "./config";

export type PrisonTarget = { address: Address; chainId: 1 | 31337 };
export const createBidderClient = (target: PrisonTarget) =>
  createPublicClient({
    chain:
      target.chainId === 31337
        ? {
            ...foundry,
            contracts: { multicall3: mainnet.contracts.multicall3 },
          }
        : mainnet,
    transport: http(
      target.chainId === 31337 ? LOCAL_RPC : process.env.NEXT_PUBLIC_RPC_URL,
      { timeout: 15_000, retryCount: 1 },
    ),
    cacheTime: 0,
  });
type BidderClient = ReturnType<typeof createBidderClient>;

export const readAuction = async (
  client: BidderClient,
  target: PrisonTarget,
  account?: Address,
) => {
  if ((await client.getChainId()) !== target.chainId)
    throw new Error(
      "The auction network is unavailable. Please try again shortly.",
    );
  const block = await client.getBlock();
  const prison = getContract({
    address: target.address,
    abi: prisonAbi,
    client,
  });
  const at = { blockNumber: block.number };
  const [
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    highestBid,
    prizeCount,
    boxCount,
    eligible,
    bid,
    refund,
    balance,
  ] = await Promise.all([
    prison.read.closed(at),
    prison.read.nextDrawAt(at),
    prison.read.pendingDrawId(at),
    prison.read.drawCount(at),
    prison.read.highestBid(at),
    prison.read.availableTokenCount(at),
    prison.read.availableBoxCount(at),
    prison.read.eligibleInventoryCounts(at),
    account ? prison.read.bidOf([account], at) : 0n,
    account ? prison.read.refunds([account], at) : 0n,
    account ? client.getBalance({ address: account, ...at }) : 0n,
  ]);
  const history = await client.multicall({
    ...at,
    allowFailure: false,
    contracts: Array.from(
      { length: Math.min(Number(drawCount), 6) },
      (_, i) =>
        ({
          address: target.address,
          abi: prisonAbi,
          functionName: "getDraw",
          args: [drawCount - BigInt(i)],
        }) as const,
    ),
  });
  return {
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    highestBid,
    prizeCount,
    boxCount,
    eligible,
    bid,
    refund,
    balance,
    timestamp: block.timestamp,
    history: history.map((draw, i) => ({ ...draw, id: drawCount - BigInt(i) })),
  };
};
export type Auction = Awaited<ReturnType<typeof readAuction>>;
export type PrizeDraw = Auction["history"][number];

// Read every draw, including older wins; showing only recent rounds would hide
// prizes that a returning bidder has not claimed. Batch requests to bound RPC size.
export const readMyPrizes = async (
  client: BidderClient,
  target: PrisonTarget,
  account: Address,
  drawCount: bigint,
) => {
  const wins: PrizeDraw[] = [];
  for (let end = drawCount; end > 0n; end -= 100n) {
    const count = Number(end < 100n ? end : 100n);
    const draws = await client.multicall({
      allowFailure: false,
      contracts: Array.from(
        { length: count },
        (_, i) =>
          ({
            address: target.address,
            abi: prisonAbi,
            functionName: "getDraw",
            args: [end - BigInt(i)],
          }) as const,
      ),
    });
    draws.forEach((draw, i) => {
      if (
        draw.winner.toLowerCase() === account.toLowerCase() &&
        draw.status === 3 &&
        (!draw.claimed || (draw.bonusAwarded && !draw.bonusClaimed))
      )
        wins.push({ ...draw, id: end - BigInt(i) });
    });
  }
  return wins;
};

export const parseBid = (input: string) => {
  if (!/^(?:\d+)(?:\.\d{1,18})?$/.test(input)) return null;
  const value = parseEther(input);
  return value > 0n && value < 2n ** 256n ? value : null;
};
export const displayEth = (value: bigint) => formatEther(value);
export const shortAddress = (value: string) =>
  `${value.slice(0, 6)}…${value.slice(-4)}`;
export const canCancel = (auction: Auction) =>
  auction.bid > 0n &&
  (auction.closed ||
    auction.prizeCount === 0n ||
    auction.timestamp < auction.nextDrawAt);

const errorMessages: Record<string, string> = {
  TooEarly:
    "The bidding cutoff has not been reached yet. Please wait for the countdown.",
  DrawPending:
    "Someone has already started the draw. Refresh to see its progress.",
  NoPendingDraw:
    "This draw has already been settled. Refresh to see the result.",
  CutoffReached:
    "Bidding has closed for this draw. Please wait for the next round to open.",
  AuctionClosed:
    "The auction has ended. You can still withdraw eligible balances and claim your prizes.",
  NoInventory: "All main prizes have been awarded.",
  NoBid: "You do not have a standing bid to withdraw.",
  ZeroAmount: "Enter an ETH amount greater than zero.",
  NotWinner: "This prize belongs to a different wallet.",
  AlreadyClaimed: "This prize has already been claimed.",
  NoBonus: "This draw did not award an Imp Box.",
  RandomnessNotReady:
    "This draw is still being settled. Your prize will appear when it is ready.",
  InvalidRecipient: "Choose a valid receiving wallet.",
  TransferFailed: "Your wallet could not receive the transfer.",
};
export const bidderError = (error: unknown) => {
  if (error instanceof BaseError) {
    const reverted = error.walk(
      (cause) => cause instanceof ContractFunctionRevertedError,
    );
    if (
      reverted instanceof ContractFunctionRevertedError &&
      reverted.data?.errorName
    )
      return (
        errorMessages[reverted.data.errorName] ??
        "The contract could not complete this action. Refresh the auction and try again."
      );
    if (/user rejected|user denied/i.test(error.message))
      return "Transaction cancelled in your wallet. Nothing was sent.";
    if (/insufficient funds/i.test(error.message))
      return "Your wallet needs enough ETH for this amount and the network fee.";
    return error.shortMessage;
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};
export const waitForBidderReceipt = async (
  client: BidderClient,
  hash: Hex,
  onReplacement: (hash: Hex) => void,
) => {
  if (client.chain.id === 1) {
    let changedAction = false;
    const receipt = await client.waitForTransactionReceipt({
      hash,
      timeout: 180_000,
      onReplaced: ({ reason, transaction }) => {
        onReplacement(transaction.hash);
        changedAction = reason !== "repriced";
      },
    });
    if (changedAction)
      throw new Error(
        "Your original transaction was cancelled or replaced in your wallet. Refresh the auction before trying again.",
      );
    if (receipt.status !== "success")
      throw new Error(
        "The transaction reverted. Your action was not completed. Refresh the auction before trying again.",
      );
    return receipt;
  }
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    try {
      const receipt = await client.getTransactionReceipt({ hash });
      if (receipt.status !== "success")
        throw new Error(
          "The transaction reverted. Your action was not completed. Refresh the auction before trying again.",
        );
      return receipt;
    } catch (error) {
      if (!(error instanceof TransactionReceiptNotFoundError)) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, client.chain.id === 31337 ? 200 : 3000),
      );
    }
  }
  throw new Error(
    "Your transaction was submitted but is still awaiting confirmation. Check its status before submitting again.",
  );
};
