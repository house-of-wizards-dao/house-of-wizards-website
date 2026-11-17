"use client";

import dynamic from "next/dynamic";
import type { PrisonTarget } from "@/lib/forgotten-prison/bidding";

const Bidding = dynamic(() => import("./prison-bidding"), {
  ssr: false,
  loading: () => (
    <p
      role="status"
      className="rounded-2xl border border-violet-300/20 p-8 font-sans text-violet-200/70"
    >
      Loading the auction…
    </p>
  ),
});
export const BidderEntry = ({
  target,
  local,
}: {
  target: PrisonTarget | null;
  local: boolean;
}) =>
  target ? (
    <Bidding target={target} />
  ) : (
    <section className="rounded-2xl border border-violet-300/20 bg-violet-200/5 p-8 font-sans">
      <h2 className="text-2xl font-semibold">
        {local ? "Local preview is offline" : "The prison is being prepared"}
      </h2>
      <p className="mt-3 text-violet-200/75">
        {local
          ? "Start the local fork, then refresh this page to try the bidding experience."
          : "Bidding will open here when the prize pool is ready. Check back for the first auction."}
      </p>
    </section>
  );
