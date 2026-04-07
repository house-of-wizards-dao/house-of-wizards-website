"use client";

import { useMemo } from "react";
import { useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import type { Address } from "viem";
import { guardPledgeABI } from "@/contracts/guardPledgeAbi";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const GUARD_CONTRACT_ADDRESS =
  "0x347Fb25125762980ea77633216f99534784DD4FE" as Address;

export const useGuardContract = () => {
  return {
    guardContractAddress: GUARD_CONTRACT_ADDRESS,
    isConfigured: GUARD_CONTRACT_ADDRESS !== ZERO_ADDRESS,
  };
};

export const usePledge = (tokenId: number | undefined) => {
  const enabled = tokenId != null && GUARD_CONTRACT_ADDRESS !== ZERO_ADDRESS;

  const simulation = useSimulateContract({
    address: GUARD_CONTRACT_ADDRESS,
    abi: guardPledgeABI,
    functionName: "pledge",
    args: [BigInt(tokenId ?? 0)],
    query: { enabled },
  });

  const write = useWriteContract();

  return {
    ...write,
    simulationError: simulation.error,
    write: simulation.data
      ? () => write.writeContract(simulation.data.request)
      : undefined,
  };
};

export const usePledgeWithShield = (
  tokenId: number | undefined,
  proof: `0x${string}`[] | undefined,
) => {
  const enabled =
    tokenId != null && proof != null && GUARD_CONTRACT_ADDRESS !== ZERO_ADDRESS;

  const simulation = useSimulateContract({
    address: GUARD_CONTRACT_ADDRESS,
    abi: guardPledgeABI,
    functionName: "pledgeWithShield",
    args: [BigInt(tokenId ?? 0), proof ?? []],
    query: { enabled },
  });

  const write = useWriteContract();

  return {
    ...write,
    simulationError: simulation.error,
    write: simulation.data
      ? () => write.writeContract(simulation.data.request)
      : undefined,
  };
};

export const useIsThereGuardOpening = () => {
  const { data: pledgedWithShield } = useReadContract({
    address: GUARD_CONTRACT_ADDRESS,
    abi: guardPledgeABI,
    functionName: "pledgedWithShield",
    query: {
      enabled: GUARD_CONTRACT_ADDRESS !== ZERO_ADDRESS,
      refetchInterval: 15_000,
    },
  });

  const { data: pledgedWithoutShield } = useReadContract({
    address: GUARD_CONTRACT_ADDRESS,
    abi: guardPledgeABI,
    functionName: "pledgedWithoutShield",
    query: {
      enabled: GUARD_CONTRACT_ADDRESS !== ZERO_ADDRESS,
      refetchInterval: 15_000,
    },
  });

  return useMemo(() => {
    if (pledgedWithShield == null || pledgedWithoutShield == null) {
      return false;
    }

    const withShield = Number(pledgedWithShield);
    const withoutShield = Number(pledgedWithoutShield);

    return withShield > ((withoutShield + 1) * 100) / 66;
  }, [pledgedWithShield, pledgedWithoutShield]);
};
