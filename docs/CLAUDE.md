# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

House of Wizards - A Forgotten Runes Community DAO platform built with Next.js 14 (Pages Router), NextUI v2, and Supabase.

## Essential Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server  
npm run start

# Lint code (with auto-fix)
npm run lint

# Run tests
npm run test
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
npm run test:ci        # CI mode
```

## Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 14 with Pages Router (not App Router)
- **UI Components**: NextUI v2 with custom theme configuration
- **Styling**: Tailwind CSS with custom fonts (Mona Sans, Atirose, OCRAStd)
- **Backend/Auth**: Supabase (PostgreSQL + Authentication)
- **State Management**: React Context via Supabase Auth
- **Theme**: Dark mode only (forced via next-themes)
- **Testing**: Jest with React Testing Library

### Key Architectural Patterns

1. **Authentication Flow**: 
   - Supabase Auth handles user sessions
   - `AuthWrapper` component provides auth context for admin routes
   - Protected routes check auth state before rendering
   - User profiles stored in `profiles` table with role-based access

2. **Data Flow**:
   - Direct Supabase client calls from components
   - API routes in `/pages/api/` for server-side operations
   - Service role client available for admin operations
   - Real-time subscriptions for live data updates

3. **Component Structure**:
   - Page components in `/pages/` handle routing
   - Shared components in `/components/`
   - Layout wrapper in `/layouts/default.tsx`
   - All pages wrapped with consistent layout and providers

### Critical Implementation Notes

1. **Supabase Integration**:
   - Client initialized with environment variables via `lib/env.ts`
   - Service role client for server-side operations in API routes
   - Tables: `profiles`, `artists`, `gallery_items`, `talents`
   - Row Level Security (RLS) policies control data access
   - Image storage configured with domain in `next.config.js`

2. **Admin Features**:
   - Admin panel at `/admin` with role-based authentication
   - User management, talent management, content management
   - Soft delete functionality for records
   - Search and filter capabilities

3. **Styling Approach**:
   - Tailwind utilities for layout and spacing
   - NextUI components for UI elements
   - Custom color scheme: violet (#A986D9), darkviolet (#4D3E63), green (#AAC764)
   - Mobile-first responsive design
   - Custom fonts loaded via local files

4. **External Integrations**:
   - Snapshot.org for DAO voting (iframe integration)
   - Image hosting via Supabase Storage (ctyeiwzxltrqyrbcbrii.supabase.co)

### Development Considerations

- Test files in `__tests__/` directory with Jest configuration
- Mixed TypeScript/JavaScript usage - prefer TypeScript for new files
- ESLint configured with strict rules including accessibility checks
- Environment variables required (see `.env.example`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)