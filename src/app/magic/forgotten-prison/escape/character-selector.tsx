"use client";

import { useMemo, useState } from "react";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import {
  characterKey,
  VISITOR,
  walletCharacters,
  type EscapeCharacter,
} from "@/lib/forgotten-prison/escape";

export const CharacterSelector = ({
  address,
  onSelect,
  onConnect,
}: {
  address?: string;
  onSelect: (character: EscapeCharacter) => void;
  onConnect: () => void;
}) => {
  const { data, loading, error } = useWalletNFTs(address ? [address] : []);
  const characters = useMemo(() => walletCharacters(data), [data]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = characters.filter((character) =>
    `${character.name} ${character.family} ${character.tokenId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const current = Math.min(
    page,
    Math.max(0, Math.ceil(filtered.length / 12) - 1),
  );
  const chosen = characters.find(
    (character) => characterKey(character) === selected,
  );
  return (
    <section
      className="rounded-2xl border border-violet-300/20 bg-[#171022] p-5 font-sans sm:p-7"
      aria-labelledby="choose-character"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-200/65">
            01 / The visitor
          </p>
          <h2 id="choose-character" className="mt-2 text-2xl font-semibold">
            Who’s knocking?
          </h2>
        </div>
        {!address ? (
          <button
            type="button"
            onClick={onConnect}
            className="rounded-lg bg-violet-300 px-5 py-3 font-semibold text-[#1b102c]"
          >
            Connect wallet
          </button>
        ) : (
          <span className="text-xs text-violet-300">
            {characters.length} characters in your wallet
          </span>
        )}
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-200/65">
        Bring a Wizard, Soul, or Warrior from your connected wallet. Your
        visitor is only an avatar; it is never transferred or burned.
      </p>
      {address ? (
        <>
          <label
            htmlFor="visitor-search"
            className="mt-5 block text-xs text-violet-200"
          >
            Find your character
          </label>
          <input
            id="visitor-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Name, collection, or token number"
            className="mt-2 w-full rounded-lg border border-violet-300/25 bg-black/20 px-4 py-3 text-sm focus:outline-violet-300"
          />
          {loading ? (
            <p role="status" className="mt-5 text-sm text-violet-200/65">
              Looking for your Wizards, Souls, and Warriors…
            </p>
          ) : error ? (
            <p role="alert" className="mt-5 text-sm text-amber-200">
              Couldn’t load your characters. You can use the guest avatar or
              reload to try again.
            </p>
          ) : !characters.length ? (
            <p className="mt-5 text-sm text-violet-200/65">
              No supported characters were found. You can still claim with the
              guest avatar.
            </p>
          ) : !filtered.length ? (
            <p className="mt-5 text-sm text-violet-200/65">
              No characters match that search.
            </p>
          ) : null}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered
              .slice(current * 12, current * 12 + 12)
              .map((character) => (
                <button
                  key={characterKey(character)}
                  type="button"
                  aria-pressed={selected === characterKey(character)}
                  onClick={() => setSelected(characterKey(character))}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition focus-visible:outline-violet-300 ${selected === characterKey(character) ? "border-amber-200 bg-amber-200/10" : "border-violet-300/15 bg-black/15 hover:border-violet-300/60"}`}
                >
                  {character.imageUrl /* Native image: wallet metadata can use several official image hosts. */ ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={character.imageUrl}
                      alt=""
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded bg-black/20 object-contain [image-rendering:pixelated]"
                    />
                  ) : (
                    <span className="text-xl text-violet-300">✦</span>
                  )}
                  <span className="min-w-0">
                    <span className="block break-words text-xs font-medium leading-5">
                      {character.name}
                    </span>
                    <span className="mt-1 block text-[10px] capitalize text-violet-300/60">
                      {character.family} #{character.tokenId}
                    </span>
                  </span>
                </button>
              ))}
          </div>
          {filtered.length > 12 ? (
            <nav
              aria-label="Character pages"
              className="mt-4 flex items-center justify-between text-sm"
            >
              <button
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
                className="disabled:opacity-30"
              >
                ← Previous
              </button>
              <span>
                {current + 1} / {Math.ceil(filtered.length / 12)}
              </span>
              <button
                disabled={(current + 1) * 12 >= filtered.length}
                onClick={() => setPage(current + 1)}
                className="disabled:opacity-30"
              >
                Next →
              </button>
            </nav>
          ) : null}
        </>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-violet-300/15 pt-5">
        {chosen ? (
          <button
            type="button"
            className="rounded-xl bg-amber-200 px-6 py-3 text-sm font-semibold text-[#251a20]"
            onClick={() => onSelect(chosen)}
          >
            Approach the prison →
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-xl border border-violet-300/30 px-5 py-3 text-sm text-violet-100 hover:bg-violet-300/10"
          onClick={() => onSelect(VISITOR)}
        >
          Visit as a guest
        </button>
        <p className="text-xs text-violet-300/55">
          Guest avatar: Wild Mage Lumos. A winning wallet is still required to
          claim.
        </p>
      </div>
    </section>
  );
};
