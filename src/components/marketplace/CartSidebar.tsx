"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { mainnet } from "wagmi/chains";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useNFTXBatchQuote } from "@/hooks/useNFTXBatchQuote";
import { useBatchOpenSeaBuy, useNFTXBuy } from "@/hooks/useMarketplace";
import { collections } from "@/lib/marketplace";
import type { CartItem } from "@/types/cart";

const formatEth = (wei: bigint, decimals: number = 4): string => {
  const value = Number(wei) / 1e18;
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(decimals);
};

const formatEthString = (eth: string, decimals: number = 4): string => {
  const value = parseFloat(eth);
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(decimals);
};

type CheckoutPhase =
  | "idle"
  | "switching-chain"
  | "opensea-pending"
  | "opensea-failed"
  | "opensea-success"
  | "nftx-pending"
  | "nftx-failed"
  | "done";

/**
 * Collapsible cart panel anchored to the right edge of the marketplace.
 * Lists items grouped by source, shows the live NFTX batch total, and
 * fires up to two sequential transactions on checkout (Seaport batch +
 * NFTX `buyAndRedeem`).
 */
export const CartSidebar = () => {
  const {
    collectionKey,
    isOpen,
    setOpen,
    toggleOpen,
    remove,
    clear,
    openSeaItems,
    nftxItems,
    openSeaCount,
    nftxCount,
    openSeaTotalWei,
    nftxSnapshotTotalWei,
    count,
  } = useCart();

  const collectionInfo = collectionKey ? collections[collectionKey] : null;

  const { quote: nftxQuote, isFetching: isNftxQuoteFetching } =
    useNFTXBatchQuote(collectionKey, nftxCount, {
      enabled: nftxCount > 0,
    });

  const nftxAuthoritativeWei = nftxQuote
    ? BigInt(nftxQuote.totalWei)
    : nftxSnapshotTotalWei;

  // Shared per-item NFTX cost = totalEth / count. All NFTX rows display this
  // same value (matching the marketplace cards) since AMM batch buys are a
  // single atomic purchase and individual per-NFT pricing is meaningless.
  // Falls back to the row's own snapshot when no live quote is available.
  const sharedNftxPerItemEth = useMemo(() => {
    if (!nftxQuote || nftxQuote.count <= 0) return undefined;
    const totalEth = parseFloat(nftxQuote.totalEth);
    if (!Number.isFinite(totalEth) || totalEth <= 0) return undefined;
    return (totalEth / nftxQuote.count).toString();
  }, [nftxQuote]);

  const grandTotalWei = openSeaTotalWei + nftxAuthoritativeWei;

  // Wallet + chain state
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const isOnMainnet = chainId === mainnet.id;

  // Tx hooks
  const {
    buyBatch: buyOpenSeaBatch,
    isProcessing: isOpenSeaProcessing,
    error: openSeaError,
  } = useBatchOpenSeaBuy();
  const {
    buyBatchFromPool,
    isProcessing: isNftxProcessing,
    error: nftxError,
  } = useNFTXBuy();

  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [openSeaTxHash, setOpenSeaTxHash] = useState<string | null>(null);
  const [nftxTxHash, setNftxTxHash] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (count === 0) {
      setPhase("idle");
      setOpenSeaTxHash(null);
      setNftxTxHash(null);
      setCheckoutError(null);
    }
  }, [count]);

  const isProcessing =
    phase === "switching-chain" ||
    phase === "opensea-pending" ||
    phase === "nftx-pending" ||
    isOpenSeaProcessing ||
    isNftxProcessing;

  const ensureMainnet = useCallback(async (): Promise<boolean> => {
    if (isOnMainnet) return true;
    if (!switchChain) return false;
    try {
      setPhase("switching-chain");
      await switchChain({ chainId: mainnet.id });
      return true;
    } catch {
      return false;
    }
  }, [isOnMainnet, switchChain]);

  const handleCheckout = useCallback(async () => {
    if (!collectionKey || !isConnected || count === 0) return;
    setCheckoutError(null);

    const onMainnet = await ensureMainnet();
    if (!onMainnet) {
      setCheckoutError("Please switch to Ethereum Mainnet to continue");
      setPhase("idle");
      return;
    }

    // Step 1: OpenSea atomic batch via Seaport's
    // `fulfillAvailableAdvancedOrders`. The server fetches a signed order
    // from OpenSea (`generateFulfillmentData`) per cart item and feeds them
    // into seaport-js to produce a single tx. The user signs once, and
    // every still-fulfillable order in the batch settles atomically.
    if (openSeaItems.length > 0) {
      const ordersToBuy = openSeaItems
        .filter((item) => !!item.orderHash)
        .map((item) => ({
          orderHash: item.orderHash as string,
          tokenId: item.tokenId,
        }));
      if (ordersToBuy.length !== openSeaItems.length) {
        setCheckoutError("Some OpenSea items are missing order hashes");
        setPhase("opensea-failed");
        return;
      }
      setPhase("opensea-pending");
      const result = await buyOpenSeaBatch(collectionKey, ordersToBuy);
      if (!result.success) {
        setCheckoutError(result.error || "OpenSea batch failed");
        setPhase("opensea-failed");
        return;
      }
      setOpenSeaTxHash(result.txHash || null);
      setPhase("opensea-success");
    }

    // Step 2: NFTX atomic batch
    if (nftxItems.length > 0) {
      if (!nftxQuote) {
        setCheckoutError("NFTX quote not ready, please retry");
        setPhase("nftx-failed");
        return;
      }
      setPhase("nftx-pending");
      const tokenIds = nftxItems.map((item) => item.tokenId);
      const result = await buyBatchFromPool(
        collectionKey,
        tokenIds,
        nftxQuote.totalWei,
      );
      if (!result.success) {
        setCheckoutError(result.error || "NFTX batch failed");
        setPhase("nftx-failed");
        return;
      }
      setNftxTxHash(result.txHash || null);
    }

    setPhase("done");
  }, [
    collectionKey,
    isConnected,
    count,
    ensureMainnet,
    openSeaItems,
    nftxItems,
    nftxQuote,
    buyOpenSeaBatch,
    buyBatchFromPool,
  ]);

  return (
    <>
      {/* Floating cart trigger (always visible when sidebar is closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed right-4 top-24 z-30 flex items-center gap-2 px-4 py-2 rounded-l-lg rounded-r-lg",
            "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-700/30",
            "border border-violet-400/40 transition-colors",
          )}
          aria-label={`Open cart (${count} items)`}
        >
          <CartIcon className="w-5 h-5" />
          <span className="font-semibold">Cart</span>
          <span className="bg-white text-violet-700 text-xs font-bold rounded-full min-w-[1.5rem] h-6 px-2 flex items-center justify-center">
            {count}
          </span>
        </button>
      )}

      {/* Panel */}
      <aside
        className={cn(
          "bg-[#0C0B10] border border-gray-800 lg:border-l",
          "shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
          "lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:flex-shrink-0",
          isOpen
            ? "h-[80vh] w-full lg:w-[400px] opacity-100"
            : "h-0 w-0 border-transparent opacity-0 pointer-events-none",
        )}
        aria-hidden={!isOpen}
        aria-label="Marketplace cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <CartIcon className="w-5 h-5 text-violet-400" />
            <h2 className="text-white font-bold text-lg">Cart</h2>
            <span className="text-gray-400 text-sm">({count})</span>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                type="button"
                onClick={() => clear()}
                className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                disabled={isProcessing}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={toggleOpen}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Collapse cart"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collection banner */}
        {collectionInfo && (
          <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            All items from{" "}
            <span className="text-violet-400 font-medium">
              {collectionInfo.name}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center text-center px-6 h-full text-gray-500">
              <CartIcon className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm">Your cart is empty.</p>
              <p className="text-xs mt-1">Tap the + on any item to add it.</p>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {openSeaCount > 0 && (
                <CartSection
                  title={`OpenSea (${openSeaCount})`}
                  accent="bg-blue-500"
                >
                  {openSeaItems.map((item) => (
                    <CartRow
                      key={`opensea-${item.tokenId}`}
                      item={item}
                      onRemove={() => remove(item)}
                      disabled={isProcessing}
                    />
                  ))}
                </CartSection>
              )}

              {nftxCount > 0 && (
                <CartSection
                  title={`NFTX Pool (${nftxCount})`}
                  accent="bg-pink-500"
                  trailing={
                    isNftxQuoteFetching ? (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Spinner className="w-3 h-3" /> updating...
                      </span>
                    ) : null
                  }
                >
                  {nftxItems.map((item) => (
                    <CartRow
                      key={`nftx-${item.tokenId}`}
                      item={item}
                      onRemove={() => remove(item)}
                      disabled={isProcessing}
                      displayPriceEth={sharedNftxPerItemEth}
                    />
                  ))}
                </CartSection>
              )}
            </div>
          )}
        </div>

        {/* Footer / totals */}
        {count > 0 && (
          <div className="border-t border-gray-800 px-4 py-3 space-y-2 bg-[#0a0810]">
            {openSeaCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">OpenSea subtotal</span>
                <span className="text-white">
                  {formatEth(openSeaTotalWei)} ETH
                </span>
              </div>
            )}
            {nftxCount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">
                  NFTX subtotal
                  {isNftxQuoteFetching && <Spinner className="w-3 h-3" />}
                </span>
                <span className="text-white">
                  {nftxQuote
                    ? formatEthString(nftxQuote.totalEth)
                    : formatEth(nftxSnapshotTotalWei)}{" "}
                  ETH
                </span>
              </div>
            )}
            <div className="h-px bg-gray-800 my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-white font-bold">Total</span>
              <span className="text-white font-bold text-lg">
                {formatEth(grandTotalWei)} ETH
              </span>
            </div>

            {/* Phase / errors */}
            {phase === "switching-chain" && (
              <p className="text-xs text-amber-300">
                Switching to Ethereum Mainnet...
              </p>
            )}
            {phase === "opensea-pending" && (
              <p className="text-xs text-blue-300 flex items-center gap-2">
                <Spinner className="w-3 h-3" /> Confirming OpenSea batch
                transaction...
              </p>
            )}
            {phase === "opensea-success" && nftxCount > 0 && (
              <p className="text-xs text-emerald-400">
                OpenSea batch submitted. Continuing with NFTX...
              </p>
            )}
            {phase === "nftx-pending" && (
              <p className="text-xs text-pink-300 flex items-center gap-2">
                <Spinner className="w-3 h-3" /> Confirming NFTX batch
                transaction...
              </p>
            )}
            {phase === "done" && (
              <div className="text-xs text-emerald-400 space-y-1">
                <p>All transactions submitted.</p>
                {openSeaTxHash && (
                  <a
                    href={`https://etherscan.io/tx/${openSeaTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-emerald-300 block"
                  >
                    OpenSea tx ↗
                  </a>
                )}
                {nftxTxHash && (
                  <a
                    href={`https://etherscan.io/tx/${nftxTxHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-emerald-300 block"
                  >
                    NFTX tx ↗
                  </a>
                )}
              </div>
            )}
            {(checkoutError || openSeaError || nftxError) &&
              phase !== "done" &&
              phase !== "opensea-success" && (
                <p className="text-xs text-red-400">
                  {checkoutError || openSeaError || nftxError}
                </p>
              )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!isConnected || isProcessing || phase === "done"}
              className={cn(
                "mt-2 w-full px-4 py-3 rounded-lg font-bold transition-all",
                "bg-brand-700 hover:bg-brand-600 text-white",
                "shadow-lg shadow-brand-700/25 hover:shadow-brand-600/40",
                (!isConnected || isProcessing || phase === "done") &&
                  "opacity-50 cursor-not-allowed shadow-none",
              )}
            >
              {!isConnected
                ? "Connect wallet to buy"
                : phase === "done"
                  ? "Done"
                  : isProcessing
                    ? "Processing..."
                    : "Buy All"}
            </button>
            {!isOnMainnet && isConnected && (
              <p className="text-[11px] text-amber-300 text-center">
                You will be asked to switch to Ethereum Mainnet.
              </p>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

const CartSection = ({
  title,
  accent,
  trailing,
  children,
}: {
  title: string;
  accent: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between px-1 mb-2">
      <div className="flex items-center gap-2">
        <span className={cn("w-2 h-2 rounded-full", accent)} />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
          {title}
        </h3>
      </div>
      {trailing}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const CartRow = ({
  item,
  onRemove,
  disabled,
  displayPriceEth,
}: {
  item: CartItem;
  onRemove: () => void;
  disabled?: boolean;
  /**
   * When provided, overrides the displayed per-row price with this value.
   * Used for NFTX rows to show the shared per-item cost of the live batch
   * quote (totalEth / count) instead of the per-1-item snapshot.
   */
  displayPriceEth?: string;
}) => {
  const priceEth = displayPriceEth ?? item.snapshotPriceEth;
  return (
    <div className="flex items-center gap-3 p-2 rounded-md bg-[#15131c] border border-gray-800">
      <div className="w-12 h-12 rounded overflow-hidden bg-gray-800 flex-shrink-0">
        {item.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">
            #{item.tokenId}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white truncate" title={item.name}>
          {item.name}
        </div>
        <div className="text-xs text-gray-400">
          {formatEthString(priceEth)} ETH
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${item.name}`}
        className={cn(
          "text-gray-400 hover:text-red-400 transition-colors p-1 disabled:opacity-50",
        )}
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);
