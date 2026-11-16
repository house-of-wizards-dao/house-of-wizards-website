import type { CreateConnectorFn } from "wagmi";

type WalletConnector = ReturnType<CreateConnectorFn>;

export const configureConnectorStartup = (
  connector: WalletConnector,
  restoreConnection: boolean,
): WalletConnector => {
  if (connector.type !== "walletConnect" || restoreConnection) return connector;

  // WalletConnect's setup eagerly imports/initializes its provider just to listen
  // for an existing session. A new visitor has no session to restore. Its normal
  // connect() initializes the provider and installs the connection/session listeners.
  // Keep every interactive method and RainbowKit metadata unchanged.
  return { ...connector, setup: undefined };
};
