"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import type { ReactNode } from "react";
import type { PrisonTarget, Auction } from "@/lib/forgotten-prison/bidding";
import { shortAddress } from "@/lib/forgotten-prison/bidding";
import {
  prisonIndexSchema,
  indexIsDelayed,
  drawStatusLabel,
  type PrisonIndex,
  type IndexedDraw,
  type IndexedPrize,
} from "@/lib/forgotten-prison/index-types";
import { CharacterPreview } from "./prize-pool";

export const indexQueryKey = (target: PrisonTarget) =>
  ["prison-index", target.chainId, target.address.toLowerCase()] as const;
export const usePrisonIndex = (target: PrisonTarget, page = 0) =>
  useQuery({
    queryKey: [...indexQueryKey(target), page],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/forgotten-prison/index?page=${page}`, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(20_000)]),
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error("The auction index is temporarily unavailable.");
      const data = prisonIndexSchema.parse(await response.json());
      if (
        data.chainId !== target.chainId ||
        data.contract.toLowerCase() !== target.address.toLowerCase()
      )
        throw new Error("The auction network changed. Refresh this page.");
      return data;
    },
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: 1,
  });

export const ChainLink = ({
  target,
  kind,
  value,
  children,
}: {
  target: PrisonTarget;
  kind: "address" | "tx";
  value: string;
  children: ReactNode;
}) =>
  target.chainId === 1 ? (
    <a
      href={`https://etherscan.io/${kind}/${value}`}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-violet-300/40 underline-offset-4 hover:text-white"
      title={value}
    >
      {children}
    </a>
  ) : (
    <span title={value}>{children}</span>
  );

export const IndexFreshness = ({
  data,
  now,
}: {
  data: PrisonIndex;
  now: number;
}) => (
  <p
    className={`text-xs leading-5 ${indexIsDelayed(data, now) ? "text-amber-200" : "text-violet-200/55"}`}
  >
    {data.headBlock > data.blockNumber
      ? "Catching up · "
      : indexIsDelayed(data, now)
        ? "Updates delayed · "
        : ""}
    Last synced {new Date(data.indexedAt).toLocaleTimeString()} · Block{" "}
    {data.blockNumber.toLocaleString()}
    {data.source === "local"
      ? " · Local preview"
      : " · Updates about every minute"}
  </p>
);

export const BidLeaderboard = ({
  target,
  account,
  now,
}: {
  target: PrisonTarget;
  account?: string;
  now: number;
}) => {
  const query = usePrisonIndex(target);
  const data = query.data;
  return (
    <section
      className="rounded-2xl border border-violet-300/20 bg-[#180f27]/80 p-5 sm:p-7"
      aria-labelledby="leaderboard-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="leaderboard-heading" className="text-xl font-semibold">
          Bid leaderboard
        </h2>
        <Link
          href="/magic/forgotten-prison/history"
          className="text-sm text-violet-300 underline underline-offset-4"
        >
          Daily winnings →
        </Link>
      </div>
      <p className="mt-2 text-sm text-violet-200/65">
        Standing bids for the next draw. Equal bids favor the wallet that
        reached that amount first.
      </p>
      {query.isError ? (
        <p role="alert" className="mt-4 text-sm text-amber-200">
          Couldn’t refresh the leaderboard.{" "}
          {data ? "Showing the last synced bids. " : ""}
          <button className="underline" onClick={() => void query.refetch()}>
            Try again
          </button>
        </p>
      ) : null}
      {data ? (
        <>
          {data.leaderboard.length ? (
            <div className="mt-5 overflow-x-auto">
              <table
                className="w-full text-left text-sm"
                data-testid="bid-leaderboard"
              >
                <caption className="sr-only">
                  Standing bids ranked by amount, then earliest tie priority
                </caption>
                <thead className="text-xs uppercase tracking-wide text-violet-300/65">
                  <tr>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Rank
                    </th>
                    <th scope="col" className="py-3 pr-4 font-medium">
                      Bidder
                    </th>
                    <th scope="col" className="py-3 text-right font-medium">
                      Standing bid
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.leaderboard.map((bid, i) => (
                    <tr
                      key={bid.bidder}
                      className={`border-t border-violet-300/10 ${bid.bidder.toLowerCase() === account?.toLowerCase() ? "bg-violet-300/10" : ""}`}
                    >
                      <td className="py-4 pr-4 text-violet-300">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 pr-4">
                        <ChainLink
                          target={target}
                          kind="address"
                          value={bid.bidder}
                        >
                          {shortAddress(bid.bidder)}
                        </ChainLink>
                        {bid.bidder.toLowerCase() === account?.toLowerCase() ? (
                          <span className="ml-2 text-xs text-violet-300">
                            You
                          </span>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap py-4 text-right font-mono">
                        {formatEther(BigInt(bid.amount))} ETH
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-violet-200/55">
                {data.bidderCount} standing{" "}
                {data.bidderCount === 1 ? "bid" : "bids"}
                {data.bidderCount > 50 ? " · Showing the top 50" : ""}
              </p>
            </div>
          ) : (
            <p className="my-6 text-sm text-violet-200/65">
              No standing bids in the latest sync.
            </p>
          )}
          <div className="mt-4 border-t border-violet-300/10 pt-4">
            <IndexFreshness data={data} now={now} />
          </div>
        </>
      ) : !query.isError ? (
        <p role="status" className="mt-6 text-sm text-violet-200/65">
          Loading standing bids…
        </p>
      ) : null}
    </section>
  );
};

export const DrawProgress = ({
  auction,
  remaining,
}: {
  auction: Auction;
  remaining: number;
}) => {
  const pending = auction.history.find(
    (draw) => draw.id === auction.pendingDrawId,
  );
  const latest = auction.history[0];
  const title =
    pending?.status === 2
      ? `Round #${pending.id} · randomness received`
      : pending?.status === 1
        ? `Round #${pending.id} · draw started`
        : auction.closed
          ? "The auction is closed"
          : remaining === 0 && auction.prizeCount > 0n
            ? "Cutoff reached · draw not started"
            : latest?.status === 3
              ? `Round #${latest.id} · prize awarded`
              : "The first draw has not started";
  const description =
    pending?.status === 2
      ? "The random values are ready. The prize will appear when this draw is finalized."
      : pending?.status === 1
        ? "The winning bid is locked. Waiting for Chainlink to return the random values that select the prize."
        : auction.closed
          ? "Previously awarded prizes remain claimable."
          : remaining === 0 && auction.prizeCount > 0n
            ? "Bidding is locked. The next round opens when the daily draw is started."
            : latest?.status === 3
              ? "The result is recorded in daily winnings. The winner can claim at any time."
              : "The daily draw can begin after the bidding cutoff, when an eligible prize and a funded bid are available.";
  return (
    <div
      className="mt-6 border-t border-violet-300/15 pt-5"
      data-testid="draw-progress"
    >
      <p className="text-xs uppercase tracking-widest text-violet-300/70">
        Draw progress
      </p>
      <p className="mt-2 font-semibold text-violet-100">{title}</p>
      <p className="mt-2 text-sm leading-6 text-violet-200/65">{description}</p>
      {pending && remaining > 0 ? (
        <p className="mt-2 text-xs text-violet-300">
          New bids enter the following round while this draw settles.
        </p>
      ) : null}
    </div>
  );
};

export const WinningRound = ({
  draw,
  target,
  prize,
}: {
  draw: IndexedDraw;
  target: PrisonTarget;
  prize?: IndexedPrize;
}) => (
  <article
    className="rounded-2xl border border-violet-300/20 bg-[#180f27]/80 p-5 sm:p-7"
    data-testid="winning-round"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">Round #{draw.id}</h2>
      <span
        className={`rounded-full border px-3 py-1 text-xs ${draw.status === "finalized" ? "border-emerald-300/25 text-emerald-200" : "border-amber-300/25 text-amber-200"}`}
      >
        {drawStatusLabel(draw.status)}
      </span>
    </div>
    <p className="mt-2 text-xs text-violet-200/55">
      <time dateTime={draw.finalizedAt ?? draw.startedAt}>
        {new Date(draw.finalizedAt ?? draw.startedAt).toLocaleString(
          undefined,
          { dateStyle: "medium", timeStyle: "short" },
        )}
      </time>
    </p>
    <dl className="mt-6 grid gap-6 sm:grid-cols-3">
      <div>
        <dt className="text-xs uppercase tracking-wide text-violet-300/60">
          Winner
        </dt>
        <dd className="mt-2">
          <ChainLink target={target} kind="address" value={draw.winner}>
            {shortAddress(draw.winner)}
          </ChainLink>
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-violet-300/60">
          {draw.status === "aborted" ? "Refundable payment" : "Winning bid"}
        </dt>
        <dd className="mt-2 break-all font-mono">
          {formatEther(BigInt(draw.price))} ETH
        </dd>
      </div>
      <div>
        <dt className="text-xs uppercase tracking-wide text-violet-300/60">
          Prisoner freed
        </dt>
        <dd className="mt-2">
          {draw.status === "finalized" && !draw.claimed ? (
            "Waiting behind the gate"
          ) : draw.status === "finalized" &&
            draw.collection &&
            draw.tokenId !== null ? (
            <CharacterPreview
              prize={prize}
              collection={draw.collection}
              tokenId={draw.tokenId}
            />
          ) : draw.status === "aborted" ? (
            "No prize awarded"
          ) : (
            "Selection pending"
          )}
        </dd>
      </div>
    </dl>
    {draw.status === "finalized" ? (
      <div className="mt-6 grid gap-3 border-t border-violet-300/15 pt-5 sm:grid-cols-2">
        <div className="text-sm text-violet-200/75">
          <p>Main prize · {draw.claimed ? "Claimed" : "Ready to claim"}</p>
          {draw.recipient ? (
            <p className="mt-1 text-xs">
              Sent to{" "}
              <ChainLink target={target} kind="address" value={draw.recipient}>
                {shortAddress(draw.recipient)}
              </ChainLink>
            </p>
          ) : null}
          {draw.claimTx ? (
            <p className="mt-1 text-xs">
              <ChainLink target={target} kind="tx" value={draw.claimTx}>
                Claim transaction
              </ChainLink>
            </p>
          ) : null}
        </div>
        <div className="text-sm text-violet-200/75">
          <p>
            {draw.boxTokenId !== null
              ? draw.bonusClaimed
                ? `Imp Box #${draw.boxTokenId} · Claimed`
                : "Bonus waiting behind the gate"
              : "No Imp Box bonus this round"}
          </p>
          {draw.bonusRecipient ? (
            <p className="mt-1 text-xs">
              Sent to{" "}
              <ChainLink
                target={target}
                kind="address"
                value={draw.bonusRecipient}
              >
                {shortAddress(draw.bonusRecipient)}
              </ChainLink>
            </p>
          ) : null}
          {draw.bonusClaimTx ? (
            <p className="mt-1 text-xs">
              <ChainLink target={target} kind="tx" value={draw.bonusClaimTx}>
                Bonus claim transaction
              </ChainLink>
            </p>
          ) : null}
        </div>
      </div>
    ) : null}
    {target.chainId === 1 ? (
      <div className="mt-5 flex gap-5 text-xs text-violet-300">
        <ChainLink target={target} kind="tx" value={draw.startTx}>
          Draw transaction ↗
        </ChainLink>
        {draw.finalizeTx ? (
          <ChainLink target={target} kind="tx" value={draw.finalizeTx}>
            Prize award transaction ↗
          </ChainLink>
        ) : null}
      </div>
    ) : null}
  </article>
);
