import Image from "next/image";
import Link from "next/link";

export default function GuardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#080510] via-[#140a24] to-[#05030b] text-[#e7ddff]">
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center">
        <p className="text-sm text-[#b8a8d9]">
          <Link
            href="/guard/play"
            className="font-semibold text-[#c9a6ff] underline decoration-violet-500/50 underline-offset-4 transition hover:text-[#e0d0ff]"
          >
            Play the minigame
          </Link>
        </p>
        <h1 className="text-4xl font-bold text-[#c9a6ff] md:text-6xl">
          The Guard of the Puppet and the Goat
        </h1>
        <div className="w-full max-w-4xl overflow-hidden">
          <Image
            src="/img/guard/temple_bg_high_warrior.gif"
            alt="Animated temple and warrior guard scene"
            width={1562}
            height={1562}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </div>

        <div className="max-w-3xl space-y-5">
          <p className="text-xl text-[#cdb6ff] md:text-2xl">
            Beyond the scorched peaks, where ancient stones whisper forgotten
            secrets, a brotherhood of warriors stands watch over the sacred
            scriptures.
          </p>
          <p className="text-[#c8bddf]">
            The call goes out across the vast expanse. The Guard seeks sentinels
            of ancient wisdom and guardians of the balance between light and
            shadow.
          </p>
        </div>

        <div className="w-full max-w-3xl rounded-lg border border-violet-500/35 bg-violet-950/35 p-6 text-left backdrop-blur-[1px]">
          <h2 className="mb-3 text-xl font-bold text-[#c9a6ff]">
            To Join the Secret Guard:
          </h2>
          <ul className="space-y-2 text-[#d2c7ea]">
            <li>👹 Be a Warrior with a Shield of the Puppet</li>
            <li>🐐 Be a Warrior with a Shield of the Goat</li>
            <li>🏛️ Be a lucky Warrior</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
