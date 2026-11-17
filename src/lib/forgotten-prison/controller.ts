import {
  decodeErrorResult,
  decodeFunctionResult,
  encodeFunctionData,
  getContract,
  isAddress,
  parseEther,
  type AbiParameter,
  type Address,
  type Abi,
} from "viem";
import { z } from "zod";
import { prisonAbi } from "./abi";
import { COLLECTIONS, COORDINATOR, DONOR, ERC721_ABI } from "./config";
import {
  confirmed,
  impersonating,
  loadDeployment,
  localChain,
  saveDeployment,
  revertSnapshot,
} from "./local-chain";

const addressSchema = z.custom<Address>(
  (value) => typeof value === "string" && isAddress(value),
);
const uintString = z
  .string()
  .regex(/^\d+$/)
  .refine((v) => BigInt(v) < 2n ** 256n, "Must fit uint256");
export const commandSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("call"),
    account: addressSchema,
    functionName: z.string(),
    args: z.array(z.string()).max(4),
    value: z.string().default("0"),
  }),
  z.object({
    action: z.literal("advance"),
    seconds: z
      .number()
      .int()
      .min(1)
      .max(366 * 86400),
  }),
  z.object({ action: z.literal("cutoff") }),
  z.object({
    action: z.literal("fulfill"),
    requestId: uintString.optional(),
    words: z.tuple([uintString, uintString]),
  }),
  z.object({
    action: z.literal("donate"),
    account: addressSchema,
    collection: addressSchema,
    tokenId: uintString,
    safe: z.boolean(),
  }),
  z.object({ action: z.literal("reset") }),
]);
export type PrisonCommand = z.input<typeof commandSchema>;

export const parseArgument = (
  parameter: AbiParameter,
  value: string,
): unknown => {
  if (parameter.type.endsWith("[]")) {
    const values = z
      .array(z.union([z.string(), z.number().int().safe()]))
      .parse(JSON.parse(value));
    return values.map((entry) =>
      parseArgument(
        { ...parameter, type: parameter.type.slice(0, -2) },
        String(entry),
      ),
    );
  }
  if (parameter.type === "address") return addressSchema.parse(value);
  if (/^uint\d*$/.test(parameter.type)) return BigInt(uintString.parse(value));
  if (parameter.type === "bytes")
    return z
      .string()
      .regex(/^0x([\da-fA-F]{2})*$/)
      .parse(value);
  throw new Error(`Unsupported input type: ${parameter.type}`);
};

