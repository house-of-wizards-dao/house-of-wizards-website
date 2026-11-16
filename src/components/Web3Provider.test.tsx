import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { WagmiProvider } from "wagmi";
import { Web3Provider } from "./Web3Provider";

const mockConfig: { state: { current: string | null } } = {
  state: { current: null },
};

jest.mock("@/lib/web3-config", () => ({
  getWeb3Config: () => mockConfig,
}));
jest.mock("wagmi", () => ({
  WagmiProvider: jest.fn(({ children }: { children: ReactNode }) => (
    <>{children}</>
  )),
}));
jest.mock("@rainbow-me/rainbowkit", () => ({
  RainbowKitProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  darkTheme: jest.fn(),
}));
jest.mock("@rainbow-me/rainbowkit-siwe-next-auth", () => ({
  RainbowKitSiweNextAuthProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
jest.mock("next-auth/react", () => ({ signOut: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  mockConfig.state.current = null;
});

const renderProvider = () =>
  render(
    <Web3Provider synchronizeSession={false}>
      <div>Marketplace</div>
    </Web3Provider>,
  );

test("does not probe all wallet connectors for a new visitor", () => {
  renderProvider();
  expect(WagmiProvider).toHaveBeenCalledWith(
    expect.objectContaining({ reconnectOnMount: false }),
    undefined,
  );
});

test("restores a returning visitor's wallet", () => {
  localStorage.setItem(
    "wagmi.store",
    JSON.stringify({ state: { current: "persisted-connection" }, version: 2 }),
  );
  renderProvider();
  expect(WagmiProvider).toHaveBeenCalledWith(
    expect.objectContaining({ reconnectOnMount: true }),
    undefined,
  );
});

test("preserves an active shared connection when another provider mounts", () => {
  mockConfig.state.current = "live-connection";
  renderProvider();
  expect(WagmiProvider).toHaveBeenCalledWith(
    expect.objectContaining({ reconnectOnMount: true }),
    undefined,
  );
});
