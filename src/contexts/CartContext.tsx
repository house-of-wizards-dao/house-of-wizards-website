"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type PropsWithChildren,
} from "react";
import {
  cartItemKey,
  type CartItem,
  type CartMode,
  type CartState,
} from "@/types/cart";
import type { CollectionKey } from "@/types/marketplace";

const STORAGE_KEY = "frwc-marketplace-cart";

type AddOptions = {
  /** If true, replace the existing cart when the collection differs */
  replaceCollection?: boolean;
};

type AddResult =
  | { ok: true }
  | {
      ok: false;
      reason: "collection-mismatch";
      currentCollection: CollectionKey;
    }
  | {
      ok: false;
      reason: "mode-mismatch";
      currentMode: CartMode;
    };

type CartContextValue = {
  state: CartState;
  count: number;
  isInCart: (item: Pick<CartItem, "source" | "tokenId">) => boolean;
  add: (item: CartItem, options?: AddOptions) => AddResult;
  remove: (item: Pick<CartItem, "source" | "tokenId">) => void;
  updateSellListingPrice: (tokenId: string, listingPriceEth: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
};

type CartAction =
  | { type: "ADD"; item: CartItem; replaceCollection?: boolean }
  | { type: "REMOVE"; tokenId: string; source: CartItem["source"] }
  | { type: "UPDATE_SELL_PRICE"; tokenId: string; listingPriceEth: string }
  | { type: "CLEAR" }
  | { type: "SET_OPEN"; open: boolean }
  | { type: "TOGGLE_OPEN" }
  | { type: "HYDRATE"; state: CartState };

const initialState: CartState = {
  collectionKey: null,
  items: [],
  isOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD": {
      const { item, replaceCollection } = action;
      const sameCollection =
        !state.collectionKey || state.collectionKey === item.collectionKey;
      if (!sameCollection && !replaceCollection) {
        return state;
      }
      const items = !sameCollection || replaceCollection ? [] : state.items;
      const exists = items.some(
        (existing) => cartItemKey(existing) === cartItemKey(item),
      );
      if (exists) {
        return {
          ...state,
          collectionKey: item.collectionKey,
          items,
        };
      }
      return {
        ...state,
        collectionKey: item.collectionKey,
        items: [...items, item],
      };
    }
    case "REMOVE": {
      const items = state.items.filter(
        (existing) =>
          !(
            existing.tokenId === action.tokenId &&
            existing.source === action.source
          ),
      );
      return {
        ...state,
        items,
        collectionKey: items.length === 0 ? null : state.collectionKey,
      };
    }
    case "UPDATE_SELL_PRICE":
      return {
        ...state,
        items: state.items.map((item) =>
          item.source === "sell" && item.tokenId === action.tokenId
            ? { ...item, listingPriceEth: action.listingPriceEth }
            : item,
        ),
      };
    case "CLEAR":
      return { ...state, items: [], collectionKey: null };
    case "SET_OPEN":
      return { ...state, isOpen: action.open };
    case "TOGGLE_OPEN":
      return { ...state, isOpen: !state.isOpen };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
};

const cartModeForItem = (item: Pick<CartItem, "source">): CartMode =>
  item.source === "sell" ? "sell" : "buy";

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<CartItem>;
  if (
    typeof v.tokenId !== "string" ||
    typeof v.collectionKey !== "string" ||
    typeof v.name !== "string"
  ) {
    return false;
  }
  if (v.source === "sell") {
    return typeof v.listingPriceEth === "string";
  }
  return (
    (v.source === "opensea" || v.source === "nftx") &&
    typeof v.snapshotPriceWei === "string" &&
    typeof v.snapshotPriceEth === "string"
  );
};

const isCartState = (value: unknown): value is CartState => {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<CartState>;
  if (!Array.isArray(v.items)) return false;
  if (typeof v.isOpen !== "boolean") return false;
  if (v.collectionKey !== null && typeof v.collectionKey !== "string") {
    return false;
  }
  return v.items.every(isCartItem);
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") {
      setHydrated(true);
      return;
    }
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isCartState(parsed)) {
          dispatch({ type: "HYDRATE", state: { ...parsed, isOpen: false } });
        }
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist to sessionStorage whenever the cart changes (after hydration)
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          collectionKey: state.collectionKey,
          items: state.items,
          isOpen: false,
        }),
      );
    } catch {
      // ignore quota errors
    }
  }, [hydrated, state.collectionKey, state.items]);

  const add = useCallback(
    (item: CartItem, options?: AddOptions): AddResult => {
      const replaceCollection = options?.replaceCollection ?? false;
      if (
        state.collectionKey &&
        state.collectionKey !== item.collectionKey &&
        !replaceCollection
      ) {
        return {
          ok: false,
          reason: "collection-mismatch",
          currentCollection: state.collectionKey,
        };
      }
      const currentMode = state.items[0]
        ? cartModeForItem(state.items[0])
        : null;
      const nextMode = cartModeForItem(item);
      if (currentMode && currentMode !== nextMode && !replaceCollection) {
        return {
          ok: false,
          reason: "mode-mismatch",
          currentMode,
        };
      }
      dispatch({ type: "ADD", item, replaceCollection });
      return { ok: true };
    },
    [state.collectionKey, state.items],
  );

  const remove = useCallback((item: Pick<CartItem, "source" | "tokenId">) => {
    dispatch({ type: "REMOVE", tokenId: item.tokenId, source: item.source });
  }, []);

  const updateSellListingPrice = useCallback(
    (tokenId: string, listingPriceEth: string) => {
      dispatch({ type: "UPDATE_SELL_PRICE", tokenId, listingPriceEth });
    },
    [],
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const setOpen = useCallback(
    (open: boolean) => dispatch({ type: "SET_OPEN", open }),
    [],
  );
  const toggleOpen = useCallback(() => dispatch({ type: "TOGGLE_OPEN" }), []);

  const isInCart = useCallback(
    (item: Pick<CartItem, "source" | "tokenId">) => {
      const key = cartItemKey(item);
      return state.items.some((existing) => cartItemKey(existing) === key);
    },
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      count: state.items.length,
      isInCart,
      add,
      remove,
      updateSellListingPrice,
      clear,
      setOpen,
      toggleOpen,
    }),
    [
      state,
      isInCart,
      add,
      remove,
      updateSellListingPrice,
      clear,
      setOpen,
      toggleOpen,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return ctx;
};
