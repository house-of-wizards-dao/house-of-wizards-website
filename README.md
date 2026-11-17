# House of Wizards

House of Wizards is the website for the House of Wizards DAO, a Forgotten Runes community project. It includes the public site, news and blog content, character and gallery pages, a marketplace browser, wallet authentication, and Guard-related experiences.

## Tech Stack

- Next.js 16 with the App Router
- React 19 and TypeScript 6
- Tailwind CSS 4 and small local UI components
- Wagmi, RainbowKit, SIWE, and NextAuth for wallet authentication
- Supabase, OpenSea, and GraphQL integrations for dynamic content and marketplace data

## Getting Started

### Prerequisites

- Node.js 26.x (the highest Node major currently supported by Vercel; run `nvm use`)
- pnpm 11.5.0 (pinned in `packageManager`)

### Install Dependencies

```bash
pnpm install
```

### Configure Environment

Copy the example environment file and fill in the values needed for the features you are working on:

```bash
cp .env.example .env.local
```

For basic local UI work, some integrations can be left blank. Wallet login and marketplace/data-backed pages require the relevant API keys and URLs.

The GIFs menu opens `/breadfriend`. Configure `NEXT_PUBLIC_GIPHY_API_KEY` with a GIPHY Web API key before building or deploying. This replaces the server-only `GIPHY_API_KEY`; the web key is intentionally visible in the browser. The gallery requests GIPHY directly on each visit, preserves the returned order, and does not cache API responses or retain media URLs between visits, following [GIPHY's integration requirements](https://developers.giphy.com/docs/api/#best-practices). If the key is missing or requests fail, visitors can still open the GIPHY and KLIPY channels. An eight-second deadline covers the entire paginated request, including response bodies. Account for one API request per page of up to 50 GIFs per visit when choosing the key's quota.

### Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Forgotten Prison local mainnet fork

Install Foundry (`anvil` and `forge`) alongside the dependencies above, then run:

```bash
pnpm prison:local
```

Open [Magic → Prison Test](http://127.0.0.1:3000/magic/prison-test) for the development controls. The command starts a loopback-only mainnet fork on port 8545 (chain 31337), deploys the existing contract, creates and funds a local VRF subscription, and transfers the supported NFTs held by `0x6EAb2d42FEf9aad0036Bc145b5F451799e3FB3F7` into the prison on the fork. The first setup scans warrior ownership at the fork’s fixed block and can take several minutes with a public RPC. It verifies every discovered NFT before transferring. All lab transactions use the fixed localhost transport; the source wallet and coordinator are impersonated only on Anvil.

The page has an account selector, buttons for every contract function, time controls, a mock `rawFulfillRandomWords(requestId, [mainWord, bonusWord])` callback, NFT donation controls, inventory and draw history, and a reset to the original seeded state. A typical test is: place bids → advance to cutoff → `startDailyDraw()` → callback with VRF → `finalizeDraw()` → switch to the winner → `claimNFT()` / `claimBonus()`. Use an even bonus word to award a box, or odd to skip it. To test recovery, leave a draw Requested, advance 7 days + 1 second, and call `shutdownStalledAuction()`; the winner can then withdraw their refund and the owner can recover unsold inventory.

The callback tests the consumer’s behavior and coordinator authentication. It bypasses real Chainlink proof generation, request fulfillment accounting, billing and liveness. The subscription uses 10 fake ETH, and the page displays forked ETH. The production contract is unchanged.

Useful commands and optional settings:

```bash
pnpm prison:setup   # Deploy/seed an already running fresh Anvil fork
pnpm prison:dev     # Start just the local test page on port 3000
pnpm prison:test    # Browser + API + chain checks; resets test state before and after
pnpm prison:test-bidding # Wallet bidding/withdrawal/claim checks; restores the current fork state

# Optional archive RPC and reproducible fork block:
MAINNET_RPC_URL=https://eth.drpc.org FORK_BLOCK_NUMBER=26425199 pnpm prison:local
```

The browser suite uses Playwright Chromium (`pnpm exec playwright install chromium` if needed), or an existing executable supplied through `PRISON_BROWSER_EXECUTABLE`. Setup clears any inherited mainnet EIP-7702 delegation code from the ten Anvil development accounts so they behave as ordinary NFT recipients on the fork.

Without overrides, the fork reads `https://ethereum-rpc.publicnode.com` at the latest block available when it starts. The selected block, NFT IDs, contract address and reset snapshot are saved under ignored `.local/`. At block 26,425,199 the source held **352 warriors, 3 wizards and 114 imp boxes** (355 main prizes). The setup uses actual holdings, rather than assuming the earlier 353-warrior estimate. Restarting Anvil invalidates the saved deployment and requires fresh setup; the page refuses a stale deployment. If a public RPC no longer serves an old block, use an archive RPC or start a fresh fork.

The API requires development mode, `FORGOTTEN_PRISON_LOCAL_ENABLED=1` (set by `prison:dev`), a local Host/Origin, and the matching Anvil instance on chain 31337. The route is unavailable in production. Keep both processes running while testing. `prison:local` stops processes it started when interrupted, but leaves an existing Anvil process alone.

### Forgotten Prison bidding page

[Magic → Forgotten Prison](http://127.0.0.1:3000/magic/forgotten-prison) is the public-facing wallet flow: current auction, additive ETH bids, standing-bid withdrawals, aborted-draw refunds, independent NFT/box claims, and recent results. All writes go through the connected wallet. It exposes no account impersonation, owner controls, time manipulation, or mock VRF callbacks. Bidding does not require signing in to the website.

In local development with `prison:dev`, it uses the saved Anvil deployment and displays a local-preview label. Connect a wallet to RPC `http://127.0.0.1:8545`, chain ID `31337`, using a funded Anvil test account. The page asks the wallet to switch networks before transacting. Continue to use `/magic/prison-test` to advance time and settle draws while testing the bidder experience.

For the live site, set server-side `FORGOTTEN_PRISON_ADDRESS` to the deployed Ethereum mainnet contract and configure `NEXT_PUBLIC_RPC_URL` for mainnet reads. Without a live address, the public route displays a pre-launch message. Production cannot select the local deployment. No live contract deployment is performed by building this page.

## Useful Scripts

```bash
pnpm dev              # Start the development server
pnpm build            # Build the production app
pnpm start            # Start the production server after building
pnpm lint             # Check ESLint without modifying files
pnpm lint:fix         # Apply ESLint fixes
pnpm type-check       # Run TypeScript checks
pnpm test             # Run Jest tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:coverage    # Run Jest with coverage
pnpm test:e2e         # Production browser checks (build first)
pnpm bundle:check     # Enforce initial/deferred gzip budgets (build first)
pnpm perf:check       # Run mobile Lighthouse with budgets (build first)
```

## Project Structure

- `src/app` - Next.js routes and pages
- `src/components` - Shared UI and feature components
- `src/lib` - Server and client helpers for auth, web3, marketplace, posts, and integrations
- `src/types` - Shared TypeScript types
- `posts` - Markdown content for blog-style posts
- `public` - Static assets

## Development Notes

- Use `.env.local` for local secrets and API keys.
- `NEXTAUTH_URL` should be `http://localhost:3000` when running locally.
- Generate a strong `NEXTAUTH_SECRET` for wallet authentication.
- Marketplace data depends on the configured external APIs, so pages may fall back or show partial data when those values are missing.

See [performance and dependency maintenance](docs/performance.md) for upgrade constraints, architecture decisions, and verification.

### Forgotten Prison event index

The mainnet contract is indexed in Supabase once a minute. The bidding page includes a standing-bid leaderboard and explicit draw progress; `/magic/forgotten-prison/history` shows every round, prize, bonus, and claim. See [indexer operations and recovery](supabase/README-prison.md) for the schema, scheduler, security model, and tests.
