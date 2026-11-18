import { hydrate, type Config } from "@wagmi/core";
import { hasPersistedWalletConnection } from "./wallet-storage";

const startups = new WeakMap<Config, Promise<void>>();

/** Navbar and page wallet islands share one config and one hydration. */
export const startWallet = (config: Config): Promise<void> => {
  const existing = startups.get(config);
  if (existing) return existing;
  const reconnectOnMount =
    Boolean(config.state.current) || hasPersistedWalletConnection();
  // Register before hydration can notify another wallet island to mount.
  const startup = Promise.resolve()
    .then(() => hydrate(config, { reconnectOnMount }).onMount())
    .catch((error) => {
      startups.delete(config);
      throw error;
    });
  startups.set(config, startup);
  return startup;
};
