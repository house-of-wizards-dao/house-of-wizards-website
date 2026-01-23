import {
  useMemo,
  useState,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { type Address } from "viem";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import { addresses } from "@/config/addresses";

import { wizardTraits } from "@/data/wizardTraits";
import { wizardsWithTraits, type Wizard } from "@/data/wizardsWithTraits";

const getWizardImage = (idx: number): string => {
  return `https://nfts.forgottenrunes.com/ipfs/QmbtiPZfgUzHd79T1aPcL9yZnhGFmzwar7h4vmfV6rV8Kq/${idx}.png`;
};

// ERC721Enumerable ABI
const ERC721_ENUMERABLE_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

type TraitPart = "background" | "body" | "familiar" | "head" | "prop" | "rune";

const TRAIT_PARTS: TraitPart[] = [
  "background",
  "body",
  "familiar",
  "head",
  "prop",
  "rune",
];

type Props = {
  onClick?: (v: number) => void;
  selectedTokens?: number[];
  setSelectedTokens?: Dispatch<SetStateAction<number[]>>;
  disabledTokenIds?: number[];
};

export default function WizardBrowser({
  onClick,
  selectedTokens,
  setSelectedTokens,
  disabledTokenIds = [],
}: Props) {
  const { address, isConnected } = useAccount();
  const selectItemHandler = (idx: number) => {
    if (selectedTokens == null || setSelectedTokens == null) return;
    if (selectedTokens.includes(idx)) {
      const s = new Set(selectedTokens);
      s.delete(idx);
      setSelectedTokens(Array.from(s));
    } else {
      setSelectedTokens((prev) => {
        prev.push(idx);
        return [...prev];
      });
    }
  };
  const onClickHandler = onClick ?? selectItemHandler;

  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<
    Partial<Record<TraitPart, number>>
  >({});
  const [filterMyWizards, setFilterMyWizards] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Query balance of connected wallet
  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError,
    error,
  } = useReadContract({
    address: addresses.wizards as Address,
    abi: ERC721_ENUMERABLE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address && filterMyWizards,
      retry: 1,
      retryOnMount: true,
    },
    chainId: mainnet.id,
  });
  // Create batch queries for all token IDs
  const tokenQueries = useMemo(() => {
    if (!balance || !address || !filterMyWizards) return [];
    const count = Number(balance);
    return Array.from({ length: count }, (_, i) => ({
      address: addresses.wizards as Address,
      abi: ERC721_ENUMERABLE_ABI,
      functionName: "tokenOfOwnerByIndex" as const,
      args: [address, BigInt(i)],
      chainId: mainnet.id,
    }));
  }, [balance, address, filterMyWizards]);

  // Query all token IDs owned by the wallet
  const { data: tokenResults, isLoading: isLoadingTokens } = useReadContracts({
    contracts: tokenQueries,
    query: {
      enabled: tokenQueries.length > 0,
    },
  });

  // Extract owned token IDs into a Set
  const ownedTokenIds = useMemo(() => {
    if (!tokenResults || !filterMyWizards) return new Set<number>();
    const ids = new Set<number>();
    for (const result of tokenResults) {
      if (result.status === "success" && result.result !== undefined) {
        ids.add(Number(result.result));
      }
    }
    return ids;
  }, [tokenResults, filterMyWizards]);

  const traitIndexToDisplayName = useMemo(() => {
    const map = new Map<number, string>();
    for (const t of wizardTraits) {
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

    for (const t of wizardTraits) {
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

  // Generate dropdown options for title, firstName, and origin
  const titleOptions = useMemo(() => {
    const titles = new Set<string>();
    for (const wizard of wizardsWithTraits) {
      if (wizard.title && wizard.title.trim()) {
        titles.add(wizard.title);
      }
    }
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, []);

  const firstNameOptions = useMemo(() => {
    const firstNames = new Set<string>();
    for (const wizard of wizardsWithTraits) {
      if (wizard.firstName && wizard.firstName.trim()) {
        firstNames.add(wizard.firstName);
      }
    }
    return Array.from(firstNames).sort((a, b) => a.localeCompare(b));
  }, []);

  const originOptions = useMemo(() => {
    const origins = new Set<string>();
    for (const wizard of wizardsWithTraits) {
      if (wizard.origin && wizard.origin.trim()) {
        origins.add(wizard.origin);
      }
    }
    return Array.from(origins).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredWizards: Wizard[] = useMemo(() => {
    let result = wizardsWithTraits;

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

    if (selectedTitle) {
      result = result.filter((w) => w.title === selectedTitle);
    }

    if (selectedFirstName) {
      result = result.filter((w) => w.firstName === selectedFirstName);
    }

    if (selectedOrigin) {
      result = result.filter((w) => w.origin === selectedOrigin);
    }

    for (const part of TRAIT_PARTS) {
      const selected = selectedTraits[part];
      if (typeof selected === "number") {
        result = result.filter((w) => (w as any)[part] === selected);
      }
    }

    // Filter by owned wizards if checkbox is checked
    if (filterMyWizards) {
      // If we're still loading, return empty array to show loading state
      if (isLoadingBalance || isLoadingTokens) {
        return [];
      }
      // If we have token IDs, filter by them
      if (ownedTokenIds.size > 0) {
        result = result.filter((w) => ownedTokenIds.has(w.idx));
      } else {
        // If checkbox is checked but no tokens found, show empty
        return [];
      }
    }

    return result;
  }, [
    nameQuery,
    idQuery,
    selectedTitle,
    selectedFirstName,
    selectedOrigin,
    selectedTraits,
    filterMyWizards,
    ownedTokenIds,
    isLoadingBalance,
    isLoadingTokens,
  ]);

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Title</label>
          <select
            className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            value={selectedTitle}
            onChange={(e) => {
              setPage(1);
              setSelectedTitle(e.target.value);
            }}
          >
            <option value="">Any</option>
            {titleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">First Name</label>
          <select
            className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            value={selectedFirstName}
            onChange={(e) => {
              setPage(1);
              setSelectedFirstName(e.target.value);
            }}
          >
            <option value="">Any</option>
            {firstNameOptions.map((firstName) => (
              <option key={firstName} value={firstName}>
                {firstName}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-300">Origin</label>
          <select
            className="rounded-md bg-[#111015] text-white px-3 py-2 border border-gray-700"
            value={selectedOrigin}
            onChange={(e) => {
              setPage(1);
              setSelectedOrigin(e.target.value);
            }}
          >
            <option value="">Any</option>
            {originOptions.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isConnected && (
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterMyWizards}
              onChange={(e) => {
                setFilterMyWizards(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded border-gray-700 bg-[#111015] text-violet focus:ring-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-gray-300">
              Show only my wizards
              {filterMyWizards && balance !== undefined && (
                <span className="text-gray-400 ml-2">
                  ({Number(balance)} owned)
                </span>
              )}
              {filterMyWizards && isError && (
                <span className="text-red-400 ml-2 text-xs">
                  (Error: {error?.message || "Failed to load"})
                </span>
              )}
            </span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {TRAIT_PARTS.map((part) => (
          <div key={part} className="flex flex-col gap-1">
            <label className="text-sm text-gray-300 capitalize">{part}</label>
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
          {filterMyWizards && (isLoadingBalance || isLoadingTokens) ? (
            <span className="text-gray-400">Loading your wizards...</span>
          ) : (
            <>
              Showing {paginated.length} of {filteredWizards.length} results
            </>
          )}
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
          <Thumbnail
            key={w.idx}
            {...w}
            onClick={onClickHandler}
            selected={selectedTokens?.includes(w.idx) ?? false}
            disabled={disabledTokenIds.includes(w.idx)}
          />
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
    </>
  );
}

const Thumbnail = ({
  idx,
  name,
  onClick,
  selected,
  disabled,
}: Wizard & {
  onClick: (v: number) => void;
  selected: boolean;
  disabled: boolean;
}) => {
  return (
    <button
      className={cn(
        "rounded-lg border border-gray-800 bg-[#0C0B10] overflow-hidden",
        selected && "border-brand-500",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onClick={() => !disabled && onClick(idx)}
      disabled={disabled}
    >
      <div className="w-full aspect-square bg-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getWizardImage(idx)}
          alt={`Wizard #${idx}`}
          className={cn("w-full h-full object-cover", disabled && "opacity-50")}
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-white font-semibold">#{idx}</div>
        </div>
        <div className="text-gray-300 text-sm truncate" title={name}>
          {name}
        </div>
      </div>
    </button>
  );
};
