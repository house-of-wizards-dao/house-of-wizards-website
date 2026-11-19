import Image from "next/image";
import Link from "next/link";

export const ClaimIntro = ({ hasWinnings }: { hasWinnings: boolean }) => (
  <div className="mt-5 grid grid-cols-[80px_minmax(0,1fr)] items-center gap-4 rounded-xl border border-violet-300/15 bg-black/15 p-4 sm:grid-cols-[144px_minmax(0,1fr)] sm:gap-x-6 sm:p-5">
    <Image
      src="/img/forgotten-prison/stank-death-guard.webp"
      alt="Stank Death of the Dread Tower, the goblin guard, with prisoners behind him."
      width={480}
      height={679}
      sizes="(max-width: 639px) 80px, 144px"
      className="h-auto w-full rounded-lg sm:row-span-2"
    />
    <h3 className="self-center text-lg font-semibold text-violet-100 sm:self-end sm:text-xl">
      {hasWinnings ? "Your bribe worked." : "The guard has his price."}
    </h3>
    <div className="col-span-2 max-w-xl space-y-3 sm:col-span-1 sm:self-start">
      <p className="text-sm leading-6 text-violet-200/75">
        {hasWinnings ? (
          <>
            You managed to bribe the goblin guard,{" "}
            <strong className="font-medium text-violet-100">
              Stank Death of the Dread Tower
            </strong>
            . Your winning bid convinced him to look the other way. Claim your
            winnings at the prison and discover who you’re freeing.
          </>
        ) : (
          <>
            <strong className="font-medium text-violet-100">
              Stank Death of the Dread Tower
            </strong>{" "}
            stands between you and the prisoners. Win a daily auction and your
            winning bid becomes a bribe to the goblin guard. Your prizes will be
            waiting behind his gate.
          </>
        )}
      </p>
      <Link
        href="/magic/forgotten-prison/escape"
        className="inline-block text-sm text-violet-300 underline underline-offset-4"
      >
        Visit Stank at the prison →
      </Link>
      {hasWinnings ? (
        <p className="text-xs leading-5 text-violet-300/65">
          There’s no deadline to claim your prizes.
        </p>
      ) : null}
    </div>
  </div>
);
