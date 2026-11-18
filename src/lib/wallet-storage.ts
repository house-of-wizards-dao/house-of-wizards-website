export const walletConnectionChanged = "how:wallet-connection-changed";

/** Keep connection preferences in localStorage with no application expiry. */
export const createWalletStorage = () => {
  let initialized = false;
  return {
    enablePersistence: () => {
      initialized = true;
    },
    storage: {
      getItem: (key: string): string | null => {
        try {
          return window.localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        // Wagmi writes an empty initial state during createConfig(), before
        // SSR hydration reads the saved connection. Preserve it until setup ends.
        if (!initialized && key === "wagmi.store") return;
        try {
          const previous = window.localStorage.getItem(key);
          window.localStorage.setItem(key, value);
          if (key === "wagmi.store" && previous !== value)
            window.dispatchEvent(new Event(walletConnectionChanged));
        } catch {
          // Storage can be unavailable; connecting still works for this visit.
        }
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
          if (key === "wagmi.store")
            window.dispatchEvent(new Event(walletConnectionChanged));
        } catch {
          // Match getItem/setItem when browser storage is disabled.
        }
      },
    },
  };
};

/** Read Wagmi's persisted connection without importing any wallet SDKs. */
export const hasPersistedWalletConnection = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const stored = window.localStorage.getItem("wagmi.store");
    if (!stored) return false;
    const persisted: unknown = JSON.parse(stored);
    if (
      !persisted ||
      typeof persisted !== "object" ||
      !("state" in persisted) ||
      !persisted.state ||
      typeof persisted.state !== "object"
    )
      return false;

    return (
      "current" in persisted.state &&
      typeof persisted.state.current === "string" &&
      persisted.state.current.length > 0
    );
  } catch {
    // Private browsing, disabled storage, and malformed old state are all anonymous visits.
    return false;
  }
};
