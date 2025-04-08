/**
 * Design Tokens for Vibr Chat Interface
 *
 * This file defines the core design tokens used throughout the application
 * to ensure visual consistency and maintainable styling.
 */

// Color System
export const colors = {
  // Primary palette
  primary: {
    50: "hsl(var(--primary-50))",
    100: "hsl(var(--primary-100))",
    200: "hsl(var(--primary-200))",
    300: "hsl(var(--primary-300))",
    400: "hsl(var(--primary-400))",
    500: "hsl(var(--primary-500))",
    600: "hsl(var(--primary-600))",
    700: "hsl(var(--primary-700))",
    800: "hsl(var(--primary-800))",
    900: "hsl(var(--primary-900))",
    950: "hsl(var(--primary-950))",
  },

  // Neutral palette
  neutral: {
    50: "hsl(var(--neutral-50))",
    100: "hsl(var(--neutral-100))",
    200: "hsl(var(--neutral-200))",
    300: "hsl(var(--neutral-300))",
    400: "hsl(var(--neutral-400))",
    500: "hsl(var(--neutral-500))",
    600: "hsl(var(--neutral-600))",
    700: "hsl(var(--neutral-700))",
    800: "hsl(var(--neutral-800))",
    900: "hsl(var(--neutral-900))",
    950: "hsl(var(--neutral-950))",
  },

  // Semantic colors
  success: {
    50: "hsl(var(--success-50))",
    100: "hsl(var(--success-100))",
    500: "hsl(var(--success-500))",
    600: "hsl(var(--success-600))",
    700: "hsl(var(--success-700))",
  },

  warning: {
    50: "hsl(var(--warning-50))",
    100: "hsl(var(--warning-100))",
    500: "hsl(var(--warning-500))",
    600: "hsl(var(--warning-600))",
    700: "hsl(var(--warning-700))",
  },

  error: {
    50: "hsl(var(--error-50))",
    100: "hsl(var(--error-100))",
    500: "hsl(var(--error-500))",
    600: "hsl(var(--error-600))",
    700: "hsl(var(--error-700))",
  },

  info: {
    50: "hsl(var(--info-50))",
    100: "hsl(var(--info-100))",
    500: "hsl(var(--info-500))",
    600: "hsl(var(--info-600))",
    700: "hsl(var(--info-700))",
  },
}

// Typography
export const typography = {
  // Font families
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },

  // Font sizes
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line heights
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },

  // Letter spacing
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
}

// Spacing
export const spacing = {
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
}

// Border radius
export const borderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
}

// Shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
}

// Transitions
export const transitions = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
  },
  timing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

// Z-index
export const zIndex = {
  0: "0",
  10: "10",
  20: "20",
  30: "30",
  40: "40",
  50: "50",
  auto: "auto",
  dropdown: "1000",
  sticky: "1100",
  fixed: "1200",
  modalBackdrop: "1300",
  modal: "1400",
  popover: "1500",
  tooltip: "1600",
}
