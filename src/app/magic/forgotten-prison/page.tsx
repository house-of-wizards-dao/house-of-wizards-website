import Image from "next/image";
import { getPrisonTarget } from "@/lib/forgotten-prison/target";
import { BidderEntry } from "./bidder-entry";

export const metadata = {
  title: "Forgotten Prison | House of Wizards",
  description:
    "Bid to free a Forgotten Runes warrior or wizard. One daily winner, with a chance of an Imp Box bonus.",
};
export const dynamic = "force-dynamic";

const ForgottenPrisonPage = async () => {
  const { target, local } = await getPrisonTarget();
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,#25153b_0%,#100b1c_55%,#080610_100%)] text-[#f1eaff]">
      <div className="mx-auto max-w-6xl space-y-12 px-5 py-10 sm:px-8 sm:py-14">
        <header className="grid grid-cols-[minmax(0,1fr)_112px] items-center gap-x-4 gap-y-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-x-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300">
              House of Wizards / Magic
            </p>
            <h1 className="text-[clamp(1.25rem,6vw,1.875rem)] leading-tight sm:text-5xl lg:text-6xl">
              Forgotten
              <br />
              <span className="text-violet-300">Prison</span>
            </h1>
          </div>
          <figure className="overflow-hidden rounded-xl border border-violet-300/20 bg-[#0b090d] shadow-[0_16px_60px_-25px_rgba(224,92,61,0.4)] sm:row-span-2">
            <Image
              src="/img/forgotten-prison/dread-tower.webp"
              alt="The Dread Tower beneath a crowned skull, with prisoners trapped inside."
              width={720}
              height={1018}
              sizes="(max-width: 639px) 112px, (max-width: 1023px) 220px, 260px"
              preload
              className="h-auto w-full"
            />
          </figure>
          <div className="col-span-2 space-y-4 sm:col-span-1">
            <p className="max-w-xl font-sans text-lg leading-relaxed text-violet-100/75">
              One winning bid. One prisoner freed.
              <br />
              Bid for a warrior or wizard, with a chance to take home an Imp Box
              too.
            </p>
            {local ? (
              <p className="inline-flex rounded-full border border-amber-300/25 bg-amber-200/5 px-3 py-1 font-sans text-xs text-amber-200">
                Local preview · test ETH and NFTs
              </p>
            ) : null}
          </div>
        </header>
        <BidderEntry target={target} local={local} />
        <section className="border-t border-violet-300/15 pt-8">
          <h2 className="text-xl">How the prison works</h2>
          <div className="mt-6 grid gap-7 font-sans md:grid-cols-3">
            {[
              [
                "01",
                "Place your bid",
                "Your ETH stays in your standing bid. You can add more at any time before the cutoff. If you don’t win, your full bid rolls into the next round.",
              ],
              [
                "02",
                "The highest bid wins",
                "At the daily cutoff, the highest standing bid wins and pays its entire bid. Equal bids favor the account that reached that amount first.",
              ],
              [
                "03",
                "Claim your prisoner",
                "Randomness selects an eligible warrior or wizard. There’s also a 50% chance of an Imp Box while eligible boxes remain. Claim your prizes to your wallet.",
              ],
            ].map(([number, title, text]) => (
              <div key={number}>
                <p className="mb-3 text-xs tracking-widest text-violet-400">
                  {number}
                </p>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm leading-6 text-violet-200/70">{text}</p>
              </div>
            ))}
          </div>
          <details className="mt-8 rounded-xl border border-violet-300/15 p-5 font-sans">
            <summary className="cursor-pointer font-medium">
              Can I withdraw my bid?
            </summary>
            <p className="mt-3 text-sm leading-6 text-violet-200/75">
              You can withdraw your entire standing bid before the cutoff. Once
              a draw locks the winning payment, that payment cannot be
              cancelled. Losing bids remain yours and become withdrawable when
              the next bidding window opens. Standing bids can also be withdrawn
              after the auction closes or all main prizes are awarded. If a
              stalled draw is aborted, its winner can withdraw a separate
              refund.
            </p>
          </details>
        </section>
      </div>
    </div>
  );
};
export default ForgottenPrisonPage;
