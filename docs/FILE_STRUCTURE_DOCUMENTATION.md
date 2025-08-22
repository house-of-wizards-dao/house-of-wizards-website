# House of Wizards DAO - File Structure Documentation

A comprehensive guide to the architecture and file organization of the Forgotten Runes Community DAO platform.

## Table of Contents

- [Level 1: Executive Overview](#level-1-executive-overview)
- [Level 2: Functional Architecture Map](#level-2-functional-architecture-map)
- [Level 3: Developer Navigation Guide](#level-3-developer-navigation-guide)
- [Level 4: Technical Deep Dive](#level-4-technical-deep-dive)

---

## Level 1: Executive Overview

### Platform Capabilities

The House of Wizards DAO is a sophisticated hybrid Web2/Web3 platform that combines traditional web application features with blockchain functionality. This platform serves as the central hub for the Forgotten Runes community, providing:

- **Community Governance**: DAO voting and proposal management through Snapshot.org integration
- **Digital Asset Management**: NFT collections, auctions, and marketplace functionality
- **Creator Economy**: Artist showcases, talent directory, and content management
- **Administrative Control**: Comprehensive admin panel with user and content management
- **Authentication System**: Supabase-powered authentication with role-based access control

### Core Technology Stack

**Frontend Architecture**
- **Framework**: Next.js 14 (Pages Router) - Production-ready React framework
- **UI Library**: NextUI v2 - Modern component library with built-in accessibility
- **Styling**: Tailwind CSS with custom theme configuration
- **Typography**: Custom fonts (Mona Sans, Atirose, OCRAStd) for brand consistency
- **State Management**: React Context via Supabase Auth
- **Theme System**: Dark mode only via next-themes

**Backend Infrastructure**
- **Database**: PostgreSQL via Supabase with Row Level Security (RLS)
- **Authentication**: Supabase Auth with role-based permissions
- **File Storage**: Supabase Storage with CDN integration
- **API Layer**: Next.js API routes with middleware protection
- **Real-time Features**: Supabase subscriptions for live updates

**Web3 Integration**
- **Ethereum Interaction**: Hardhat development environment
- **Smart Contracts**: OpenZeppelin-based secure contracts
- **Wallet Connection**: RainbowKit for multi-wallet support
- **Blockchain Network**: Ethereum mainnet with Sepolia testnet support
- **Auction System**: Hybrid on-chain/off-chain auction house

### Key Architectural Decisions

1. **Hybrid Architecture**: Combines traditional web app benefits with Web3 capabilities
2. **Security-First**: Comprehensive security layers including RLS, rate limiting, and sanitization
3. **Performance Optimized**: Image optimization, lazy loading, and efficient data fetching
4. **Accessibility Focused**: WCAG compliance with comprehensive testing
5. **Scalable Design**: Modular component architecture supporting growth

---

## Level 2: Functional Architecture Map

### Authentication & User Management

**Core Files**: 19 files managing user lifecycle and security

```
lib/auth.ts                 # Authentication utilities and session management
lib/supabase.ts            # Supabase client configuration (client/server)
components/AuthWrapper.tsx  # Protected route wrapper with admin checks
components/auth/AuthForm.tsx # Login/signup form component
pages/admin/login.tsx      # Admin authentication page
pages/signup/index.tsx     # User registration flow
```

**Features**:
- Supabase Auth integration with email/password
- Role-based access control (admin/user)
- Protected routes for sensitive operations
- Session persistence and auto-refresh
- User profile management with avatar uploads

### Web3 Integration

**Core Files**: 8 files handling blockchain interactions

```
contracts/HybridAuctionHouse.sol    # Main auction contract
lib/web3-config.ts                  # Web3 provider configuration
hooks/useAuctionContract.ts         # Contract interaction hook
components/Web3ConnectButton.tsx    # Wallet connection component
components/Web3Provider.tsx         # Web3 context provider
components/auction/BidWithETH.tsx   # Ethereum bidding interface
```

**Features**:
- Multi-wallet support via RainbowKit
- Hybrid auction system (on-chain + off-chain)
- Smart contract security with OpenZeppelin
- Real-time blockchain event listening
- Gas optimization and error handling

### Admin & Content Management

**Core Files**: 12 files providing comprehensive admin capabilities

```
components/AdminPanel.tsx              # Main admin dashboard
components/admin/UserManagement.tsx    # User CRUD operations
components/admin/TalentManagement.tsx  # Talent directory management
components/admin/ContentManagement.tsx # Content moderation tools
components/admin/CreateUser.tsx        # User creation interface
lib/admin-service.ts                   # Admin business logic
lib/api-middleware.ts                  # API protection middleware
lib/rate-limiter.ts                    # Request rate limiting
lib/sanitization.ts                    # Input sanitization
```

**Features**:
- Complete user lifecycle management
- Content moderation and approval workflows
- Bulk operations with soft delete
- Advanced search and filtering
- Audit trail and activity logging
- Rate limiting and security controls

### Community Features

**Core Files**: 15 files supporting community interaction

```
pages/community/index.tsx           # Community hub page
pages/artists/index.tsx             # Artist showcase
pages/gallery/index.tsx             # Community gallery
pages/talent/index.tsx              # Talent directory
pages/ministries/index.tsx          # Ministry organization
components/gallery/FileGallery.tsx  # Gallery display component
components/profile/ProfileEditor.tsx # User profile editing
```

**Features**:
- Artist and creator showcases
- Community-generated content gallery
- Talent directory with skills matching
- Ministry-based organization structure
- User profiles with social links
- File upload and management system

### Infrastructure

**Core Files**: 23 files managing system foundation

```
lib/env.ts                    # Environment configuration
lib/logger.ts                 # Application logging
lib/validation-schemas.ts     # Data validation schemas
lib/validation.ts             # Input validation utilities
config/site.ts               # Site configuration
config/fonts.ts              # Font loading configuration
layouts/default.tsx          # Application layout wrapper
components/ErrorBoundary.tsx # Error handling
```

**Features**:
- Centralized configuration management
- Comprehensive error handling and logging
- Input validation and sanitization
- Performance monitoring
- SEO optimization
- Progressive Web App capabilities

---

## Level 3: Developer Navigation Guide

### Project Structure Overview

```
how-dao-revamp/                     # Root directory (457 total files)
├── components/                     # React components (23 files)
├── pages/                         # Next.js pages (18 files)
├── lib/                           # Utility libraries (11 files)
├── hooks/                         # Custom React hooks (3 files)
├── types/                         # TypeScript definitions (2 files)
├── styles/                        # Global styles (1 file)
├── public/                        # Static assets (69 files)
├── supabase/                      # Database migrations (7 files)
├── contracts/                     # Smart contracts (1 file)
├── artifacts/                     # Compiled contracts (213 files)
├── __tests__/                     # Test files (4 files)
└── config/                        # Configuration files (2 files)
```

### Component Architecture

**Core Components** (`/components/`)

```
components/
├── AdminPanel.tsx                  # Admin dashboard (348 lines)
├── AuthWrapper.tsx                 # Route protection (67 lines)
├── ErrorBoundary.tsx              # Error handling (89 lines)
├── OptimizedImage.tsx             # Performance-optimized images (78 lines)
├── Web3ConnectButton.tsx          # Wallet connection (45 lines)
├── Web3Provider.tsx               # Web3 context (112 lines)
├── navbar.tsx                     # Navigation component (178 lines)
├── icons.tsx                      # Icon components (156 lines)
├── primitives.ts                  # Styled primitives (45 lines)
└── admin/                         # Admin-specific components
    ├── ContentManagement.tsx      # Content operations (267 lines)
    ├── CreateUser.tsx             # User creation (156 lines)
    ├── TalentManagement.tsx       # Talent management (378 lines)
    └── UserManagement.tsx         # User operations (289 lines)
```

**Specialized Components**

```
components/
├── auth/
│   └── AuthForm.tsx              # Authentication forms (178 lines)
├── auction/
│   └── BidWithETH.tsx            # Ethereum bidding (89 lines)
├── gallery/
│   └── FileGallery.tsx           # File display (234 lines)
├── profile/
│   └── ProfileEditor.tsx         # Profile editing (203 lines)
├── ui/                           # Reusable UI components
│   ├── ErrorMessage.tsx          # Error display (23 lines)
│   ├── LoadingSpinner.tsx        # Loading states (34 lines)
│   └── SuccessMessage.tsx        # Success feedback (23 lines)
└── upload/
    └── FileUpload.tsx            # File upload handling (234 lines)
```

### Page Structure

**Application Pages** (`/pages/`)

```
pages/
├── _app.tsx                      # App wrapper with providers (89 lines)
├── _document.tsx                 # HTML document structure (67 lines)
├── index.tsx                     # Landing page (234 lines)
├── about/index.tsx               # About page (145 lines)
├── admin/                        # Admin section
│   ├── index.tsx                 # Admin dashboard (123 lines)
│   └── login.tsx                 # Admin login (89 lines)
├── artists/index.tsx             # Artist showcase (178 lines)
├── auctions/                     # Auction system
│   ├── index.tsx                 # Auction listings (234 lines)
│   ├── create.tsx                # Auction creation (312 lines)
│   └── [id].tsx                  # Individual auction (289 lines)
├── community/index.tsx           # Community hub (189 lines)
├── gallery/index.tsx             # Image gallery (267 lines)
├── ministries/                   # Ministry organization
│   ├── index.tsx                 # Ministry overview (156 lines)
│   └── art/index.tsx             # Art ministry (134 lines)
├── signup/index.tsx              # User registration (345 lines)
├── talent/index.tsx              # Talent directory (289 lines)
└── user/[userId].tsx             # User profiles (178 lines)
```

**API Routes** (`/pages/api/`)

```
pages/api/
├── hello.ts                      # Test endpoint (23 lines)
├── profile.ts                    # Profile operations (134 lines)
└── users.ts                      # User management (178 lines)
```

### Library Structure

**Core Libraries** (`/lib/`)

```
lib/
├── env.ts                        # Environment validation (67 lines)
├── supabase.ts                   # Database client (39 lines)
├── auth.ts                       # Auth utilities (89 lines)
├── admin-service.ts              # Admin operations (234 lines)
├── api-middleware.ts             # API protection (123 lines)
├── rate-limiter.ts               # Request limiting (78 lines)
├── sanitization.ts               # Input cleaning (56 lines)
├── validation-schemas.ts         # Zod schemas (145 lines)
├── validation.ts                 # Validation utilities (89 lines)
├── logger.ts                     # Logging system (67 lines)
└── web3-config.ts                # Web3 configuration (45 lines)
```

### Database Structure

**Supabase Migrations** (`/supabase/migrations/`)

```
supabase/migrations/
├── create_talents_table.sql          # Talent table creation
├── add_avatar_url_to_talents.sql     # Avatar support
├── create_talent_avatars_bucket.sql  # Storage bucket setup
├── add_admin_functions.sql           # Admin utilities
├── add_audit_system.sql              # Activity tracking
├── add_performance_indexes.sql       # Query optimization
└── create_rate_limits_table.sql      # Rate limiting
```

**Additional SQL Files** (Root level - 8 files)
- Schema definitions and auction-related tables
- Migration scripts and data fixes
- Sample data for development

### Testing Structure

**Test Files** (`/__tests__/`)

```
__tests__/
├── setup.ts                      # Jest configuration
├── components/
│   ├── ErrorBoundary.test.tsx    # Error boundary tests
│   └── OptimizedImage.test.tsx   # Image component tests
└── lib/
    ├── env.test.ts               # Environment tests
    └── validation-schemas.test.ts # Schema validation tests
```

### Asset Organization

**Public Assets** (`/public/` - 69 files)

```
public/
├── fonts/                        # Custom typography (5 files)
│   ├── mona-sans/               # Mona Sans font family
│   ├── OCRAStd.otf              # OCR font
│   └── atirose.{otf,ttf}        # Atirose font
└── img/                          # Images (63 files)
    ├── council/                  # Council member photos (18 files)
    ├── talent/                   # Talent showcase (42 files)
    └── branding/                 # Logos and banners (3 files)
```

### Smart Contract Architecture

**Blockchain Components** (`/contracts/` & `/artifacts/`)

```
contracts/
└── HybridAuctionHouse.sol        # Main auction contract

artifacts/                        # Compiled contracts (213 files)
├── @openzeppelin/                # OpenZeppelin dependencies
├── contracts/                    # Compiled project contracts
└── build-info/                   # Compilation metadata
```

---

## Level 4: Technical Deep Dive

### Security Architecture

**Multi-Layer Security Implementation**

1. **Database Security** (Supabase RLS)
   - Row Level Security policies on all tables
   - Role-based access control (admin/user/public)
   - Secure service role for server-side operations
   - Audit trails for sensitive operations

2. **API Security** (`lib/api-middleware.ts`)
   - Request rate limiting (100 requests/15min default)
   - Input sanitization and validation
   - CSRF protection via SameSite cookies
   - Authentication verification on protected routes

3. **Input Validation** (`lib/validation-schemas.ts`)
   - Zod schema validation for all user inputs
   - File upload restrictions and type validation
   - SQL injection prevention through parameterized queries
   - XSS protection via content sanitization

4. **Smart Contract Security**
   - OpenZeppelin battle-tested contract libraries
   - Reentrancy guards on auction functions
   - Access control modifiers
   - Pausable functionality for emergency stops

### Real-time Implementation

**Supabase Realtime Features**

1. **Live Data Updates**
   - Real-time subscriptions for auction bids
   - Gallery updates without page refresh
   - User status changes (online/offline)
   - Admin notifications for new content

2. **Performance Optimization**
   - Selective subscription to relevant data
   - Connection pooling and cleanup
   - Efficient query patterns with indexes
   - Image optimization with next/image

### Architecture Patterns

**Component Design Patterns**

1. **Container/Presenter Pattern**
   - Pages handle data fetching and state
   - Components focus on presentation
   - Clear separation of concerns
   - Improved testability

2. **Compound Components**
   - Complex UI elements broken into composable parts
   - Gallery items with modal interactions
   - Admin panels with nested functionality
   - Form components with validation states

3. **Custom Hooks**
   - `useAuctionContract`: Blockchain interaction abstraction
   - `useToast`: Centralized notification system
   - `useKeyboardNavigation`: Accessibility enhancement

**State Management Strategy**

1. **Context-Based State**
   - Supabase Auth context for user state
   - Web3 provider context for blockchain state
   - Minimal global state, prefer local state

2. **Server State**
   - React Query for data fetching (planned)
   - Optimistic updates for better UX
   - Background refetching and caching

### Production Considerations

**Performance Optimization**

1. **Image Handling**
   - Next.js Image component with optimization
   - Supabase CDN for fast delivery
   - Lazy loading with intersection observer
   - WebP format support with fallbacks

2. **Bundle Optimization**
   - Tree shaking for unused code elimination
   - Dynamic imports for route-based code splitting
   - Font optimization with display: swap
   - Minimal runtime dependencies

**Deployment Architecture**

1. **Vercel Integration**
   - Automatic deployments from Git
   - Environment variable management
   - Edge function support for API routes
   - Built-in analytics and monitoring

2. **Database Scaling**
   - Supabase managed PostgreSQL
   - Connection pooling with PgBouncer
   - Read replicas for query distribution
   - Automated backups and point-in-time recovery

**Monitoring and Observability**

1. **Error Tracking**
   - React Error Boundaries for graceful failures
   - Server-side error logging
   - User-friendly error messages
   - Stack trace collection for debugging

2. **Performance Metrics**
   - Core Web Vitals monitoring
   - API response time tracking
   - Database query performance
   - User interaction analytics

### Development Workflow

**Code Quality Assurance**

1. **TypeScript Integration**
   - Strict type checking enabled
   - Interface definitions for all data structures
   - Generic types for reusable components
   - Path mapping for clean imports

2. **Testing Strategy**
   - Jest with React Testing Library
   - Component unit tests
   - Integration tests for critical flows
   - Coverage reporting and CI integration

3. **Code Standards**
   - ESLint with accessibility rules
   - Prettier for consistent formatting
   - Husky pre-commit hooks
   - Import organization and unused import removal

**Environment Management**

1. **Configuration**
   - Environment-specific variables
   - Type-safe environment validation
   - Development vs production distinctions
   - Secret management through Vercel/Supabase

2. **Development Tools**
   - Next.js development server with hot reload
   - Hardhat for smart contract development
   - Supabase local development support
   - TypeScript watch mode

This documentation provides a comprehensive view of the House of Wizards DAO platform, from high-level architecture to implementation details. It serves as both a reference for developers and a guide for stakeholders understanding the platform's capabilities and technical sophistication.