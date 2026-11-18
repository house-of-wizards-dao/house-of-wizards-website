import { type ReactNode, useContext } from "react";
import { render, screen } from "@testing-library/react";
import { WagmiContext } from "wagmi";
import { startWallet } from "@/lib/wallet-startup";
import { Web3Provider } from "./Web3Provider";

const mockConfig = { state: { current: null as string | null } };
jest.mock("@/lib/web3-config", () => ({ getWeb3Config: () => mockConfig }));
jest.mock("@/lib/wallet-startup", () => ({
  startWallet: jest.fn(async () => {}),
}));
jest.mock("wagmi", () => ({
  WagmiContext: jest.requireActual("react").createContext(undefined),
}));
jest.mock("@rainbow-me/rainbowkit", () => ({
  RainbowKitProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  darkTheme: jest.fn(),
}));
jest.mock("@/components/WalletSessionProvider", () => ({
  WalletSessionProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));
beforeEach(() => {
  jest.clearAllMocks();
  mockConfig.state.current = null;
});
const Connection = () => {
  const config = useContext(WagmiContext);
  return <span>{config?.state.current ?? "No connection"}</span>;
};
it("provides the shared config and requests initialization after mount", () => {
  render(
    <Web3Provider>
      <Connection />
    </Web3Provider>,
  );
  expect(startWallet).toHaveBeenCalledWith(mockConfig);
  expect(screen.getByText("No connection")).toBeInTheDocument();
});
it("shares a live connection across navbar and page islands", () => {
  mockConfig.state.current = "live-wallet";
  render(
    <>
      <Web3Provider>
        <Connection />
      </Web3Provider>
      <Web3Provider authenticate={false} synchronizeSession={false}>
        <Connection />
      </Web3Provider>
    </>,
  );
  expect(screen.getAllByText("live-wallet")).toHaveLength(2);
  expect(startWallet).toHaveBeenNthCalledWith(1, mockConfig);
  expect(startWallet).toHaveBeenNthCalledWith(2, mockConfig);
});
