import { BaseError, type Address } from "viem";

export type LogRange = {
  address: Address;
  fromBlock: bigint;
  toBlock: bigint;
};

const blockLimit = (error: unknown): bigint | null => {
  if (!(error instanceof BaseError)) return null;
  // Inspect only the provider's range-limit message, never log credential URLs.
  const match = error.details?.match(/up to (?:a )?(\d+) block range/i);
  if (!match) return null;
  const limit = BigInt(match[1]);
  return limit > 0n ? limit : null;
};

// Remember the provider's advertised limit for this isolate. Alchemy Free allows
// 10-block requests; paid endpoints retain normal 2,000-block batches. Return
// only complete batches so a failed chunk can never advance the index cursor.
export const createLogReader = <T>(
  request: (range: LogRange) => Promise<T[]>,
  pause: () => Promise<void> = () =>
    new Promise((resolve) => setTimeout(resolve, 400)),
) => {
  let limit = 2000n;
  return async (range: LogRange): Promise<T[]> => {
    const logs: T[] = [];
    let from = range.fromBlock;
    while (from <= range.toBlock) {
      const chunks: LogRange[] = [];
      for (const start of [from, from + limit]) {
        if (start > range.toBlock) break;
        chunks.push({
          ...range,
          fromBlock: start,
          toBlock:
            start + limit - 1n < range.toBlock
              ? start + limit - 1n
              : range.toBlock,
        });
      }
      try {
        // Wait for both requests even on failure to bound concurrency on retry.
        const results = await Promise.allSettled(chunks.map(request));
        const failure = results.find((result) => result.status === "rejected");
        if (failure?.status === "rejected") throw failure.reason;
        for (const result of results)
          if (result.status === "fulfilled") logs.push(...result.value);
        from = chunks[chunks.length - 1].toBlock + 1n;
      } catch (error) {
        const supported = blockLimit(error);
        if (supported === null || supported >= limit) throw error;
        limit = supported;
      }
      // At most two requests per 400ms plus their latency. Normal incremental
      // syncs need only a few chunks; catch-up stays bounded on a free plan.
      if (from <= range.toBlock) await pause();
    }
    return logs;
  };
};