export const getPrisonState = async () => {
  const deployment = await loadDeployment();
  const prison = getContract({
    address: deployment.address,
    abi: prisonAbi,
    client: localChain,
  });
  const [
    block,
    accounts,
    owner,
    pendingOwner,
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    highestBid,
    prizeCount,
    boxCount,
    eligible,
    totalBidEscrow,
    pendingPayments,
    proceeds,
    totalRefunds,
    balance,
  ] = await Promise.all([
    localChain.getBlock(),
    localChain.getAddresses(),
    prison.read.owner(),
    prison.read.pendingOwner(),
    prison.read.closed(),
    prison.read.nextDrawAt(),
    prison.read.pendingDrawId(),
    prison.read.drawCount(),
    prison.read.highestBid(),
    prison.read.availableTokenCount(),
    prison.read.availableBoxCount(),
    prison.read.eligibleInventoryCounts(),
    prison.read.totalBidEscrow(),
    prison.read.pendingPayments(),
    prison.read.proceeds(),
    prison.read.totalRefunds(),
    localChain.getBalance({ address: deployment.address }),
  ]);
  const testAccounts: Address[] = [...accounts.slice(0, 10), DONOR];
  const [accountStates, inventory, boxes, draws] = await Promise.all([
    Promise.all(
      testAccounts.map(async (address, index) => {
        const [balance, bid, refund] = await Promise.all([
          localChain.getBalance({ address }),
          prison.read.bidOf([address]),
          prison.read.refunds([address]),
        ]);
        return {
          address,
          label:
            index === 0
              ? "Original owner"
              : index === 10
                ? "NFT source wallet"
                : `Bidder ${index}`,
          balance,
          bid,
          refund,
        };
      }),
    ),
    localChain.multicall({
      allowFailure: false,
      contracts: Array.from(
        { length: Number(prizeCount) },
        (_, i) =>
          ({
            address: deployment.address,
            abi: prisonAbi,
            functionName: "availableTokenAt",
            args: [BigInt(i)],
          }) as const,
      ),
    }),
    localChain.multicall({
      allowFailure: false,
      contracts: Array.from(
        { length: Number(boxCount) },
        (_, i) =>
          ({
            address: deployment.address,
            abi: prisonAbi,
            functionName: "availableBoxAt",
            args: [BigInt(i)],
          }) as const,
      ),
    }),
    Promise.all(
      Array.from({ length: Math.min(Number(drawCount), 20) }, async (_, i) => {
        const id = drawCount - BigInt(i);
        return { id, ...(await prison.read.getDraw([id])) };
      }),
    ),
  ]);
  return {
    deployment,
    block: block.number,
    timestamp: block.timestamp,
    accounts: accountStates,
    owner,
    pendingOwner,
    closed,
    nextDrawAt,
    pendingDrawId,
    drawCount,
    highestBid,
    prizeCount,
    boxCount,
    eligible,
    totalBidEscrow,
    pendingPayments,
    proceeds,
    totalRefunds,
    balance,
    inventory,
    boxes,
    draws,
  };
};

export type JsonValue<T> = T extends bigint
  ? string
  : T extends readonly (infer U)[]
    ? JsonValue<U>[]
    : T extends object
      ? { [K in keyof T]: JsonValue<T[K]> }
      : T;
export type PrisonState = JsonValue<Awaited<ReturnType<typeof getPrisonState>>>;

const checkAccount = async (account: Address) => {
  const accounts = [...(await localChain.getAddresses()), DONOR];
  if (
    !accounts.some(
      (candidate) => candidate.toLowerCase() === account.toLowerCase(),
    )
  )
    throw new Error(
      "Choose an unlocked Anvil account or the NFT source wallet.",
    );
};

