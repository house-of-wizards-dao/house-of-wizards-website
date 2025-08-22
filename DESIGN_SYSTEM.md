# House of Wizards DAO - Design System

## Overview

This design system provides a unified visual language and component library for the House of Wizards DAO application. It ensures consistency, improves developer experience, and creates a cohesive brand experience across all pages and features.

## 🎨 Design Principles

1. **Consistency First**: Every component follows the same design patterns
2. **Dark Theme Native**: Designed for optimal dark mode experience
3. **Brand-Focused**: Emphasizes the mystical wizard theme with purple/violet brand colors
4. **Mobile-First**: Responsive design with mobile experiences prioritized
5. **Accessibility**: WCAG compliant components with proper focus states
6. **Developer Experience**: Type-safe, well-documented, and easy to use

## 🏗️ Architecture

### Design Tokens (`/config/design-tokens.ts`)
Centralized design values including:
- Color palettes with semantic naming
- Typography scales and font families
- Spacing system (8px grid)
- Border radius, shadows, and z-index scales
- Animation durations and easing functions

### Component Library (`/components/ui/`)
Unified components built with:
- **Class Variance Authority (CVA)**: Type-safe variant management
- **Tailwind CSS**: Utility-first styling
- **React + TypeScript**: Full type safety
- **Consistent APIs**: Similar props across all components

### Utilities (`/lib/utils.ts`)
Helper functions for:
- Class name merging (`cn()`)
- Consistent formatting (currency, time, text)
- Common UI interactions

## 🎯 Color System

### Brand Colors
```typescript
// Primary brand colors
brand.500: '#A986D9' // Main violet
brand.900: '#4D3E63' // Dark violet

// Accent colors  
accent.400: '#AAC764' // Green accent
```

### Semantic Colors
```typescript
success: '#10B981' // Green
warning: '#F59E0B' // Amber  
error: '#EF4444'   // Red
info: '#3B82F6'    // Blue
```

### Usage Guidelines
- **Primary actions**: Use `brand.500` (violet)
- **Secondary actions**: Use `brand.900` or outline variants
- **Success states**: Use `success` green
- **Errors/warnings**: Use `error` red or `warning` amber
- **Text on dark**: Use `neutral.50` to `neutral.400`

## 📝 Typography

### Font Hierarchy
```typescript
fontFamily: {
  primary: 'Mona Sans',    // Body text, UI elements
  heading: 'Atirose',      // Headers, titles
  mono: 'OCRAStd',         // Code, addresses
}
```

### Size Scale
```typescript
fontSize: {
  xs: '10px',   // Captions, labels
  sm: '12px',   // Secondary text
  base: '16px', // Body text (default)
  lg: '18px',   // Large body text
  xl: '20px',   // Small headings
  '2xl': '24px', // Medium headings
  '3xl': '30px', // Large headings
  '4xl': '36px', // Hero text
  '5xl': '48px', // Display text
}
```

### Usage Guidelines
- **Headlines**: Use `font-heading` (Atirose) for mystical feel
- **Body text**: Use `font-primary` (Mona Sans) for readability
- **Technical**: Use `font-mono` (OCRAStd) for addresses, code
- **Hierarchy**: Maintain consistent size relationships

## 🧩 Component Guidelines

### Button Component
```tsx
import { Button } from '@/components/ui';

// Primary action
<Button variant="primary" size="lg">
  Submit Proposal
</Button>

// Secondary action  
<Button variant="secondary">
  Learn More
</Button>

// With icons
<Button leftIcon={<Icon />} variant="primary">
  Connect Wallet
</Button>
```

**Variants:**
- `primary`: Main actions (violet background)
- `secondary`: Secondary actions (outline)
- `ghost`: Subtle actions (transparent)
- `destructive`: Delete/remove actions (red)
- `outline`: Alternative secondary style

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card variant="elevated" hover="lift">
  <CardHeader>
    <CardTitle>Auction Title</CardTitle>
    <CardDescription>By Artist Name</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Variants:**
- `default`: Standard card with border
- `elevated`: Card with shadow
- `outlined`: Emphasized border
- `gradient`: Brand gradient background

### Input Component
```tsx
import { Input, Textarea } from '@/components/ui';

<Input 
  label="Proposal Title"
  placeholder="Enter title..."
  helperText="This will be publicly visible"
/>

<Textarea
  label="Description"
  placeholder="Describe your proposal..."
  error="This field is required"
/>
```

**Variants:**
- `default`: Standard input with border
- `filled`: Background filled input
- `underlined`: Bottom border only
- `ghost`: Transparent background

## 📐 Spacing System

