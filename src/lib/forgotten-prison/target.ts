import "server-only";
import { getAddress, isAddress, zeroAddress } from "viem";
import type { PrisonTarget } from "./bidding";

export const getPrisonTarget = async (): Promise<{
  target: PrisonTarget | null;
  local: boolean;
}> => {
  const local =
    process.env.NODE_ENV === "development" &&
    process.env.FORGOTTEN_PRISON_LOCAL_ENABLED === "1";
  if (local) {
    try {
      const { loadDeployment } = await import("./local-chain");
      const deployment = await loadDeployment();
      return { local, target: { address: deployment.address, chainId: 31337 } };
    } catch {
      return { local, target: null };
    }
  }
  const address = process.env.FORGOTTEN_PRISON_ADDRESS;
  return {
    local,
    target:
      address && isAddress(address) && address !== zeroAddress
        ? { address: getAddress(address), chainId: 1 }
        : null,
  };
};
