import type { Hash } from "viem";

export type ScanBlock = { number: bigint; hash: Hash; timestamp: bigint };
export type Scan = {
  from: bigint;
  end: ScanBlock;
  anchor: { number: bigint; hash: Hash } | null;
};
type ReadBlock = (number: bigint) => Promise<ScanBlock>;

export const planScan = async (
  checkpoint: { cursor_block: number; cursor_hash: Hash | null },
  head: ScanBlock,
  readBlock: ReadBlock,
  deploymentBlock: bigint,
  rangeSize: bigint,
): Promise<Scan | null> => {
  const cursorNumber = BigInt(checkpoint.cursor_block);
  if (head.number < deploymentBlock)
    throw new Error("RPC head predates deployment");
  if (head.number < cursorNumber)
    throw new Error("RPC head is behind the index cursor");
  let from = cursorNumber + 1n;
  let anchor: Scan["anchor"] = null;
  if (checkpoint.cursor_hash) {
    const cursor =
      cursorNumber === head.number ? head : await readBlock(cursorNumber);
    if (cursor.hash === checkpoint.cursor_hash) {
      anchor = { number: cursorNumber, hash: cursor.hash };
    } else {
      // A changed checkpoint requires replay; ordinary ticks scan only new blocks.
      from = deploymentBlock;
    }
  } else if (cursorNumber >= deploymentBlock) {
    throw new Error("Missing index checkpoint hash");
  }
  if (from > head.number) return null;
  const to =
    from + rangeSize - 1n < head.number ? from + rangeSize - 1n : head.number;
  return { from, end: to === head.number ? head : await readBlock(to), anchor };
};

export const verifyScan = async (scan: Scan, readBlock: ReadBlock) => {
  if ((await readBlock(scan.end.number)).hash !== scan.end.hash)
    throw new Error("Chain changed during scan; retry next run");
  // Recheck the old checkpoint too: a reorg between its first check and reading
  // the end block must not splice a new branch onto events from the old branch.
  if (
    scan.anchor &&
    scan.anchor.number !== scan.end.number &&
    (await readBlock(scan.anchor.number)).hash !== scan.anchor.hash
  )
    throw new Error("Checkpoint changed during scan; retry next run");
};
