import {
  useMemo,
  useState,
  ChangeEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useAccount } from "wagmi";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { NFTCard } from "@/components/ui/NFTCard";
import { Warrior } from "@/data/warriorsWithTraits";
import { Wizard } from "@/data/wizardsWithTraits";
import { TraitFilters } from "./TraitFilters";
// Base item type that both Wizard and Warrior extend
export type BrowserItem = Warrior | Wizard;

// Type guard to check if an item is a Wizard
function isWizard(item: BrowserItem): item is Wizard {
  return "title" in item;
}

// Trait type that works for both collections
export type BrowserTrait<TPart extends string> = {
  idx: number;
  displayName: string;
  part?: TPart;
};

export type BrowserProps<TPart extends string, TItem extends BrowserItem> = {
  onClick?: (v: number) => void;
  selectedTokens?: number[];
  setSelectedTokens?: Dispatch<SetStateAction<number[]>>;
  disabledTokenIds?: number[];
  // Trait configuration
  traitParts: readonly TPart[];
  traits: BrowserTrait<TPart>[];
  items: TItem[];
  // Collection info for wallet filtering
  collectionKey: string;
  getImageUrl: (idx: number) => string;
};

export const Browser = <TPart extends string, TItem extends BrowserItem>({
  onClick,
  selectedTokens,
  setSelectedTokens,
  disabledTokenIds = [],
  traitParts,
  traits,
  items,
  collectionKey,
  getImageUrl,
}: BrowserProps<TPart, TItem>) => {
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
    Partial<Record<TPart, number>>
  >({});
  const [filterMyCharacters, setFilterMyCharacters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Query NFTs owned by connected wallet using the API endpoint
  // Always fetch when connected - filtering is done client-side
  const walletInputs = useMemo(
    () => (isConnected && address ? [address] : []),
    [isConnected, address],
  );
  const {
    data: walletNFTs,
    loading: isLoadingNFTs,
    error: nftsError,
  } = useWalletNFTs(walletInputs);

  console.log("@@@@ walletInputs", walletInputs);
  console.log("@@@@ nftsError", nftsError);
  console.log("@@@@ walletNFTS", walletNFTs);
  // Extract owned token IDs into a Set from the API response
  const ownedTokenIds = useMemo(() => {
    if (!walletNFTs || !filterMyCharacters) return new Set<number>();
    const ids = new Set<number>();
    // The API returns NFTs grouped by collection name (e.g., "wizards", "warriors")
    const collectionNFTs = walletNFTs[collectionKey] ?? [];
    for (const nft of collectionNFTs) {
      ids.add(parseInt(nft.identifier, 10));
    }
    return ids;
  }, [walletNFTs, filterMyCharacters, collectionKey]);

  const traitIndexToDisplayName = useMemo(() => {
    const map = new Map<number, string>();
    for (const t of traits) {
      map.set(t.idx, t.displayName);
    }
    return map;
  }, [traits]);

  const partToTraitOptions = useMemo(() => {
    const byPart = new Map<TPart, Array<{ value: number; label: string }>>();

    // Initialize all parts with empty arrays
    for (const part of traitParts) {
      byPart.set(part, []);
    }

    for (const t of traits) {
      if (t.part && byPart.has(t.part as TPart)) {
        byPart
          .get(t.part as TPart)!
          .push({ value: t.idx, label: t.displayName });
      }
    }

    // For background: infer from items' background values that exist in traits
    if (byPart.has("background" as TPart)) {
      const backgroundSet = new Set<number>();
      for (const item of items) {
        const bg = (item as Record<string, unknown>)["background"];
        if (typeof bg === "number") {
          backgroundSet.add(bg);
        }
      }
      const backgroundOptions: Array<{ value: number; label: string }> = [];
      for (const idx of backgroundSet) {
        const label = traitIndexToDisplayName.get(idx);
        if (label) backgroundOptions.push({ value: idx, label });
      }
      byPart.set("background" as TPart, backgroundOptions);
    }

    const sortByLabel = (a: { label: string }, b: { label: string }) =>
      a.label.localeCompare(b.label);

    // Convert map to record with sorted options
    const result = {} as Record<TPart, Array<{ value: number; label: string }>>;
    for (const part of traitParts) {
      result[part] = (byPart.get(part) ?? []).sort(sortByLabel);
    }
    return result;
  }, [traitIndexToDisplayName, traits, items, traitParts]);

  // Check once if items are wizards (array is homogeneous)
  const isWizardCollection = items.length > 0 && isWizard(items[0]);

  // Generate dropdown options for title, firstName, and origin (wizard-only)
  const titleOptions = useMemo(() => {
    if (!isWizardCollection) return [];
    const wizards = items as Wizard[];
    const titles = new Set<string>();
    for (const wizard of wizards) {
      if (wizard.title && wizard.title.trim()) {
        titles.add(wizard.title);
      }
    }
    return Array.from(titles).sort((a, b) => a.localeCompare(b));
  }, [isWizardCollection, items]);

  const firstNameOptions = useMemo(() => {
    if (!isWizardCollection) return [];
    const wizards = items as Wizard[];
    const firstNames = new Set<string>();
    for (const wizard of wizards) {
      if (wizard.firstName && wizard.firstName.trim()) {
        firstNames.add(wizard.firstName);
      }
    }
    return Array.from(firstNames).sort((a, b) => a.localeCompare(b));
  }, [isWizardCollection, items]);

  const originOptions = useMemo(() => {
    if (!isWizardCollection) return [];
    const wizards = items as Wizard[];
    const origins = new Set<string>();
    for (const wizard of wizards) {
      if (wizard.origin && wizard.origin.trim()) {
        origins.add(wizard.origin);
      }
    }
    return Array.from(origins).sort((a, b) => a.localeCompare(b));
  }, [isWizardCollection, items]);

  const filteredItems = useMemo(() => {
    let result = items;

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

    // Wizard-specific filters (only active when isWizardCollection is true)
    if (selectedTitle && isWizardCollection) {
      result = result.filter((w) => (w as Wizard).title === selectedTitle);
    }

    if (selectedFirstName && isWizardCollection) {
      result = result.filter(
        (w) => (w as Wizard).firstName === selectedFirstName,
      );
    }

    if (selectedOrigin && isWizardCollection) {
      result = result.filter((w) => (w as Wizard).origin === selectedOrigin);
    }

    for (const part of traitParts) {
      const selected = selectedTraits[part as TPart];
      if (typeof selected === "number") {
        result = result.filter(
          (item) => (item as Record<string, unknown>)[part] === selected,
        );
      }
    }

    // Filter by owned wizards if checkbox is checked
    if (filterMyCharacters) {
      // If we're still loading, return empty array to show loading state
      if (isLoadingNFTs) {
        return [];
      }
      // If we have token IDs, filter by them
      if (ownedTokenIds.size > 0) {
        result = result.filter((item) => ownedTokenIds.has(item.idx));
      } else {
        // If checkbox is checked but no tokens found, show empty
        return [];
      }
    }

    return result;
  }, [
    items,
    nameQuery,
    idQuery,
    selectedTraits,
    selectedTitle,
    selectedFirstName,
    selectedOrigin,
    filterMyCharacters,
    ownedTokenIds,
    isLoadingNFTs,
    traitParts,
    isWizardCollection,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredItems.slice(start, end);
  }, [filteredItems, currentPage, pageSize]);

  const onSelectTrait =
    (part: TPart) => (e: ChangeEvent<HTMLSelectElement>) => {
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
      {isWizardCollection && (
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
      )}

      {isConnected && (
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterMyCharacters}
              onChange={(e) => {
                setFilterMyCharacters(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4 rounded border-gray-700 bg-[#111015] text-violet focus:ring-2 focus:ring-violet disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-gray-300">
              Show only my {collectionKey}
              {filterMyCharacters && ownedTokenIds.size > 0 && (
                <span className="text-gray-400 ml-2">
                  ({Number(ownedTokenIds.size)} owned)
                </span>
              )}
            </span>
          </label>
        </div>
      )}

      <TraitFilters
        traits={traitParts}
        selectedTraits={selectedTraits}
        partToTraitOptions={partToTraitOptions}
        onSelectTrait={onSelectTrait}
      />
      <div className="flex items-center justify-between mb-4 text-gray-300">
        {/* <div>
          {filterMyWizards && (isLoadingBalance || isLoadingTokens) ? (
            <span className="text-gray-400">Loading your wizards...</span>
          ) : (
            <>
              Showing {paginated.length} of {filteredWizards.length} results
            </>
          )}
        </div> */}
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
        {paginated.map((item) => (
          <NFTCard
            key={item.idx}
            tokenId={item.idx}
            name={item.name}
            imageUrl={getImageUrl(item.idx)}
            onClick={() => onClickHandler(item.idx)}
            selected={selectedTokens?.includes(item.idx) ?? false}
            disabled={disabledTokenIds.includes(item.idx)}
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
};
