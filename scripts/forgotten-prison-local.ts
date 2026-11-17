import { spawn, type ChildProcess } from "node:child_process";
import {
  assertLocalFork,
  loadDeployment,
} from "../src/lib/forgotten-prison/local-chain";

const children: ChildProcess[] = [];
const stop = () => {
  for (const child of children) child.kill("SIGTERM");
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
const run = (command: string, args: string[], env = process.env) => {
  const child = spawn(command, args, { stdio: "inherit", env });
  children.push(child);
  return child;
};
const finished = (child: ChildProcess) =>
  new Promise<void>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Child exited with code ${code}`)),
    );
  });
try {
  try {
    await assertLocalFork();
  } catch {
    // Do not reset or replace a node already listening on this port.
    const args = [
      "--fork-url",
      process.env.MAINNET_RPC_URL || "https://ethereum-rpc.publicnode.com",
      "--chain-id",
      "31337",
      "--host",
      "127.0.0.1",
      "--port",
      "8545",
      "--silent",
    ];
    if (process.env.FORK_BLOCK_NUMBER)
      args.push("--fork-block-number", process.env.FORK_BLOCK_NUMBER);
    const anvil = run("anvil", args);
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (anvil.exitCode !== null)
        throw new Error(
          "Cannot start Anvil. Check port 8545 and the fork RPC.",
        );
      try {
        await assertLocalFork();
        ready = true;
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    if (!ready) throw new Error("Anvil did not become ready.");
  }
  try {
    const deployment = await loadDeployment();
    console.log(`Reusing local prison ${deployment.address}`);
  } catch {
    await finished(run("pnpm", ["prison:setup"]));
  }
  console.log("Bidder page: http://127.0.0.1:3000/magic/forgotten-prison");
  console.log("Test controls: http://127.0.0.1:3000/magic/prison-test");
  await finished(run("pnpm", ["prison:dev"]));
} finally {
  stop();
}
