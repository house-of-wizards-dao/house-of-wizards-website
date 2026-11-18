import { getPrisonTarget } from "@/lib/forgotten-prison/target";
import { BidderEntry } from "./bidder-entry";
import { PrisonHeader } from "./prison-header";

export const metadata = {
  title: "Forgotten Prison | House of Wizards",
  description:
    "Bid to free a Forgotten Runes warrior or wizard. One daily winner, with a chance of an Imp Box bonus.",
};
export const dynamic = "force-dynamic";

const ForgottenPrisonPage = async () => {
  const { target, local } = await getPrisonTarget();
  return (
    <div className="-mt-12 min-h-screen bg-[radial-gradient(ellipse_at_top_left,#25153b_0%,#100b1c_55%,#080610_100%)] text-[#f1eaff]">
      <PrisonHeader local={local} />
      <div className="mx-auto max-w-6xl space-y-12 px-5 py-10 sm:px-8 sm:py-14">
        <div id="prison-auction" className="scroll-mt-6">
          <BidderEntry target={target} local={local} />
        </div>
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
