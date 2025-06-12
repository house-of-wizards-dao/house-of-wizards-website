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

# Lint code
npm run lint
```

## Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 14 with Pages Router (not App Router)
- **UI Components**: NextUI v2 with custom theme configuration
- **Styling**: Tailwind CSS with custom fonts (Mona Sans, Atirose, OCRAStd)
- **Backend/Auth**: Supabase (PostgreSQL + Authentication)
- **State Management**: React Context via Supabase Auth
- **Theme**: Dark mode only (forced via next-themes)

### Key Architectural Patterns

1. **Authentication Flow**: 
   - Supabase Auth handles user sessions
   - `AuthWrapper` component provides auth context
   - Protected routes check auth state before rendering
   - User profiles stored in `profiles` table with metadata

2. **Data Flow**:
   - Direct Supabase client calls from components
   - API routes in `/pages/api/` for server-side operations
   - Real-time subscriptions for live data updates

3. **Component Structure**:
   - Page components in `/pages/` handle routing
   - Shared components in `/components/`
   - Layout wrapper in `/layouts/default.tsx`
   - All pages wrapped with consistent layout and providers

### Critical Implementation Notes

1. **Supabase Integration**:
   - Client initialized with hardcoded keys (should be env vars)
   - Tables: `profiles`, `artists`, `gallery_items`, `talents`
   - Row Level Security (RLS) policies control data access

2. **Admin Features**:
   - Admin panel at `/admin` with login protection
   - User management capabilities
   - Search and filter functionality

3. **Styling Approach**:
   - Tailwind utilities for layout and spacing
   - NextUI components for UI elements
   - Custom color scheme: violet, darkviolet, green
   - Mobile-first responsive design

4. **External Integrations**:
   - Snapshot.org for DAO voting (iframe integration)
   - Image hosting via Supabase Storage

### Development Considerations

- No test suite exists - add tests when implementing new features
- Mixed TypeScript/JavaScript usage - prefer TypeScript for new files
- ESLint configured with strict rules including accessibility checks
- Images served from Supabase require domain configuration in next.config.js