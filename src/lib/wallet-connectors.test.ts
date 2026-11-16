import type { CreateConnectorFn } from "wagmi";
import { configureConnectorStartup } from "./wallet-connectors";

const createTestConnector = (type: string): ReturnType<CreateConnectorFn> => ({
  id: "test-wallet",
  name: "Test wallet",
  type,
  rkDetails: { name: "Test wallet" },
  setup: jest.fn(async () => {}),
  connect: jest.fn(async () => ({ accounts: [], chainId: 1 })),
  disconnect: jest.fn(async () => {}),
  getAccounts: jest.fn(async () => []),
  getChainId: jest.fn(async () => 1),
  getProvider: jest.fn(async () => ({})),
  isAuthorized: jest.fn(async () => false),
  onAccountsChanged: jest.fn(),
  onChainChanged: jest.fn(),
  onDisconnect: jest.fn(),
});

test("does not initialize WalletConnect just to browse anonymously", () => {
  const connector = createTestConnector("walletConnect");
  const configured = configureConnectorStartup(connector, false);
  expect(configured.setup).toBeUndefined();
  expect(connector.setup).not.toHaveBeenCalled();
});

test("preserves interactive connect/disconnect methods and RainbowKit metadata", async () => {
  const connector = createTestConnector("walletConnect");
  const configured = configureConnectorStartup(connector, false);
  await configured.connect({ chainId: 1 });
  await configured.disconnect();
  expect(connector.connect).toHaveBeenCalledWith({ chainId: 1 });
  expect(connector.disconnect).toHaveBeenCalledTimes(1);
  expect(configured.getProvider).toBe(connector.getProvider);
  expect(configured.onDisconnect).toBe(connector.onDisconnect);
  expect(configured.rkDetails).toBe(connector.rkDetails);
});

test("restores normal WalletConnect setup for a returning wallet", async () => {
  const connector = createTestConnector("walletConnect");
  const configured = configureConnectorStartup(connector, true);
  await configured.setup?.();
  expect(connector.setup).toHaveBeenCalledTimes(1);
});

test("preserves injected-wallet setup and provider discovery", async () => {
  const connector = createTestConnector("injected");
  const configured = configureConnectorStartup(connector, false);
  await configured.setup?.();
  expect(connector.setup).toHaveBeenCalledTimes(1);
});
