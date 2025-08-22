/**
 * Design Tokens for House of Wizards DAO
 * Centralized design system for consistent styling across all components
 */

export const designTokens = {
  // Brand Colors
  colors: {
    brand: {
      primary: "#A986D9", // Main violet
      primaryDark: "#4D3E63", // Dark violet
      accent: "#AAC764", // Green accent

      // Extended brand palette
      violet: {
        50: "#faf7ff",
        100: "#f4edff",
        200: "#ead9ff",
        300: "#d9b8ff",
        400: "#c287ff",
        500: "#A986D9", // Primary
        600: "#9466cc",
        700: "#7c4fb8",
        800: "#674299",
        900: "#4D3E63", // Primary dark
      },

      green: {
        50: "#f6f9f0",
        100: "#eaf2dc",
        200: "#d6e6bd",
        300: "#bdd494",
        400: "#AAC764", // Primary
        500: "#92b347",
        600: "#739036",
        700: "#59712d",
        800: "#485a28",
        900: "#3d4d25",
      },
    },

    // Semantic Colors
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },

    // Neutral Colors (Dark Theme First)
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",

      // Dark theme specific
      black: "#000000",
      darkGray: "#121212",
      mediumGray: "#1a1a1a",
      lightGray: "#2a2a2a",
    },

    // Background Gradients
    gradients: {
      primary: "linear-gradient(135deg, #A986D9 0%, #4D3E63 100%)",
      accent: "linear-gradient(135deg, #AAC764 0%, #92b347 100%)",
      dark: "linear-gradient(135deg, #121212 0%, #1a1a1a 100%)",
      card: "linear-gradient(135deg, rgba(169, 134, 217, 0.1) 0%, rgba(77, 62, 99, 0.1) 100%)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: ["Mona Sans", "system-ui", "sans-serif"],
      heading: ["Atirose", "serif"],
      mono: ["OCRAStd", "Fira Code", "monospace"],
      system: ["system-ui", "sans-serif"],
    },

    fontSize: {
      xs: ["10px", { lineHeight: "14px" }],
      sm: ["12px", { lineHeight: "16px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["18px", { lineHeight: "28px" }],
      xl: ["20px", { lineHeight: "32px" }],
      "2xl": ["24px", { lineHeight: "32px" }],
      "3xl": ["30px", { lineHeight: "36px" }],
      "4xl": ["36px", { lineHeight: "40px" }],
      "5xl": ["48px", { lineHeight: "48px" }],
      "6xl": ["60px", { lineHeight: "60px" }],
      "7xl": ["72px", { lineHeight: "72px" }],
      "8xl": ["96px", { lineHeight: "96px" }],
    },

    fontWeight: {
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
    },
  },

  // Spacing System (8px base)
  spacing: {
    px: "1px",
    0: "0px",
    0.5: "2px",
    1: "4px",
    1.5: "6px",
    2: "8px",
    2.5: "10px",
    3: "12px",
    3.5: "14px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
    11: "44px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
    28: "112px",
    32: "128px",
    36: "144px",
    40: "160px",
    44: "176px",
    48: "192px",
    52: "208px",
    56: "224px",
    60: "240px",
    64: "256px",
    72: "288px",
    80: "320px",
    96: "384px",
  },

  // Border Radius
  borderRadius: {
    none: "0px",
    sm: "2px",
    DEFAULT: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    "3xl": "24px",
    full: "9999px",
  },

  // Shadows
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "0 0 #0000",

    // Brand specific shadows
    brand: "0 20px 40px -12px rgba(169, 134, 217, 0.25)",
    brandHover: "0 25px 50px -12px rgba(169, 134, 217, 0.4)",
  },

  // Animation & Transitions
  animation: {
    duration: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      in: "cubic-bezier(0.4, 0, 1, 1)",
      out: "cubic-bezier(0, 0, 0.2, 1)",
      inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Breakpoints
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Type helpers
export type ColorScale = keyof typeof designTokens.colors.brand.violet;
export type SpacingValue = keyof typeof designTokens.spacing;
export type FontSize = keyof typeof designTokens.typography.fontSize;
export type FontWeight = keyof typeof designTokens.typography.fontWeight;
