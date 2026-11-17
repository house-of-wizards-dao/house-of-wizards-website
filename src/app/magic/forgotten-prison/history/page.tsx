import Link from "next/link";
import { getPrisonTarget } from "@/lib/forgotten-prison/target";
import { PrisonHistory } from "./history-client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Daily winnings | Forgotten Prison | House of Wizards",
  description:
    "Follow every Forgotten Prison draw: winning bids, freed warriors and wizards, Imp Box bonuses, and prize claims.",
};
const PrisonHistoryPage = async () => {
  const { target, local } = await getPrisonTarget();
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#25153b_0%,#100b1c_55%,#080610_100%)] text-[#f1eaff]">
      <div className="mx-auto max-w-5xl space-y-10 px-5 py-10 sm:px-8 sm:py-14">
        <header className="space-y-5">
          <Link
            href="/magic/forgotten-prison"
            className="font-sans text-sm text-violet-300 underline underline-offset-4"
          >
            ← Forgotten Prison
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-violet-300">
            The trail of escapes
          </p>
          <h1 className="text-4xl sm:text-5xl">
            Daily <span className="text-violet-300">winnings</span>
          </h1>
          <p className="max-w-2xl font-sans leading-7 text-violet-100/70">
            Every winner leaves a trace. Follow the daily draws, the prisoners
            they freed, and the treasures they claimed.
          </p>
          {local ? (
            <p className="font-sans text-xs text-amber-200">
              Local preview · test ETH and NFTs
            </p>
          ) : null}
        </header>
        {target ? (
          <PrisonHistory target={target} />
        ) : (
          <p className="font-sans text-violet-200/70">
            Daily winnings will appear when the auction is available.
          </p>
        )}
      </div>
    </div>
  );
};
export default PrisonHistoryPage;
