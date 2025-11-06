import { useMemo, useState, ChangeEvent, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Web3Provider } from "@/components/Web3Provider";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { traits, type Trait } from "@/data/traits";
import { wizardsWithTraits } from "@/data/wizardsWithTraits";

const getWizardImage = (idx: number): string => {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${idx}.png`;
};

type Wizard = (typeof wizardsWithTraits)[number];

type TraitPart = "background" | "body" | "familiar" | "head" | "prop" | "rune";

const TRAIT_PARTS: TraitPart[] = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
];

export default function PfpPage() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<
    Partial<Record<TraitPart, number>>
  >({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  const traitIndexToDisplayName = useMemo(() => {
    const map = new Map<number, string>();
    for (const t of traits) {
      map.set(t.idx, t.displayName);
    }
    return map;
  }, []);

  const partToTraitOptions: Record<
    TraitPart,
    Array<{ value: number; label: string }>
  > = useMemo(() => {
    const byPart = new Map<
      TraitPart | "other",
      Array<{ value: number; label: string }>
    >();

    const push = (key: TraitPart | "other", idx: number, name: string) => {
      const arr = byPart.get(key) ?? [];
      arr.push({ value: idx, label: name });
      byPart.set(key, arr);
    };

    for (const t of traits) {
      if (t.part) {
        push(t.part as TraitPart, t.idx, t.displayName);
      } else {
        push("other", t.idx, t.displayName);
      }
    }

    // Backgrounds: infer from wizards' background values that exist in traits
    const backgroundSet = new Set<number>();
    for (let i = 0; i < wizardsWithTraits.length; i++) {
      backgroundSet.add(wizardsWithTraits[i].background);
    }
    const backgroundOptions: Array<{ value: number; label: string }> = [];
    for (const idx of backgroundSet) {
      const label = traitIndexToDisplayName.get(idx);
      if (label) backgroundOptions.push({ value: idx, label });
    }

    const sortByLabel = (a: { label: string }, b: { label: string }) =>
      a.label.localeCompare(b.label);

    return {
      background: backgroundOptions.sort(sortByLabel),
      body: (byPart.get("body") ?? []).sort(sortByLabel),
      familiar: (byPart.get("familiar") ?? []).sort(sortByLabel),
      head: (byPart.get("head") ?? []).sort(sortByLabel),
      prop: (byPart.get("prop") ?? []).sort(sortByLabel),
      rune: (byPart.get("rune") ?? []).sort(sortByLabel),
    };
  }, [traitIndexToDisplayName]);

  const filteredWizards: Wizard[] = useMemo(() => {
    let result = wizardsWithTraits as Wizard[];

    if (nameQuery.trim()) {
      const q = nameQuery.trim().toLowerCase();
      result = result.filter((w) => w.name.toLowerCase().includes(q));
    }

    if (idQuery.trim()) {
      const id = Number(idQuery.trim());
      if (!Number.isNaN(id)) {
        result = result.filter((w) => w.idx === id);
      }
    }

    for (const part of TRAIT_PARTS) {
      const selected = selectedTraits[part];
      if (typeof selected === "number") {
        result = result.filter((w) => (w as any)[part] === selected);
      }
    }

    return result;
  }, [nameQuery, idQuery, selectedTraits]);

  const totalPages = Math.max(1, Math.ceil(filteredWizards.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredWizards.slice(start, end);
  }, [filteredWizards, currentPage, pageSize]);

  const onSelectTrait =
    (part: TraitPart) => (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setPage(1);
      setSelectedTraits((prev) => {
        const next = { ...prev };
        if (!value) {
          delete next[part];
        } else {
          next[part] = Number(value);
        }
        return next;
      });
    };

  return (
    <DefaultLayout>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Error Loading Page
                </h2>
                <p className="text-gray-400 mb-6">
                  There was an error loading the wizards page.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-violet hover:bg-violet/80 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }
      >
        <Web3Provider>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Forgotten Runes Wizards
              </h1>
              {isClient ? <ConnectButton /> : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <input
                value={nameQuery}
                onChange={(e) => {
                  setPage(1);
                  setNameQuery(e.target.value);
                }}
                placeholder="Search by name"
                className="w-full rounded-md bg-[#111015] text-white placeholder-gray-400 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet"
              />
              <input
                value={idQuery}
                onChange={(e) => {
                  setPage(1);
                  setIdQuery(e.target.value);
                }}
                placeholder="Filter by ID (exact)"
                inputMode="numeric"
                className="w-full rounded-md bg-[#111015] text-white placeholder-gray-400 px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-violet"
              />
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Page size</label>
                <select
                  className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[12, 24, 36, 48, 96].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
              {TRAIT_PARTS.map((part) => (
                <div key={part} className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300 capitalize">
                    {part}
                  </label>
                  <select
                    className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
                    value={selectedTraits[part] ?? ""}
                    onChange={onSelectTrait(part)}
                  >
                    <option value="">Any</option>
                    {partToTraitOptions[part].map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4 text-gray-300">
              <div>
                Showing {paginated.length} of {filteredWizards.length} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-md bg-[#111015] border border-gray-700 text-white disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded-md bg-[#111015] border border-gray-700 text-white disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map((w) => (
                <div
                  key={w.idx}
                  className="rounded-lg border border-gray-800 bg-[#0C0B10] overflow-hidden"
                >
                  <div className="w-full aspect-square bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getWizardImage(w.idx)}
                      alt={`Wizard #${w.idx}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-white font-semibold">#{w.idx}</div>
                    </div>
                    <div
                      className="text-gray-300 text-sm truncate"
                      title={w.name}
                    >
                      {w.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                className="px-3 py-1 rounded-md bg-[#111015] border border-gray-700 text-white disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-300">
                Page {currentPage} / {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded-md bg-[#111015] border border-gray-700 text-white disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </Web3Provider>
      </ErrorBoundary>
    </DefaultLayout>
  );
}
