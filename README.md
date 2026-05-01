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
