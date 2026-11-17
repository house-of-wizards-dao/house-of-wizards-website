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
