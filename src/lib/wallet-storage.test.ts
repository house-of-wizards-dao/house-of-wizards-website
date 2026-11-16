import { hasPersistedWalletConnection } from "./wallet-storage";

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
