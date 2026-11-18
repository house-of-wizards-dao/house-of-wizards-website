"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { type Hex } from "viem";
import Link from "next/link";
import { ClaimIntro } from "./claim-intro";
import { CharacterPreview, PrizePool } from "./prize-pool";
import { prizeKey } from "@/lib/forgotten-prison/inventory";
import {
  BidLeaderboard,
  DrawProgress,
  indexQueryKey,
  usePrisonIndex,
} from "./indexed-auction";
import { drawTiming } from "@/lib/forgotten-prison/draw-timing";
import { biddingStatus } from "@/lib/forgotten-prison/index-types";
import { Web3Provider } from "@/components/Web3Provider";
import { prisonAbi } from "@/lib/forgotten-prison/abi";
import { COLLECTIONS } from "@/lib/forgotten-prison/config";
import {
  bidderError,
  canCancel,
  createBidderClient,
  displayEth,
  parseBid,
  readAuction,
  readMyPrizes,
  shortAddress,
  waitForBidderReceipt,
  type PrisonTarget,
} from "@/lib/forgotten-prison/bidding";

const panel =
  "rounded-2xl border border-violet-300/20 bg-[#180f27]/80 p-5 sm:p-7";
const primary =
  "w-full rounded-xl bg-violet-300 px-5 py-3.5 font-semibold text-[#1b102c] transition hover:bg-violet-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-45";
const secondary =
  "rounded-lg border border-violet-300/30 px-4 py-2.5 text-sm font-medium text-violet-100 hover:bg-violet-300/10 focus-visible:outline-2 focus-visible:outline-violet-300 disabled:cursor-not-allowed disabled:opacity-45";
type PlayerAction =
  | { kind: "bid"; value: bigint }
  | { kind: "cancelBid" | "withdrawRefund" }
  | { kind: "startDailyDraw" | "finalizeDraw" }
  | { kind: "claimNFT" | "claimBonus"; drawId: bigint };
