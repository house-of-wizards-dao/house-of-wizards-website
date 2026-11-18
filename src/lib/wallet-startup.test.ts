import { hydrate, type Config } from "@wagmi/core";
import { startWallet } from "./wallet-startup";

jest.mock("@wagmi/core", () => ({
  hydrate: jest.fn(),
}));
const onMount = jest.fn(async () => {});
// hydrate is mocked; only the state inspected by startWallet is needed here.
const config = () => ({ state: { current: null } }) as Config;
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.mocked(hydrate).mockReturnValue({ onMount });
});
it("hydrates once for concurrent islands and never rehydrates a live connector later", async () => {
  const shared = config();
  localStorage.setItem(
    "wagmi.store",
    JSON.stringify({ state: { current: "saved-wallet" } }),
  );
  await Promise.all([startWallet(shared), startWallet(shared)]);
  shared.state.current = "live-wallet";
  await startWallet(shared);
  expect(hydrate).toHaveBeenCalledTimes(1);
  expect(hydrate).toHaveBeenCalledWith(shared, { reconnectOnMount: true });
  expect(onMount).toHaveBeenCalledTimes(1);
  expect(shared.state.current).toBe("live-wallet");
});
it("does not reconnect wallets for anonymous visitors", async () => {
  const shared = config();
  await startWallet(shared);
  expect(hydrate).toHaveBeenCalledWith(shared, { reconnectOnMount: false });
});
it("preserves an already-live shared connection even without persisted storage", async () => {
  const shared = config();
  shared.state.current = "live-wallet";
  await startWallet(shared);
  expect(hydrate).toHaveBeenCalledWith(shared, { reconnectOnMount: true });
});
