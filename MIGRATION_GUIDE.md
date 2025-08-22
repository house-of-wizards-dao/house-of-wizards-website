# Design System Migration Guide

This guide outlines how to migrate existing components and pages to use the new unified design system.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install class-variance-authority tailwind-merge
```

### 2. Update Imports
Replace individual component imports with design system imports:

```tsx
// ❌ Before
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

// ✅ After  
import { Button, Card, CardContent } from "@/components/ui";
```

### 3. Use Design Tokens
Replace hardcoded values with design tokens:

```tsx
// ❌ Before
className="text-[#9564b4] bg-[#121212]"

// ✅ After
className="text-brand-500 bg-neutral-900"
```

## 📋 Component Migration Checklist

### Button Components

#### Before (Multiple Inconsistent Styles):
```tsx
// Homepage button
<button className="bg-violet text-white px-8 py-3 rounded-full hover:bg-violet-600 transition-all duration-300 transform hover:scale-105">
  Meet the Team
</button>

// Auction filter button  
<Button className={`px-6 py-3 rounded-full transition-all ${
  filter === "active" 
    ? "bg-violet text-white" 
    : "bg-transparent border border-darkviolet text-gray-300"
}`}>
  Active Auctions
</Button>

// Contact form button
<button className="w-full bg-white text-black py-3 px-6 rounded-full font-medium hover:bg-[#9564b4] hover:text-white transition-all duration-300">
  SEND
</button>
```

#### After (Unified Design System):
```tsx
// Homepage button
<Button 
  variant="primary" 
  size="lg" 
  rounded="full"
  onClick={() => scrollToElement("team-section")}
>
  Meet the Team
</Button>

// Auction filter button
<Button 
  variant={filter === "active" ? "primary" : "outline"}
  leftIcon={<Gavel size={16} />}
  onClick={() => setFilter("active")}
>
  Active Auctions  
</Button>

// Contact form button
<Button 
  variant="primary" 
  size="lg" 
  type="submit"
  loading={isSubmitting}
  className="w-full"
>
  {isSubmitting ? "SENDING..." : "SEND"}
</Button>
```

### Card Components

#### Before (Inconsistent Card Styles):
```tsx
// Auction card
<Card className="group relative overflow-hidden border border-darkviolet bg-transparent/50 backdrop-blur-sm hover:border-violet hover:shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]">
  <CardBody className="p-0">
    {/* content */}
  </CardBody>
</Card>

// Team member card  
<div className="w-[200px] sm:w-[220px] transform transition-all duration-300 hover:scale-105">
  <div className="aspect-[3/4] mb-6 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
    {/* content */}
  </div>
</div>
```

#### After (Unified Design System):
```tsx
// Auction card
<Card 
  variant="elevated" 
  hover="lift"
  padding="none"
  className="cursor-pointer overflow-hidden"
>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>

// Team member card
<Card variant="default" hover="lift" className="w-[200px] sm:w-[220px]">
  <CardContent padding="sm">
    <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
      {/* content */}
    </div>
    <CardTitle className="text-center">{member.name}</CardTitle>
  </CardContent>
</Card>
```

### Form Components

#### Before (Inconsistent Input Styles):
```tsx
// Contact form inputs
<input
  className="w-full bg-transparent border-b-2 border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#9564b4] transition-all duration-300"
  placeholder="Your Name"
  // ...
/>

<textarea
  className="w-full bg-transparent border-b-2 border-gray-700 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#9564b4] transition-all duration-300 resize-none"
  placeholder="Share your thoughts"
  // ...
/>
```

#### After (Unified Design System):
```tsx
// Contact form inputs
<Input
  variant="underlined"
  placeholder="Your Name"
  value={formData.name}
  onChange={handleInputChange}
  required
/>

<Textarea
  variant="underlined" 
  placeholder="Share your thoughts"
  value={formData.message}
  onChange={handleInputChange}
  rows={4}
  required
