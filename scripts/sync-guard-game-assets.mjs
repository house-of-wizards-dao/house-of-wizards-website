import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");
const gameRoot = path.resolve(appRoot, "../guard-of-the-puppet-and-the-goat");
const gameDist = path.join(gameRoot, "dist");
const targetDir = path.join(appRoot, "public", "guard-game");

const run = (command, args, cwd) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });

    child.on("error", reject);
  });

const ensureExists = async (entryPath, description) => {
  try {
    await stat(entryPath);
  } catch {
    throw new Error(`${description} not found at ${entryPath}`);
  }
};

const syncGuardGameAssets = async () => {
  await ensureExists(gameRoot, "Game repository");

  console.log("Building guard game package...");
  await run("pnpm", ["build"], gameRoot);

  await ensureExists(gameDist, "Built game dist directory");
  await ensureExists(path.join(gameDist, "guard-game.js"), "guard-game.js");
  await ensureExists(path.join(gameDist, "guard-game.css"), "guard-game.css");

  console.log("Copying built assets into public/guard-game...");
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(gameDist, targetDir, { recursive: true });
  console.log(`Done. Synced assets to ${targetDir}`);
};

syncGuardGameAssets().catch((error) => {
  console.error(error);
  process.exit(1);
});