Uses 8px base unit for consistent spacing:

```typescript
spacing: {
  1: '4px',   // 0.5 * 8px
  2: '8px',   // 1 * 8px  
  4: '16px',  // 2 * 8px
  6: '24px',  // 3 * 8px
  8: '32px',  // 4 * 8px
  // ... continues in 8px increments
}
```

**Usage:**
- `p-4`: Standard component padding
- `gap-6`: Standard grid gaps  
- `mb-8`: Section margins
- `mt-12`: Large section spacing

## 🎭 Animation Guidelines

### Durations
```typescript
duration: {
  fast: '150ms',   // Micro-interactions
  normal: '300ms', // Standard transitions  
  slow: '500ms',   // Complex animations
}
```

### Easing
- Use `ease-in-out` for most transitions
- `ease-out` for enter animations
- `ease-in` for exit animations

### Common Animations
```css
/* Hover effects */
hover:scale-[1.02]
hover:shadow-brand

/* Focus states */  
focus:ring-2 focus:ring-brand-500

/* Loading states */
animate-pulse
animate-spin
```

## 📱 Responsive Design

### Breakpoints
```typescript
screens: {
  sm: '640px',   // Mobile large
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop small
  xl: '1280px',  // Desktop large  
  '2xl': '1536px' // Desktop extra large
}
```

### Mobile-First Approach
```tsx
// Base styles for mobile, then enhance for larger screens
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## ♿ Accessibility

### Focus Management
- All interactive elements have visible focus states
- Focus rings use brand colors with sufficient contrast
- Tab order follows logical page flow

### Color Contrast
- Text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements meet AA standards  
- Error states use both color and text indicators

### Screen Readers
- Semantic HTML structure
- Proper ARIA labels and descriptions
- Meaningful alt text for images

## 🚀 Implementation Guidelines

### Getting Started
1. **Import design tokens**: Use values from `/config/design-tokens.ts`
2. **Use UI components**: Import from `/components/ui`
3. **Follow naming**: Use semantic class names
4. **Maintain consistency**: Stick to the design system patterns

### Migration Strategy
1. **Phase 1**: Update Tailwind config with design tokens ✅
2. **Phase 2**: Create core UI components ✅  
3. **Phase 3**: Refactor existing components to use design system
4. **Phase 4**: Update all pages to use unified components
5. **Phase 5**: Remove legacy styling and consolidate

### Do's and Don'ts

#### ✅ Do:
- Use components from `/components/ui`
- Follow the spacing system (8px grid)
- Use semantic color names (`brand.500` not `#A986D9`)
- Add proper TypeScript types
- Include accessibility attributes
- Test on mobile devices

#### ❌ Don't:
- Use hardcoded colors in components
- Create one-off component variants
- Skip responsive design considerations
- Ignore focus states
- Use inconsistent spacing values
- Override component styles with arbitrary CSS

## 🔧 Development Workflow

### Adding New Components
1. Create component in `/components/ui/`
2. Use CVA for variant management
3. Include TypeScript types
4. Export from `/components/ui/index.ts`
5. Document usage examples
6. Test across breakpoints

### Updating Design Tokens
1. Modify `/config/design-tokens.ts`
2. Update Tailwind config if needed
3. Test existing components for regressions
4. Update documentation

## 📊 Component Status

### ✅ Complete
- Design tokens system
- Button component
- Card component  
- Input/Textarea components
- Utility functions

### 🚧 In Progress
- Navigation components
- Form components
- Layout components

### 📋 Planned
- Modal/Dialog components
- Toast notifications
- Data display components
- Complex form elements

## 🎯 Brand Guidelines

### Visual Identity
- **Primary Color**: Violet (#A986D9) - represents magic and mysticism
- **Secondary Color**: Green (#AAC764) - represents growth and community
- **Typography**: Mix of modern (Mona Sans) and mystical (Atirose)
- **Imagery**: Dark, mysterious aesthetic with magical elements

### Voice & Tone
- **Professional yet mystical**: Balance credibility with wizard theme
- **Community-focused**: Emphasize collective decision making
- **Accessible**: Clear communication for all users
- **Magical**: Subtle references to wizards and magic

### Brand Applications
- Use gradient backgrounds sparingly for emphasis
- Maintain dark theme throughout
- Include subtle animations for magical feel
- Use consistent iconography (Heroicons, Lucide)

---

## 📚 Resources

- [Design Tokens Reference](/config/design-tokens.ts)
- [Component Library](/components/ui/)
- [Utility Functions](/lib/utils.ts)
- [Tailwind Configuration](/tailwind.config.js)

For questions or contributions to the design system, please refer to the development team.