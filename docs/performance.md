# Performance and dependency maintenance

## Runtime and supported upgrade set

The application targets **Node 26.x**, **Next.js 16.4.6**, **React 19.3.1**, **Tailwind 4.3.5**, and **pnpm 11.5.0**. Vercel controls the Node patch version within the `26.x` major; local validation used Node 26.13.1. `.node-version`, `.nvmrc`, `engines.node`, and CI agree.

Sources checked November 14, 2026:

- [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Node 26 availability on Vercel](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- Version-matched Next.js guides in `node_modules/next/dist/docs/`

Compatibility is intentional:

- RainbowKit 2.2.11 supports Wagmi 2, so Wagmi stays at the newest compatible 2.19.5. Wagmi 3 needs a coordinated RainbowKit migration.
- The SIWE adapter stays at 0.5.0 with stable NextAuth 4.24.15. Adapter 0.6 requires NextAuth 5 prereleases.
- TypeScript 6.0.3 is the newest supported compiler for the current TypeScript ESLint parser; TypeScript 7 is outside its declared range.
- ESLint 9.39.5 is the newest release supported by all plugins shipped in Next's lint preset. ESLint 10 is outside the React, import, and accessibility plugins' peer ranges. ESLint 9 is now deprecated upstream, so revisit this pin when those plugins support 10.
- Webpack remains explicit because the wallet integrations need existing module fallbacks. Migration to Turbopack should include the same wallet and marketplace checks.
- OpenSea 14 uses namespaced methods and camelCase response fields. The application maps NFT responses back to its existing snake_case API contract. Transaction builders use `api.orders`, `fulfillmentData`, and `inputData`.
- Coinbase CDP imports optional x402 clients at module load. Their declared peer packages are installed explicitly so webpack can resolve those imports.

## Loading and rendering

- Public pages have stable session/query providers. Wallet UI loads on request or for a persisted connection; wallet routes have their own stable provider sharing one browser Wagmi store. Config updates no longer remount the page tree.
- Route providers reconnect only when a persisted or active connection exists. Anonymous visits skip Wagmi's connector-wide reconnect probe, which otherwise imports provider SDKs before any wallet interaction. The navbar and providers share the same guarded storage reader.
- Anonymous visits also defer WalletConnect's eager `setup` and MetaMask SDK setup when no injected provider is present. Both installed connectors initialize their providers and register listeners in `connect()`; returning sessions and installed injected providers retain normal setup. RainbowKit's default wallets, injected-wallet discovery, connector methods, and the stable shared Wagmi config are preserved.
- Navigation does not prefetch wallet routes. This keeps wallet SDK downloads out of public visits.
- Marketplace display traits and affinities are server-only. Listings carry a small numeric trait record; cached endpoints supply filter options and one selected character's detail. Character pages receive only their own metadata and backpack account address.
- Collection browsers load on selection. Gallery and marketplace grids render at most 48 items per page.
- Wallet and character requests use TanStack Query cancellation and stable keys. Wallet addresses/ENS names are normalized, sorted, and deduplicated.
- Images use Next's optimizer for trusted hosts and local assets. Hero imagery declares `sizes`, eager loading, and high fetch priority. Tweet media is responsive and lazy. Arbitrary NFT/lore images keep their original data and host compatibility.
- Local fonts use `font-display: swap`. The unused Google font request and fixed route-loading delay are removed.
- Basic UI components are local; deprecated NextUI and unused dependencies are removed. React state updates do not mutate selection arrays or imported collection data.
- Mobile navigation uses a native dialog with focus containment and Escape handling. Wallet controls are a single persistent island outside that dialog. Interactive shell controls wait for hydration, and viewport zoom remains enabled.

## Regression checks

Run `pnpm lint`, `pnpm test --runInBand`, `pnpm build`, `pnpm type-check`, `pnpm bundle:check`, `pnpm test:e2e`, and `pnpm perf:check`. Build before the last three commands. Do not run builds and type checks simultaneously because Next regenerates `.next/types`.

Browser tests run against a production server on port 3100. Install Chromium with `pnpm exec playwright install chromium`, or set `CHROME_PATH` to a local Chromium browser. Tests cover mobile/desktop wallet opening, menu focus behavior, filtering/pagination, and cached metadata responses. Marketplace browser tests use API fixtures and do not sign or broadcast transactions.

CI runs Node 26 and uses a read-only local Supabase fixture, with no production credentials. Lighthouse checks use three mobile runs per route and retain the reports. The artifact upload explicitly includes hidden files so `.lighthouseci/` is preserved. The fixture makes CI deterministic; it does not measure production API latency or replace real-user Core Web Vitals.

Gzip budgets: homepage 360 KiB, marketplace 530 KiB, characters shell 510 KiB, and each deferred chunk 500 KiB. Initial budgets conservatively include the legacy-browser polyfill. The checker fails when the expected Next build artifacts change instead of silently passing. The desktop/mobile browser suite also caps anonymous marketplace script transfer at 550 KiB, including automatically loaded dynamic chunks before wallet interaction.

Dependabot checks npm packages and GitHub Actions weekly. Review framework and wallet changes together and rerun the browser suite.

## Validation results

Validated with Node 26.13.1: production build, TypeScript, ESLint (zero warnings), all 222 tests in 23 suites, six production browser tests across desktop/mobile, and bundle budgets pass. `pnpm peers check` reports no peer issues.

| Initial route JavaScript | Gzip size | Budget  |
| ------------------------ | --------- | ------- |
| Home                     | 330.6 KiB | 360 KiB |
| Marketplace              | 470.6 KiB | 530 KiB |
| Characters shell         | 442.7 KiB | 510 KiB |

These build measurements include the legacy-browser polyfill. Browser transfer measurements exclude scripts that the browser does not request.

The real-content home measurements scored **88 performance / 93 accessibility** across three mobile Lighthouse runs (median), with **31 ms TBT**, **0.019 CLS**, **4.0 s LCP**, **298.4 KiB of transferred JavaScript**, and **906.0 KiB total transfer**. The hero is approximately 57 KiB instead of its previous 1.13 MB original. The earlier live baseline was 51 performance / 76 accessibility, 770 ms TBT, 8.5 s LCP, 1.11 MiB JavaScript, and 4.17 MiB total transfer. The old run used the deployed site and the new runs use a local production server, so this is diagnostic evidence, not a controlled production comparison or field Core Web Vitals.

The clean CI fixture build passes all Lighthouse error gates (median performance 89 home / 93 marketplace; accessibility 96 on both). Home LCP remains above the 2.5-second target and emits a warning; confirm deployment behavior using the existing Cloudflare real-user analytics. Marketplace Lighthouse measures the shell without live OpenSea inventory, so it does not establish full-listing load speed. The browser suite separately verifies populated listings with representative fixtures.

Local validation has no OpenSea API key. The marketplace's loading/error state and fixture-backed listing interactions are covered; live orders, wallet authentication, signing, and purchases still need verification in a correctly configured preview. No transaction was signed or broadcast. Localhost also is not allowlisted for the configured WalletConnect project.

The external Forgotten Runes lore service returned an upstream error during the visual check, so live lore content was not fully verified. Character names, traits, affinities, and backpack addresses render from local server data; desktop/mobile navigation and readable theme colors were checked in the browser.

The successful build retains an upstream Viem/Ox dynamic-import warning from its Tempo chain definitions and Node 26's experimental `localStorage` warning. These did not fail the production build or browser tests.

### CI blocking-time follow-up (November 15, 2026)

The first GitHub run on `f402804` failed the marketplace TBT gate at 514 ms against a 500 ms limit. Anonymous visits were probing all wallet connectors during reconnection, while WalletConnect and MetaMask also initialized their providers during connector setup. Those unnecessary startup paths are now skipped when there is no connection or installed injected provider to restore. Persisted wallets and active shared connections retain restoration; explicit connection still uses the original connector methods.

On the same local production build setup, three mobile marketplace runs measured median TBT falling from **308 ms to 72.5 ms**, JavaScript transfer from **979.6 KiB to 453.0 KiB**, and performance score from **93 to 100**. These are local comparisons, not predictions of CI timing. The 500 ms limit and other Lighthouse thresholds are unchanged. Regression tests cover returning wallets, an already-connected shared store, invalid/blocked storage, installed injected providers, and preserved connector behavior. CI now uploads its hidden Lighthouse report directory as well as browser reports.

## Remaining upstream dependency advisories

The original audit found 201 advisory entries (including 6 critical); after direct upgrades, 120 remained. Compatible updates and the URI-decoder patch reduced this to **4 entries: 1 high, 1 moderate, 2 low**, with no critical entries. These are dependency-audit findings, not confirmed exploits in this application:

| Package   | Installed transitively | Constraint and follow-up                                                                                                                                                                                                                    |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zod       | 3.22.4 / 3.25.76       | Wallet dependencies require v3. The app uses patched 4.6.7. Do not force v4 into v3 consumers; update the wallet ecosystem when supported. [Advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5).                                   |
| uuid      | 8.3.2 / 9.0.1          | MetaMask/Tokenbound transitive dependencies pin older majors. A major override could change dependency behavior; wait for upstream updates or validate a targeted migration. [Advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq). |
| elliptic  | 6.6.1                  | Tokenbound's server-side dependency. Registry has no published 6.6.2 fix as of this review. This app uses Tokenbound for address calculation, without signing keys. [Advisory](https://github.com/advisories/GHSA-848j-6mx2-7j84).          |
| deepmerge | 4.3.1                  | RainbowKit's styling dependencies. Registry has no published 4.3.2 fix as of this review. [Advisory](https://github.com/advisories/GHSA-gcqx-w48m-w2h4).                                                                                    |

`pnpm-workspace.yaml` records narrow compatibility overrides. `patches/query-string@7.1.3.patch` adapts its CommonJS import to patched ESM `decode-uri-component` 0.5.1; this avoids forcing the incompatible query-string major upgrade. Do not remove the patch while query-string 7 remains in the tree.
