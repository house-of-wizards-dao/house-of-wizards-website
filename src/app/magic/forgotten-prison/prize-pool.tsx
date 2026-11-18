"use client";

import { useState } from "react";
import Image from "next/image";
import type { IndexedPrize } from "@/lib/forgotten-prison/index-types";
import { prizeKind } from "@/lib/forgotten-prison/inventory";

export const CharacterPreview = ({
  prize,
  collection,
  tokenId,
}: {
  prize?: IndexedPrize;
  collection: string;
  tokenId: string;
}) => {
  const label = `${prizeKind(collection)} #${tokenId}`;
  return (
    <div
      className="flex min-w-0 items-center gap-3"
      data-testid="prize-character"
    >
      {prize?.imageUrl ? (
        <Image
          src={prize.imageUrl}
          alt={prize.name ?? label}
          width={72}
          height={72}
          sizes="72px"
          className="h-[72px] w-[72px] shrink-0 rounded-lg bg-black/20 object-contain [image-rendering:pixelated]"
        />
      ) : null}
      <div className="min-w-0">
        <p className="break-words font-medium text-violet-100">
          {prize?.name ?? label}
        </p>
        {prize?.name ? (
          <p className="mt-1 text-xs text-violet-300/65">{label}</p>
        ) : null}
      </div>
    </div>
  );
};

export const PrizePool = ({
  prizes,
  loading,
  error,
}: {
  prizes: IndexedPrize[];
  loading: boolean;
  error: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const available = prizes.filter((prize) => prize.status === "available");
  const filtered = available.filter((prize) =>
    `${prize.name ?? ""} ${prize.kind} #${prize.tokenId}`
      .toLowerCase()
      .includes(search.toLowerCase().trim()),
  );
  const lastPage = Math.max(0, Math.ceil(filtered.length / 12) - 1);
  const currentPage = Math.min(page, lastPage);
  return (
    <section
      className="rounded-2xl border border-violet-300/20 bg-[#180f27]/80 p-5 sm:p-7"
      aria-labelledby="prize-pool-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="prize-pool-heading" className="text-xl font-semibold">
          Inside the prison
        </h2>
        <span
          className="text-sm text-violet-300"
          data-testid="prize-pool-count"
        >
          {available.length} prizes in the pool
        </span>
      </div>
      <p className="mt-2 text-sm text-violet-200/65">
        Meet the Warriors and Wizards awaiting their escape. Awarded prizes
        leave this pool as soon as the draw is finalized.
      </p>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-amber-200">
          The prize list couldn’t refresh. Showing the last available
          information.
        </p>
      ) : null}
      {loading ? (
        <p role="status" className="mt-5 text-sm text-violet-200/65">
          Loading the prize pool…
        </p>
      ) : (
        <>
          <label
            className="mt-5 block text-sm text-violet-200"
            htmlFor="prize-search"
          >
            Find a prisoner
          </label>
          <input
            id="prize-search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search names, token IDs, Warriors or Wizards"
            className="mt-2 w-full rounded-lg border border-violet-300/25 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-300"
          />
          <div
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="prize-pool"
          >
            {filtered
              .slice(currentPage * 12, (currentPage + 1) * 12)
              .map((prize) => (
                <div
                  key={`${prize.collection}:${prize.tokenId}`}
                  className="rounded-xl border border-violet-300/15 bg-violet-300/5 p-3 text-sm"
                >
                  <CharacterPreview
                    prize={prize}
                    collection={prize.collection}
                    tokenId={prize.tokenId}
                  />
                </div>
              ))}
          </div>
          {!filtered.length ? (
            <p className="mt-5 text-sm text-violet-200/65">
              {available.length
                ? "No prisoners match your search."
                : "No Warriors or Wizards remain in the indexed prize pool."}
            </p>
          ) : null}
          {lastPage > 0 ? (
            <nav
              aria-label="Prize pool pages"
              className="mt-5 flex items-center justify-between text-sm"
            >
              <button
                className="rounded-lg border border-violet-300/30 px-3 py-2 disabled:opacity-35"
                disabled={currentPage === 0}
                onClick={() => setPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="text-violet-200/65">
                {currentPage + 1} / {lastPage + 1}
              </span>
              <button
                className="rounded-lg border border-violet-300/30 px-3 py-2 disabled:opacity-35"
                disabled={currentPage === lastPage}
                onClick={() => setPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          ) : null}
        </>
      )}
    </section>
  );
};