export const executeCommand = async (input: unknown) => {
  const command = commandSchema.parse(input);
  const deployment = await loadDeployment();
  const prison = getContract({
    address: deployment.address,
    abi: prisonAbi,
    client: localChain,
  });
  switch (command.action) {
    case "advance":
      await localChain.increaseTime({ seconds: command.seconds });
      await localChain.mine({ blocks: 1 });
      return {
        message: `Advanced block time by ${command.seconds} seconds and mined a block.`,
      };
    case "cutoff": {
      const [cutoff, block] = await Promise.all([
        prison.read.nextDrawAt(),
        localChain.getBlock(),
      ]);
      if (cutoff > block.timestamp)
        await localChain.setNextBlockTimestamp({ timestamp: cutoff });
      await localChain.mine({ blocks: 1 });
      return { message: "Mined a block at or after the next draw cutoff." };
    }
    case "reset":
      await revertSnapshot(deployment.snapshot);
      await saveDeployment({
        ...deployment,
        snapshot: await localChain.snapshot(),
      });
      return {
        message:
          "Restored the funded, seeded deployment. All test bids, draws and ownership changes were cleared.",
      };
    case "fulfill": {
      const id = await prison.read.pendingDrawId();
      if (!command.requestId && id === 0n)
        throw new Error("No pending request. Call startDailyDraw() first.");
      const requestId = command.requestId
        ? BigInt(command.requestId)
        : (await prison.read.getDraw([id])).requestId;
      const hash = await impersonating(COORDINATOR, async () => {
        const hash = await localChain.writeContract({
          address: deployment.address,
          abi: prisonAbi,
          account: COORDINATOR,
          functionName: "rawFulfillRandomWords",
          args: [requestId, command.words.map(BigInt)],
        });
        await confirmed(hash);
        return hash;
      });
      return {
        hash,
        message:
          "Mock callback mined. A stale or duplicate request may be intentionally ignored by the contract.",
      };
    }
    case "donate": {
      await checkAccount(command.account);
      if (
        !Object.values(COLLECTIONS).some(
          (collection) =>
            collection.toLowerCase() === command.collection.toLowerCase(),
        )
      )
        throw new Error("Choose a supported prize collection.");
      const send = async () => {
        const hash = await localChain.writeContract({
          account: command.account,
          address: command.collection,
          abi: ERC721_ABI,
          functionName: command.safe ? "safeTransferFrom" : "transferFrom",
          args: [command.account, deployment.address, BigInt(command.tokenId)],
        });
        await confirmed(hash);
        return hash;
      };
      const hash =
        command.account.toLowerCase() === DONOR.toLowerCase()
          ? await impersonating(DONOR, send)
          : await send();
      return {
        hash,
        message: command.safe
          ? "NFT transferred and registered through onERC721Received()."
          : "NFT transferred without registration. Call syncReceivedNFT(collection, tokenId) next.",
      };
    }
    case "call": {
      await checkAccount(command.account);
      const fn = prisonAbi.find(
        (item) =>
          item.type === "function" && item.name === command.functionName,
      );
      if (!fn || fn.type !== "function")
        throw new Error("Unknown ForgottenPrison function.");
      if (command.args.length !== fn.inputs.length)
        throw new Error(`Expected ${fn.inputs.length} arguments.`);
      const args = fn.inputs.map((parameter, index) =>
        parseArgument(parameter, command.args[index]),
      );
      // The ABI and destination are fixed; the page cannot submit arbitrary RPC or target other contracts.
      const functionAbi: Abi = [fn];
      const data = encodeFunctionData({
        abi: functionAbi,
        functionName: fn.name,
        args,
      });
      if (!/^\d+(\.\d{1,18})?$/.test(command.value))
        throw new Error("ETH amount must be a decimal with at most 18 places.");
      const value = parseEther(command.value);
      if (fn.stateMutability !== "payable" && value !== 0n)
        throw new Error("This function does not accept ETH.");
      const readOnly = ["view", "pure"].includes(fn.stateMutability);
      const send = async () => {
        const result = await localChain.call({
          account: command.account,
          to: deployment.address,
          data,
          value,
        });
        if (readOnly)
          return {
            message: `${fn.name}() result`,
            result: decodeFunctionResult({
              abi: functionAbi,
              functionName: fn.name,
              data: result.data ?? "0x",
            }),
          };
        const hash = await localChain.sendTransaction({
          account: command.account,
          to: deployment.address,
          data,
          value,
        });
        const receipt = await confirmed(hash);
        return {
          hash,
          message: `${fn.name}() confirmed in block ${receipt.blockNumber}.`,
          gasUsed: receipt.gasUsed,
        };
      };
      return !readOnly && command.account.toLowerCase() === DONOR.toLowerCase()
        ? await impersonating(DONOR, send)
        : await send();
    }
  }
};

export const explainError = (error: unknown): string => {
  if (error instanceof z.ZodError)
    return error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
  // viem nests revert data in causes. Preserve the actual custom error name for negative-path tests.
  let cause: unknown = error;
  for (let i = 0; i < 10 && cause && typeof cause === "object"; i++) {
    if (
      "data" in cause &&
      typeof cause.data === "string" &&
      /^0x[\da-f]+$/i.test(cause.data)
    ) {
      try {
        const decoded = decodeErrorResult({
          abi: prisonAbi,
          data: cause.data as `0x${string}`,
        });
        return `${decoded.errorName}(${decoded.args?.map(String).join(", ") ?? ""})`;
      } catch {
        /* Try nested cause. */
      }
    }
    cause = "cause" in cause ? cause.cause : undefined;
  }
  return error instanceof Error
    ? error.message.slice(0, 1800)
    : "The local action failed.";
};
