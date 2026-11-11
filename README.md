# House of Wizards

House of Wizards is the website for the House of Wizards DAO, a Forgotten Runes community project. It includes the public site, news and blog content, character and gallery pages, a marketplace browser, wallet authentication, and Guard-related experiences.

## Tech Stack

- Next.js 15 with the App Router
- React 18 and TypeScript
- Tailwind CSS and NextUI
- Wagmi, RainbowKit, SIWE, and NextAuth for wallet authentication
- Supabase, OpenSea, and GraphQL integrations for dynamic content and marketplace data

## Getting Started

### Prerequisites

- Node.js 20 or newer
- pnpm

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

## Useful Scripts

```bash
pnpm dev              # Start the development server
pnpm build            # Build the production app
pnpm start            # Start the production server after building
pnpm lint             # Run ESLint with fixes
pnpm type-check       # Run TypeScript checks
pnpm test             # Run Jest tests
pnpm test:watch       # Run Jest in watch mode
pnpm test:coverage    # Run Jest with coverage
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
