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

test.each(["walletConnect", "metaMask"])(
  "does not initialize %s just to browse anonymously",
  (type) => {
    const connector = createTestConnector(type);
    const configured = configureConnectorStartup(connector, false);
    expect(configured.setup).toBeUndefined();
    expect(connector.setup).not.toHaveBeenCalled();
  },
);

test.each(["walletConnect", "metaMask"])(
  "preserves %s interactive methods and RainbowKit metadata",
  async (type) => {
    const connector = createTestConnector(type);
    const configured = configureConnectorStartup(connector, false);
    await configured.connect({ chainId: 1 });
    await configured.disconnect();
    expect(connector.connect).toHaveBeenCalledWith({ chainId: 1 });
    expect(connector.disconnect).toHaveBeenCalledTimes(1);
    expect(configured.getProvider).toBe(connector.getProvider);
    expect(configured.onDisconnect).toBe(connector.onDisconnect);
    expect(configured.rkDetails).toBe(connector.rkDetails);
  },
);

test.each(["walletConnect", "metaMask"])(
  "restores normal %s setup for a returning wallet",
  async (type) => {
    const connector = createTestConnector(type);
    const configured = configureConnectorStartup(connector, true);
    await configured.setup?.();
    expect(connector.setup).toHaveBeenCalledTimes(1);
  },
);

test("preserves injected-wallet setup and provider discovery", async () => {
  const connector = createTestConnector("injected");
  const configured = configureConnectorStartup(connector, false);
  await configured.setup?.();
  expect(connector.setup).toHaveBeenCalledTimes(1);
});

test("preserves MetaMask setup when an injected provider is installed", async () => {
  const connector = createTestConnector("metaMask");
  const configured = configureConnectorStartup(connector, false, true);
  await configured.setup?.();
  expect(connector.setup).toHaveBeenCalledTimes(1);
});
