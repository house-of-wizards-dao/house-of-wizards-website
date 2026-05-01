# Agent Instructions

## Project

House of Wizards is a Next.js 15 App Router site for the House of Wizards DAO. It uses React 18, TypeScript, Tailwind CSS, NextUI, Wagmi, RainbowKit, SIWE, NextAuth, Supabase, OpenSea, and GraphQL integrations.

## Commands

- Install dependencies: `pnpm install`
- Start local development: `pnpm dev`
- Build production app: `pnpm build`
- Run ESLint with fixes: `pnpm lint`
- Run TypeScript checks: `pnpm type-check`
- Run tests: `pnpm test`
- Run tests in watch mode: `pnpm test:watch`
- Run coverage: `pnpm test:coverage`

## Working Guidelines

- Use `pnpm`, not `npm` or `yarn`.
- Keep changes scoped to the requested task and avoid unrelated refactors.
- Prefer existing components, helpers, and integration patterns in `src/components` and `src/lib`.
- Preserve Next.js App Router conventions and the existing TypeScript style.
- Use typed data structures instead of `any` where practical.
- Do not commit secrets. Use `.env.local` for local values and update `.env.example` when adding required environment variables.
- Run `pnpm type-check` and the relevant tests before claiming implementation work is complete.

## TypeScript Style

- Treat TypeScript as strict. Do not bypass type errors with `any`, broad casts, or non-null assertions unless there is a clear reason.
- Prefer explicit domain types in `src/types` or colocated feature types for shared data shapes.
- Use `unknown` plus narrowing for untrusted external data, API responses, and caught errors.
- Prefer `@/*` path aliases for imports from `src`.
- Keep React component props typed with named `type` aliases when reused.
- Prefer type over interface.
- make use of ADT functionality, Discriminated Unions, Intersection Types, Exhaustiveness Checking
- Prefer arrow function over regular function.
- Let `pnpm type-check` be the source of truth for type correctness.

## Project Structure

- `src/app` - Next.js routes and pages
- `src/components` - shared UI and feature components
- `src/lib` - auth, web3, marketplace, posts, and integration helpers
- `src/types` - shared TypeScript types
- `posts` - markdown content for blog-style posts
- `public` - static assets
