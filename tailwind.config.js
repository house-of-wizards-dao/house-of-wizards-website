import {nextui} from '@nextui-org/theme'
import { designTokens } from './src/config/design-tokens'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontSize: designTokens.typography.fontSize,
    fontWeight: designTokens.typography.fontWeight,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    boxShadow: designTokens.boxShadow,
    screens: designTokens.screens,
    extend: {
      fontFamily: {
        sans: designTokens.typography.fontFamily.primary,
        mono: designTokens.typography.fontFamily.mono,
        heading: designTokens.typography.fontFamily.heading,
        system: designTokens.typography.fontFamily.system,
        // Legacy support
        atirose: designTokens.typography.fontFamily.heading,
        ocra: designTokens.typography.fontFamily.mono,
      },
      colors: {
        // Brand colors with semantic names
        brand: designTokens.colors.brand.violet,
        accent: designTokens.colors.brand.green,

        // Legacy support (deprecated - use brand.500 instead)
        violet: designTokens.colors.brand.violet[500],
        darkviolet: designTokens.colors.brand.violet[900],
        green: designTokens.colors.brand.green[400],

        // Semantic colors
        success: designTokens.colors.semantic.success,
        warning: designTokens.colors.semantic.warning,
        error: designTokens.colors.semantic.error,
        info: designTokens.colors.semantic.info,

        // Neutral colors for dark theme
        neutral: designTokens.colors.neutral,
      },
      backgroundImage: {
        'gradient-brand': designTokens.colors.gradients.primary,
        'gradient-accent': designTokens.colors.gradients.accent,
        'gradient-dark': designTokens.colors.gradients.dark,
        'gradient-card': designTokens.colors.gradients.card,
      },
      transitionDuration: {
        fast: designTokens.animation.duration.fast,
        normal: designTokens.animation.duration.normal,
        slow: designTokens.animation.duration.slow,
      },
      transitionTimingFunction: {
        'in-out': designTokens.animation.easing.inOut,
      },
      zIndex: designTokens.zIndex,
      // Custom utilities
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
