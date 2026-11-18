import {
  createWalletStorage,
  hasPersistedWalletConnection,
  walletConnectionChanged,
} from "./wallet-storage";

afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

test("recognizes a returning wallet in Wagmi's persisted state", () => {
  localStorage.setItem(
    "wagmi.store",
    JSON.stringify({ state: { current: "wallet-connection" }, version: 2 }),
  );
  expect(hasPersistedWalletConnection()).toBe(true);
});

test.each([
  null,
  "invalid-json",
  "null",
  "{}",
  '{"state":null}',
  '{"state":{"current":null}}',
  '{"state":{"current":""}}',
  '{"state":{"current":123}}',
])("does not restore absent or malformed state: %s", (stored) => {
  if (stored !== null) localStorage.setItem("wagmi.store", stored);
  expect(hasPersistedWalletConnection()).toBe(false);
});

test("allows browsing when storage is unavailable", () => {
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new DOMException("Storage is unavailable", "SecurityError");
  });
  expect(hasPersistedWalletConnection()).toBe(false);
});

test("preserves the saved connection during configuration, then persists disconnects", () => {
  const saved = JSON.stringify({
    state: { current: "returning-wallet" },
    version: 2,
  });
  const disconnected = JSON.stringify({ state: { current: null }, version: 2 });
  localStorage.setItem("wagmi.store", saved);
  const persistence = createWalletStorage();
  // createConfig writes its empty state before on-mount hydration can read it.
  persistence.storage.setItem("wagmi.store", disconnected);
  expect(persistence.storage.getItem("wagmi.store")).toBe(saved);
  persistence.enablePersistence();
  persistence.storage.setItem("wagmi.store", disconnected);
  expect(hasPersistedWalletConnection()).toBe(false);
});

test("retains connections after a month and notifies wallet controls in the same tab", () => {
  const listener = jest.fn();
  window.addEventListener(walletConnectionChanged, listener);
  const persistence = createWalletStorage();
  persistence.enablePersistence();
  persistence.storage.setItem(
    "wagmi.store",
    JSON.stringify({ state: { current: "wallet" }, version: 2 }),
  );
  expect(listener).toHaveBeenCalledTimes(1);
  jest.spyOn(Date, "now").mockReturnValue(Date.now() + 31 * 86400_000);
  expect(hasPersistedWalletConnection()).toBe(true);
  persistence.storage.removeItem("wagmi.store");
  expect(hasPersistedWalletConnection()).toBe(false);
  expect(listener).toHaveBeenCalledTimes(2);
  window.removeEventListener(walletConnectionChanged, listener);
});
