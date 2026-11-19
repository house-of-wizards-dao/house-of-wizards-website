import Link from "next/link";
import { getPrisonTarget } from "@/lib/forgotten-prison/target";
import { validDrawId } from "@/lib/forgotten-prison/escape";
import { EscapeEntry } from "./escape-entry";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Free a prisoner | Forgotten Prison | House of Wizards",
  description:
    "Meet Stank Death of the Dread Tower. Choose your character, visit the goblin guard, and free your Forgotten Prison winnings.",
};
const EscapePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ draw?: string }>;
}) => {
  const [{ target, local }, params] = await Promise.all([
    getPrisonTarget(),
    searchParams,
  ]);
  return (
    <div className="-mt-12 min-h-screen bg-[radial-gradient(ellipse_at_top,#30203d,#100b1c_60%,#080610)] px-4 py-8 text-violet-50 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/magic/forgotten-prison#your-prison"
          className="font-sans text-sm text-violet-300 hover:underline"
        >
          ← Back to the auction
        </Link>
        <header className="mb-8 mt-8 max-w-3xl space-y-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/70">
            An audience with Stank Death
          </p>
          <h1 className="text-2xl leading-relaxed sm:text-4xl">
            Oh, trying to free someone from the{" "}
            <span className="text-violet-300">Forgotten Prison?</span>
          </h1>
          <p className="max-w-xl font-sans text-sm leading-6 text-violet-200/65">
            Choose who will deliver the bribe. A crooked guard, a heavy gate,
            and someone waiting on the other side.
          </p>
          {local ? (
            <p className="font-sans text-xs text-amber-200">
              Local preview · test ETH and NFTs
            </p>
          ) : null}
        </header>
        <EscapeEntry target={target} drawId={validDrawId(params.draw)} />
      </div>
    </div>
  );
};
export default EscapePage;
