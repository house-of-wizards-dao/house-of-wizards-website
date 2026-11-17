"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import type { PrisonTarget } from "@/lib/forgotten-prison/bidding";
import {
  usePrisonIndex,
  IndexFreshness,
  WinningRound,
} from "../indexed-auction";

export const PrisonHistory = ({ target }: { target: PrisonTarget }) => {
  const [page, setPage] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(timer);
  }, []);
  const query = usePrisonIndex(target, page);
  const data = query.data;
  return (
    <div className="space-y-7 font-sans">
      {query.isError ? (
        <div
          role="alert"
          className="rounded-xl border border-amber-300/30 p-5 text-sm text-amber-200"
        >
          Couldn’t refresh daily winnings.{" "}
          {data ? "Showing the last synced results. " : ""}
          <button className="underline" onClick={() => void query.refetch()}>
            Try again
          </button>
        </div>
      ) : null}
      {data ? (
        <>
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-violet-300/20 bg-violet-300/5 p-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-violet-300/65">
                Prisoners freed
              </p>
              <p className="mt-2 text-3xl">{data.finalizedCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-violet-300/65">
                Total winning bids
              </p>
              <p className="mt-2 break-all text-2xl sm:text-3xl">
                {formatEther(BigInt(data.totalWonWei))}{" "}
                <span className="text-base text-violet-300">ETH</span>
              </p>
            </div>
          </div>
          <IndexFreshness data={data} now={now} />
          {data.history.length ? (
            <div className="space-y-5">
              {data.history.map((draw) => (
                <WinningRound key={draw.id} draw={draw} target={target} />
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-violet-300/20 p-8 text-center">
              <h2 className="text-xl">
                {page === 0
                  ? "The first escape is still ahead"
                  : "No rounds on this page"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-violet-200/65">
                {page === 0
                  ? "Each daily draw will leave its trail here: the winner, the bid, the prisoner, and any Imp Box bonus."
                  : "Return to the newer rounds to see the latest results."}
              </p>
              <Link
                href="/magic/forgotten-prison"
                className="mt-5 inline-block text-sm text-violet-300 underline underline-offset-4"
              >
                Visit the auction →
              </Link>
            </section>
          )}
          {data.drawCount > 20 || page > 0 ? (
            <nav
              aria-label="Winnings pagination"
              className="flex items-center justify-between gap-3"
            >
              <button
                className="rounded-lg border border-violet-300/30 px-4 py-2 text-sm disabled:opacity-35"
                disabled={page === 0}
                onClick={() => setPage((value) => value - 1)}
              >
                ← Newer rounds
              </button>
              <span className="text-xs text-violet-200/65">
                Page {page + 1}
              </span>
              <button
                className="rounded-lg border border-violet-300/30 px-4 py-2 text-sm disabled:opacity-35"
                disabled={(page + 1) * 20 >= data.drawCount}
                onClick={() => setPage((value) => value + 1)}
              >
                Older rounds →
              </button>
            </nav>
          ) : null}
          <p className="text-xs leading-5 text-violet-200/45">
            Dates use your device’s time zone.{" "}
            {target.chainId === 1
              ? "Recent results may update as Ethereum confirms the chain."
              : "These are local test rounds."}
          </p>
        </>
      ) : !query.isError ? (
        <p role="status" className="py-12 text-center text-violet-200/65">
          Loading the trail of daily winnings…
        </p>
      ) : null}
    </div>
  );
};
