# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential Commands:**
```bash
npm run dev                # Start development server
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Lint and fix TypeScript/React files
npm run type-check        # Run TypeScript type checking
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
npm run structure:check   # Alias for type-check
```

**Testing Commands:**
```bash
npm run test              # Run Jest tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ci           # Run tests for CI/CD
```

## Architecture Overview

This is a Next.js application for the House of Wizards DAO community platform, built with the following architecture:

### Core Technologies
- **Framework:** Next.js 14 (Pages Router) with TypeScript
- **UI Library:** NextUI components with Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Web3:** RainbowKit + Wagmi integration
- **State Management:** React Context + React Query
- **Styling:** Design token system with centralized theming

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI primitives (Button, Card, Input)
│   ├── admin/           # Admin panel components
│   ├── auth/            # Authentication components
│   └── gallery/         # Gallery/file management components
├── pages/               # Next.js pages (file-based routing)
│   ├── api/            # API routes
│   ├── admin/          # Admin interface pages
│   └── [feature]/      # Feature-specific pages
├── lib/                 # Core utilities and configurations
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── config/              # Configuration files
└── styles/              # Global styles
```

### Key Architectural Patterns

**Authentication & Authorization:**
- Supabase Auth integration with custom middleware
- Admin panel with role-based access control
- Both client-side and server-side Supabase clients

**Component Architecture:**
- Centralized design token system (`src/config/design-tokens.ts`)
- NextUI integration with custom theming
- Reusable UI primitives in `src/components/ui/`
- Feature-specific components organized by domain

**Data Layer:**
- Supabase client/server separation pattern
- Custom validation schemas with Zod
- Admin services for user/content management
- File upload handling with progress tracking

**Web3 Integration:**
- RainbowKit wallet connection
- Wagmi for blockchain interactions  
- Web3 provider wrapper with error boundaries

## Key Configuration Files

- `tailwind.config.js` - Tailwind configuration with design token integration
- `next.config.js` - Next.js configuration with security headers and image optimization
- `tsconfig.json` - TypeScript configuration with path aliases (@/*)
- `src/config/design-tokens.ts` - Centralized design system
- `src/lib/supabase.ts` - Database client configuration

## Development Workflow

1. **Linting & Formatting:** Always run `npm run lint` and `npm run type-check` before commits
2. **Design System:** Use design tokens from `src/config/design-tokens.ts` for consistent styling
3. **Path Aliases:** Use `@/*` imports for clean import paths
4. **Component Organization:** Keep components feature-organized with clear separation of concerns

## Important Notes

- The application uses a dark-first design approach
- Strong emphasis on TypeScript typing throughout
- Supabase integration requires both public and service role keys
- Admin functionality is protected by role-based access control
- File uploads are handled through Supabase Storage with progress tracking