const countdown = (seconds: number) => {
  if (seconds <= 0) return "Awaiting the draw";
  const hours = Math.floor(seconds / 3600),
    minutes = Math.floor((seconds % 3600) / 60),
    remaining = seconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(remaining).padStart(2, "0")}s`;
};
const prizeName = (collection: string) =>
  collection.toLowerCase() === COLLECTIONS.Wizards.toLowerCase()
    ? "Wizard"
    : "Warrior";

const AuctionView = ({ target }: { target: PrisonTarget }) => {
  const { address, chainId, isConnecting, isReconnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();
  const client = useMemo(() => createBidderClient(target), [target]);
  const [amount, setAmount] = useState("0.01");
  const [pending, setPending] = useState<{ id: string; stage: string } | null>(
    null,
  );
  const lock = useRef(false);
  const [feedback, setFeedback] = useState<{
    error: boolean;
    message: string;
    hash?: Hex;
  } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const queryPrefix = [
    "prison-bidder",
    target.chainId,
    target.address,
  ] as const;
  const auction = useQuery({
    queryKey: [...queryPrefix, "auction", address ?? null],
    queryFn: () => readAuction(client, target, address),
    refetchInterval: 10_000,
    staleTime: 0,
    retry: 1,
  });
  const data = auction.data;
  const index = usePrisonIndex(target);
  const prizeMetadata = useMemo(
    () =>
      new Map(
        index.data?.prizes.map((prize) => [
          prizeKey(prize.collection, prize.tokenId),
          prize,
        ]),
      ),
    [index.data?.prizes],
  );
  const timing = data
    ? drawTiming(
        data,
        index.data?.history.find(
          (draw) => draw.id === data.pendingDrawId.toString(),
        ),
      )
    : null;
  const estimatedTimestamp = data
    ? data.timestamp +
      BigInt(Math.max(0, Math.floor((now - auction.dataUpdatedAt) / 1000)))
    : 0n;
  const automationRemaining =
    timing?.automationAt !== null && timing?.automationAt !== undefined
      ? Math.max(0, Number(timing.automationAt - estimatedTimestamp))
      : null;
  const prizes = useQuery({
    queryKey: [
      ...queryPrefix,
      "prizes",
      address ?? null,
      String(data?.drawCount ?? 0n),
      String(data?.pendingDrawId ?? 0n),
    ],
    queryFn: () =>
      address && data
        ? readMyPrizes(client, target, address, data.drawCount)
        : Promise.resolve([]),
    enabled: !!address && !!data,
    staleTime: 60_000,
    retry: 1,
  });
  const remaining = data
    ? Math.max(
        0,
        Number(data.nextDrawAt - data.timestamp) -
          Math.max(0, Math.floor((now - auction.dataUpdatedAt) / 1000)),
      )
    : 0;
  const bidAmount = parseBid(amount);
  const totalBid = (data?.bid ?? 0n) + (bidAmount ?? 0n);
  const leading =
    !!address &&
    data?.highestBid[0].toLowerCase() === address.toLowerCase() &&
    data.highestBid[1] > 0n;
  const wrongChain = !!address && chainId !== target.chainId;
  const gate = !address || wrongChain;
  const network = target.chainId === 1 ? "Ethereum" : "Local prison fork";
  const roundOpen =
    !!data &&
    !auction.isError &&
    !data.closed &&
    data.prizeCount > 0n &&
    remaining > 0;
  const bidValid =
    roundOpen &&
    bidAmount !== null &&
    (!address || bidAmount < (data?.balance ?? 0n));
  const cancelAvailable =
    !!data &&
    canCancel({ ...data, timestamp: data.nextDrawAt - BigInt(remaining) }) &&
    !auction.isError;
  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryPrefix }),
      queryClient.invalidateQueries({ queryKey: indexQueryKey(target) }),
    ]);
  };

  const transact = async (
    action: PlayerAction,
    id: string,
    success: string,
  ) => {
    if (lock.current) return;
    setFeedback(null);
    if (!address) {
      openConnectModal?.();
      return;
    }
    lock.current = true;
    let hash: Hex | undefined;
    try {
      if (wrongChain) {
        setPending({ id, stage: "Switching network…" });
        await switchChainAsync({ chainId: target.chainId });
        return;
      }
      setPending({ id, stage: "Confirm in your wallet…" });
      const base = {
        address: target.address,
        abi: prisonAbi,
        chainId: target.chainId,
        account: address,
      } as const;
      switch (action.kind) {
        case "startDailyDraw":
        case "finalizeDraw": {
          const fresh = await readAuction(client, target, address);
          const available = drawTiming(fresh);
          if (
            !available?.canExecute ||
            available.action !== action.kind ||
            (action.kind === "finalizeDraw" &&
              fresh.pendingDrawId !== data?.pendingDrawId)
          )
            throw new Error(
              "The draw has changed or is not ready yet. Refresh and try again.",
            );
          await client.simulateContract({
            address: target.address,
            abi: prisonAbi,
            account: address,
            functionName: action.kind,
          });
          hash = await writeContractAsync({
            ...base,
            functionName: action.kind,
          });
          break;
        }
        case "bid":
          hash = await writeContractAsync({
            ...base,
            functionName: "bid",
            value: action.value,
          });
          break;
        case "cancelBid":
          hash = await writeContractAsync({
            ...base,
            functionName: "cancelBid",
            args: [address],
          });
          break;
        case "withdrawRefund":
          hash = await writeContractAsync({
            ...base,
            functionName: "withdrawRefund",
            args: [address],
          });
          break;
        case "claimNFT":
          hash = await writeContractAsync({
            ...base,
            functionName: "claimNFT",
            args: [action.drawId, address],
          });
          break;
        case "claimBonus":
          hash = await writeContractAsync({
            ...base,
            functionName: "claimBonus",
            args: [action.drawId, address],
          });
          break;
      }
      setPending({ id, stage: "Confirming transaction…" });
      await waitForBidderReceipt(client, hash, (replacement) => {
        hash = replacement;
      });
      setPending({ id, stage: "Updating your balance…" });
      await refresh();
      if (action.kind === "bid") setAmount("");
      setFeedback({ error: false, message: success, hash });
    } catch (error) {
      setFeedback({ error: true, message: bidderError(error), hash });
      await refresh();
    } finally {
      lock.current = false;
      setPending(null);
    }
  };
  const actionButton = (
    action: PlayerAction,
    id: string,
    label: string,
    available: boolean,
    success: string,
    main = false,
  ) => (
    <button
      data-testid={id}
      type="button"
      className={main ? primary : secondary}
      disabled={
        pending !== null ||
        isConnecting ||
        isReconnecting ||
        (!gate && !available)
      }
      onClick={() => void transact(action, id, success)}
    >
      {pending?.id === id
        ? pending.stage
        : isConnecting || isReconnecting
          ? "Connecting wallet…"
          : !address
            ? "Connect wallet"
            : wrongChain
              ? `Switch to ${network}`
              : label}
    </button>
  );

  return (
    <div className="space-y-7 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-violet-200/75">
          <span
            className={`h-2 w-2 rounded-full ${auction.isError ? "bg-red-300" : data?.closed ? "bg-amber-300" : "bg-emerald-300"}`}
          />
          {data ? biddingStatus(data, remaining) : "Reading the auction"} ·{" "}
          {network}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-violet-300 underline underline-offset-4 disabled:opacity-40"
            disabled={auction.isFetching || !!pending}
            onClick={() => void refresh()}
          >
            Refresh
          </button>
          {address ? (
            <button
              type="button"
              className={secondary}
              onClick={openAccountModal}
              aria-label="Manage connected wallet"
            >
              {shortAddress(address)}
            </button>
          ) : null}
        </div>
      </div>
      {auction.isError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-300/30 bg-amber-200/5 p-4 text-sm text-amber-100"
        >
          We couldn’t refresh the auction. Bidding is paused here until fresh
          information is available.{" "}
          <button className="underline" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
        <section className={panel} aria-labelledby="current-round">
          <div className="flex items-center justify-between gap-4">
            <h2 id="current-round" className="text-xl font-semibold">
              {data?.closed ? "The auction has ended" : "The next escape"}
            </h2>
            <span className="rounded-full border border-violet-300/20 px-3 py-1 text-xs text-violet-200">
              Daily auction
            </span>
          </div>
          <p className="mt-2 text-sm text-violet-200/65">
            A randomly selected warrior or wizard awaits the highest bidder.
          </p>
          <div className="my-7 rounded-xl border border-violet-300/15 bg-black/15 p-5">
            <p className="text-xs uppercase tracking-widest text-violet-300/70">
              {data?.closed ? "Final state" : "Bidding closes in"}
            </p>
            <p
              data-testid="auction-countdown"
              className="mt-3 font-mono text-2xl text-violet-100 sm:text-3xl"
            >
              {data?.closed
                ? "Closed"
                : data?.prizeCount === 0n
                  ? data.drawCount === 0n
                    ? "Awaiting prizes"
                    : "No prizes remaining"
                  : data
                    ? countdown(remaining)
                    : "—"}
            </p>
            <p className="mt-3 text-sm text-violet-200/60">
              {data?.pendingDrawId
                ? `Round #${data.pendingDrawId} is being settled. New bids enter the next round.`
                : "Draws are settled after the cutoff. Your prize appears once the result is ready."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-violet-300/70">
                Leading bid
              </p>
              <p
                data-testid="leading-bid"
                className="mt-2 break-all text-3xl font-semibold"
              >
                {data ? displayEth(data.highestBid[1]) : "—"}{" "}
                <span className="text-base font-normal text-violet-300">
                  ETH
                </span>
              </p>
              <p className="mt-2 text-xs text-violet-300/65">
                {leading
                  ? "You currently lead this round"
                  : data && data.highestBid[1] > 0n
                    ? shortAddress(data.highestBid[0])
                    : "Be the first to bid"}
              </p>
            </div>
            <div className="border-l border-violet-300/15 pl-5">
              <p className="text-xs uppercase tracking-wide text-violet-300/70">
                Still inside
              </p>
              <p
                className="mt-2 text-3xl font-semibold"
                data-testid="remaining-prizes"
              >
                {data ? String(data.prizeCount) : "—"}{" "}
                <span className="text-base font-normal text-violet-300">
                  prizes
                </span>
              </p>
              <p className="mt-2 text-xs text-violet-300/65">
                {data ? String(data.boxCount) : "—"} Imp Boxes · 50% bonus
                chance while eligible stock remains
              </p>
            </div>
          </div>
          {data ? <DrawProgress auction={data} remaining={remaining} /> : null}
          {timing ? (
            <div
              className="mt-5 rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"
              data-testid="draw-automation"
            >
              <p className="text-xs uppercase tracking-widest text-violet-300/70">
                {timing.action === "startDailyDraw"
                  ? "Automatic draw"
                  : "Automatic prize reveal"}
              </p>
              <p
                className="mt-2 font-mono text-lg text-violet-100"
                data-testid="automation-countdown"
                role="timer"
              >
                {automationRemaining === null
                  ? "Syncing countdown…"
                  : automationRemaining === 0
                    ? "Automation eligible now"
                    : `Eligible in ${countdown(automationRemaining)}`}
              </p>
              <p className="mt-2 text-sm leading-6 text-violet-200/65">
                {timing.action === "startDailyDraw"
                  ? "Automation waits 30 minutes after bidding closes. Once the cutoff is reached, anyone can start the draw sooner."
                  : "Automation waits 30 minutes after randomness arrives. Anyone can reveal the prize now."}{" "}
                Speeding up costs the network fee and does not change the winner
                or your chances.
              </p>
              <div className="mt-3">
                {actionButton(
                  { kind: timing.action },
                  "speed-up-draw",
                  timing.action === "startDailyDraw"
                    ? "Speed up · start draw"
                    : "Speed up · reveal prize",
                  timing.canExecute && !auction.isError,
                  timing.action === "startDailyDraw"
                    ? "The draw step is confirmed. The next bidding window is open."
                    : "The draw is finalized. The winner can claim their prize.",
                )}
              </div>
              {!timing.canExecute ? (
                <p className="mt-2 text-xs text-violet-300/65">
                  Available after the bidding cutoff.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <section className={panel} aria-labelledby="bid-heading">
          <h2 id="bid-heading" className="text-xl font-semibold">
            {data && data.bid > 0n ? "Strengthen your bid" : "Make your bid"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-violet-200/65">
            The winner pays their full standing bid. Other bids stay in the pool
            for the next round.
          </p>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (gate || bidValid)
                void transact(
                  { kind: "bid", value: bidAmount ?? 0n },
                  "place-bid",
                  "Your bid is confirmed.",
                );
            }}
          >
            <label
              className="block text-sm text-violet-200"
              htmlFor="prison-bid"
            >
              ETH to add to your bid
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-violet-300/30 bg-black/20 px-4 focus-within:ring-2 focus-within:ring-violet-300">
              <input
                id="prison-bid"
                autoComplete="off"
                inputMode="decimal"
                className="w-full min-w-0 bg-transparent py-4 text-2xl outline-none"
                placeholder="0.00"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={!!pending}
                aria-describedby="bid-summary bid-note"
              />
              <span className="text-violet-300">ETH</span>
            </div>
            <div id="bid-summary" className="space-y-2 text-sm">
              <div className="flex justify-between gap-3 text-violet-200/65">
                <span>Your standing bid</span>
                <span data-testid="standing-bid">
                  {displayEth(data?.bid ?? 0n)} ETH
                </span>
              </div>
              <div className="flex justify-between gap-3 border-t border-violet-300/15 pt-3">
                <span>New total</span>
                <span className="font-semibold" data-testid="new-bid-total">
                  {displayEth(totalBid)} ETH
                </span>
              </div>
            </div>
            {actionButton(
              { kind: "bid", value: bidAmount ?? 0n },
              "place-bid",
              data && data.bid > 0n ? "Add to bid" : "Place bid",
              bidValid,
              "Your bid is confirmed.",
              true,
            )}
            <p
              id="bid-note"
              className="min-h-10 text-xs leading-5 text-violet-200/65"
            >
              {data?.closed
                ? "The auction is closed. Your prizes and withdrawable funds are below."
                : data?.prizeCount === 0n
                  ? data.drawCount === 0n
                    ? "The prize pool is being prepared. Bidding will be available when prizes are deposited and a bidding window is open."
                    : "There are no main prizes remaining. You can withdraw your standing bid below."
                  : data && remaining === 0
                    ? "Bidding is locked at the cutoff. Please wait for the next window."
                    : amount && !bidAmount
                      ? "Enter a positive ETH amount with no more than 18 decimal places."
                      : address &&
                          bidAmount &&
                          data &&
                          bidAmount >= data.balance
                        ? "Keep enough ETH in your wallet for this bid and the network fee."
                        : data &&
                            bidAmount &&
                            totalBid <= data.highestBid[1] &&
                            !leading
                          ? "This total would not take the lead. Tied bids favor the earlier bidder."
                          : "Your wallet will show the network fee before you confirm. You can withdraw a standing bid before the cutoff."}
            </p>
          </form>
        </section>
      </div>
      {feedback ? (
        <div
          role={feedback.error ? "alert" : "status"}
          className={`rounded-xl border p-4 text-sm ${feedback.error ? "border-red-300/30 bg-red-300/5 text-red-100" : "border-emerald-300/30 bg-emerald-300/5 text-emerald-100"}`}
        >
          <p>{feedback.message}</p>
          {feedback.hash ? (
            target.chainId === 1 ? (
              <a
                className="mt-2 inline-block underline"
                href={`https://etherscan.io/tx/${feedback.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                View transaction
              </a>
            ) : (
              <p className="mt-2 break-all font-mono text-xs">
                Transaction {feedback.hash}
              </p>
            )
          ) : null}
        </div>
      ) : null}
      <BidLeaderboard target={target} account={address} now={now} />
      <section className={panel} aria-labelledby="your-prison">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="your-prison" className="text-xl font-semibold">
            Your bids & prizes
          </h2>
          {address ? (
            <span className="text-xs text-violet-300/65">
              Transfers return to {shortAddress(address)}
            </span>
          ) : null}
        </div>
        <ClaimIntro
          hasWinnings={!!address && !prizes.isError && !!prizes.data?.length}
        />
        {!address ? (
          <p className="mt-4 text-sm text-violet-200/65">
            Connect your wallet above to see your standing bid, refunds, and
            unclaimed prizes.
          </p>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-violet-300/15 p-4">
                <p className="text-sm text-violet-200/65">Standing bid</p>
                <p className="my-3 text-2xl">
                  {displayEth(data?.bid ?? 0n)} ETH
                </p>
                {actionButton(
                  { kind: "cancelBid" },
                  "withdraw-bid",
                  "Withdraw standing bid",
                  cancelAvailable,
                  "Your standing bid has been returned to your wallet.",
                )}
                <p className="mt-3 text-xs text-violet-200/60">
                  {data?.bid
                    ? cancelAvailable
                      ? "Withdraws the entire standing bid."
                      : "Locked until the next bidding window opens."
                    : "No standing bid to withdraw."}
                </p>
              </div>
              <div className="rounded-xl border border-violet-300/15 p-4">
                <p className="text-sm text-violet-200/65">
                  Refund from an aborted draw
                </p>
                <p data-testid="refund-amount" className="my-3 text-2xl">
                  {displayEth(data?.refund ?? 0n)} ETH
                </p>
                {actionButton(
                  { kind: "withdrawRefund" },
                  "withdraw-refund",
                  "Withdraw refund",
                  !!data && data.refund > 0n && !auction.isError,
                  "Your refund has been returned to your wallet.",
                )}
                <p className="mt-3 text-xs text-violet-200/60">
                  A separate refund if a stalled draw is closed before its
                  result.
                </p>
              </div>
            </div>
            <h3 className="mt-7 font-semibold">Prizes ready to claim</h3>
            {prizes.isError ? (
              <p role="alert" className="mt-3 text-sm text-amber-200">
                Couldn’t load your prizes.{" "}
                <button
                  className="underline"
                  onClick={() => void prizes.refetch()}
                >
                  Try again
                </button>
              </p>
            ) : prizes.isPending ? (
              <p role="status" className="mt-3 text-sm text-violet-200/65">
                Checking all your past draws…
              </p>
            ) : prizes.data?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {prizes.data.map((draw) => (
                  <div
                    key={String(draw.id)}
                    className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-wide text-violet-300">
                      Round #{String(draw.id)}
                    </p>
                    <div className="mt-3 text-sm">
                      <CharacterPreview
                        prize={prizeMetadata.get(
                          prizeKey(draw.collection, draw.tokenId),
                        )}
                        collection={draw.collection}
                        tokenId={String(draw.tokenId)}
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {!draw.claimed ? (
                        actionButton(
                          { kind: "claimNFT", drawId: draw.id },
                          `claim-prize-${draw.id}`,
                          "Claim prisoner",
                          true,
                          "Your prisoner has been transferred to your wallet.",
                        )
                      ) : (
                        <span className="text-sm text-emerald-200">
                          Prisoner claimed
                        </span>
                      )}
                      {draw.bonusAwarded && !draw.bonusClaimed
                        ? actionButton(
                            { kind: "claimBonus", drawId: draw.id },
                            `claim-box-${draw.id}`,
                            `Claim Imp Box #${draw.boxTokenId}`,
                            true,
                            "Your Imp Box has been transferred to your wallet.",
                          )
                        : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-violet-200/65">
                No unclaimed prizes yet. Winning prizes appear here after each
                draw is settled.
              </p>
            )}
          </>
        )}
      </section>
      {data?.history.length ? (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Recent escapes</h2>
            <Link
              href="/magic/forgotten-prison/history"
              className="text-sm text-violet-300 underline underline-offset-4"
            >
              View all daily winnings →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-violet-300/15">
            <table className="w-full text-left text-sm">
              <thead className="bg-violet-300/5 text-xs uppercase text-violet-300/70">
                <tr>
                  {["Round", "Winner", "Winning bid", "Prisoner"].map(
                    (title) => (
                      <th
                        key={title}
                        className="whitespace-nowrap p-4 font-medium"
                      >
                        {title}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.history.map((draw) => (
                  <tr
                    key={String(draw.id)}
                    className="border-t border-violet-300/10"
                  >
                    <td className="p-4">#{String(draw.id)}</td>
                    <td className="p-4" title={draw.winner}>
                      {shortAddress(draw.winner)}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {displayEth(draw.price)} ETH
                    </td>
                    <td className="whitespace-nowrap p-4 text-violet-200/75">
                      {draw.status === 3
                        ? `${prizeMetadata.get(prizeKey(draw.collection, draw.tokenId))?.name ?? `${prizeName(draw.collection)} #${draw.tokenId}`}${draw.bonusAwarded ? " + Imp Box" : ""}`
                        : draw.status === 4
                          ? "Aborted · payment refundable"
                          : "Result pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      <PrizePool
        prizes={index.data?.prizes ?? []}
        loading={!index.data && !index.isError}
        error={index.isError}
      />
      <p className="break-all text-xs leading-5 text-violet-300/45">
        {network} contract:{" "}
        {target.chainId === 1 ? (
          <a
            href={`https://etherscan.io/address/${target.address}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {target.address}
          </a>
        ) : (
          target.address
        )}
      </p>
    </div>
  );
};

const PrisonBidding = ({ target }: { target: PrisonTarget }) => (
  <Web3Provider synchronizeSession={false} authenticate={false}>
    <AuctionView target={target} />
  </Web3Provider>
);
export default PrisonBidding;