/>
```

## 🎨 Color Migration

### Replace Hardcoded Colors

#### Before:
```tsx
className="text-[#9564b4] bg-[#121212] border-[#4D3E63]"
```

#### After:
```tsx
className="text-brand-500 bg-neutral-900 border-brand-900"
```

### Color Mapping Reference:
```typescript
// Legacy → Design System
'#A986D9' → 'brand-500'     // Primary violet
'#4D3E63' → 'brand-900'     // Dark violet  
'#AAC764' → 'accent-400'    // Green
'#121212' → 'neutral-900'   // Dark background
'#9564b4' → 'brand-500'     // Primary violet (alt)
'gray-300' → 'neutral-300'  // Light text
'gray-400' → 'neutral-400'  // Muted text
'white' → 'neutral-50'      // White text
```

## 📏 Spacing Migration

### Replace Arbitrary Values

#### Before:
```tsx
className="py-32 px-8 gap-20 mb-10"
```

#### After:
```tsx
className="py-32 px-8 gap-20 mb-10" // These are already in the spacing system!
```

### Spacing Guidelines:
- Use existing spacing values that align with 8px grid
- Replace arbitrary values: `py-[25px]` → `py-6` (24px)
- Common patterns:
  - `p-4`: Standard component padding
  - `gap-6`: Standard grid gaps
  - `mb-8`: Section margins
  - `mt-12`: Large section spacing

## 🎭 Animation Migration

### Before (Inconsistent Transitions):
```tsx
className="transition-all duration-300 hover:scale-105"
className="transition-shadow duration-300"
className="transition-colors"
```

### After (Standardized):
```tsx
className="transition-all duration-normal hover:scale-[1.02]"
className="transition-shadow duration-normal"  
className="transition-colors duration-fast"
```

## 📱 Responsive Design Migration

### Before (Inconsistent Breakpoints):
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
className="text-4xl md:text-5xl"
className="max-w-7xl mx-auto"
```

### After (Consistent System):
```tsx
// These are already good! The design system uses the same breakpoints
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
className="text-4xl md:text-5xl"
className="max-w-7xl mx-auto"
```

## 🔧 File-by-File Migration Plan

### Phase 1: Core Components (✅ Complete)
- [x] `/config/design-tokens.ts`
- [x] `/components/ui/Button.tsx`
- [x] `/components/ui/Card.tsx`
- [x] `/components/ui/Input.tsx`
- [x] `/components/ui/LoadingSpinner.tsx`
- [x] `/components/ui/ErrorMessage.tsx`

### Phase 2: Layout Components
- [ ] `/components/navbar.tsx`
- [ ] `/layouts/default.tsx`
- [ ] Navigation components

### Phase 3: Page Components  
- [ ] `/pages/index.tsx` (Homepage)
- [ ] `/pages/auctions/index.tsx`
- [ ] `/pages/auctions/[id].tsx`
- [ ] Other page files

### Phase 4: Feature Components
- [ ] Form components
- [ ] Modal/Dialog components
- [ ] Specialized UI elements

## 🧪 Testing Migration

### Visual Testing Checklist:
- [ ] Components look consistent across pages
- [ ] Hover states work properly  
- [ ] Focus states are visible
- [ ] Mobile responsive behavior
- [ ] Dark theme consistency
- [ ] Animation smoothness

### Code Quality Checklist:
- [ ] No hardcoded colors remaining
- [ ] Consistent spacing usage
- [ ] Proper TypeScript types
- [ ] Accessibility attributes present
- [ ] Performance not degraded

## 📝 Migration Script Example

Here's a script to help automate some migrations:

```typescript
// migration-helper.ts
export const colorMigrations = {
  '#A986D9': 'brand-500',
  '#4D3E63': 'brand-900', 
  '#AAC764': 'accent-400',
  '#121212': 'neutral-900',
  '#9564b4': 'brand-500',
  'text-gray-300': 'text-neutral-300',
  'text-gray-400': 'text-neutral-400',
  'border-gray-700': 'border-neutral-700',
  'bg-gray-800': 'bg-neutral-800',
};

export function migrateColors(className: string): string {
  let result = className;
  Object.entries(colorMigrations).forEach(([old, new_]) => {
    result = result.replace(old, new_);
  });
  return result;
}
```

## 🚨 Common Pitfalls

### ❌ Don't:
- Mix old and new button styles on the same page
- Use hardcoded colors alongside design tokens
- Skip TypeScript types for new components
- Override design system styles with custom CSS
- Use inconsistent spacing values

### ✅ Do:
- Migrate entire features at once for consistency
- Use the `cn()` utility for class merging
- Add proper accessibility attributes
- Test on multiple screen sizes
- Follow the component API patterns

## 🎯 Success Metrics

Migration is successful when:
- [ ] No hardcoded brand colors in components
- [ ] Consistent button styles across all pages
- [ ] Unified card components everywhere
- [ ] Form inputs follow same patterns
- [ ] Animation timings are consistent
- [ ] No visual regressions
- [ ] TypeScript errors resolved
- [ ] Accessibility maintained/improved

## 📚 Resources

- [Design System Documentation](./DESIGN_SYSTEM.md)
- [Component Examples](/components/ui/)
- [Design Tokens Reference](/config/design-tokens.ts)
- [Utility Functions](/lib/utils.ts)

---

## 🤝 Getting Help

For migration questions:
1. Check the Design System documentation
2. Look at existing migrated components for patterns
3. Test thoroughly before committing changes
4. Ask for code review focusing on consistency

Remember: The goal is visual and code consistency, not perfection. Focus on the most visible and frequently used components first.