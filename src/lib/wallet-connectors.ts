import type { CreateConnectorFn } from "wagmi";

type WalletConnector = ReturnType<CreateConnectorFn>;

export const configureConnectorStartup = (
  connector: WalletConnector,
  restoreConnection: boolean,
  hasInjectedProvider = false,
): WalletConnector => {
  const canDeferSetup =
    connector.type === "walletConnect" ||
    (connector.type === "metaMask" && !hasInjectedProvider);
  if (!canDeferSetup || restoreConnection) return connector;

  // WalletConnect and MetaMask setup eagerly import their SDKs to listen for a
  // session/provider. An anonymous visitor without an extension has neither.
  // Both connectors initialize their provider and install listeners in connect().
  // Keep every interactive method and RainbowKit metadata unchanged.
  return { ...connector, setup: undefined };
};
