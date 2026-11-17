import { readFile, writeFile, mkdir } from "node:fs/promises";
import { format } from "prettier";

const root = new URL("../", import.meta.url);
const artifact = JSON.parse(
  await readFile(
    new URL(
      "contracts/forgotten-prison/out/ForgottenPrison.sol/ForgottenPrison.json",
      root,
    ),
    "utf8",
  ),
);
await mkdir(new URL("src/lib/forgotten-prison/", root), { recursive: true });
await writeFile(
  new URL("src/lib/forgotten-prison/abi.ts", root),
  await format(
    `// Generated from ForgottenPrison.sol by scripts/generate-prison-abi.mjs.\nexport const prisonAbi = ${JSON.stringify(artifact.abi, null, 2)} as const;\n`,
    { parser: "typescript" },
  ),
);

// The read-only Supabase indexer uses the same compiled ABI as the website.
await mkdir(new URL("supabase/functions/_shared/", root), { recursive: true });
await writeFile(
  new URL("supabase/functions/_shared/abi.ts", root),
  await readFile(new URL("src/lib/forgotten-prison/abi.ts", root)),
);
