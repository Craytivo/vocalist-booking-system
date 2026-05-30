// Global Typography System for the entire site
// Modern, responsive typography for UI, forms, and login pages
// Font pair: Inter (geometric sans-serif for all text)
// Optimized for readability, accessibility, and modern minimalist aesthetics

export const GLOBAL_TYPOGRAPHY = {
  // Font families - Geometric, modern, minimalist
  heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "JetBrains Mono, 'Fira Code', 'Courier New', monospace",

  // Font sizes (rem-based for scalability)
  sizes: {
    // Display sizes
    displayXl: "3.5rem",      // 56px - hero headings
    displayLg: "3rem",        // 48px - page titles
    displayMd: "2.5rem",     // 40px - section titles
    displaySm: "2rem",       // 32px - card titles

    // Heading sizes
    headingXl: "1.875rem",    // 30px - h1
    headingLg: "1.5rem",     // 24px - h2
    headingMd: "1.25rem",    // 20px - h3
    headingSm: "1.125rem",   // 18px - h4
    headingXs: "1rem",       // 16px - h5

    // Body sizes
    bodyLg: "1.125rem",      // 18px - large body
    bodyMd: "1rem",          // 16px - standard body
    bodySm: "0.875rem",     // 14px - small body
    bodyXs: "0.8125rem",    // 13px - extra small

    // UI sizes
    uiLg: "1rem",            // 16px - buttons, inputs
    uiMd: "0.875rem",        // 14px - labels
    uiSm: "0.8125rem",       // 13px - helper text
    uiXs: "0.75rem",         // 12px - captions

    // Code sizes
    codeLg: "0.9375rem",     // 15px
    codeMd: "0.875rem",      // 14px
    codeSm: "0.8125rem",     // 13px
  },

  // Line heights (optimized for readability)
  lineHeights: {
    tight: "1.1",            // Large headings
    normal: "1.5",           // Body text
    relaxed: "1.6",          // Long-form content
    loose: "1.75",           // Very spaced text
  },

  // Letter spacing (tracking)
  letterSpacing: {
    tight: "-0.02em",        // Large headings
    normal: "0",             // Body text
    wide: "0.01em",          // Small text
    wider: "0.05em",         // Uppercase text
    widest: "0.1em",        // Very small uppercase
  },

  // Font weights
  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// Responsive font size classes for Tailwind
export const FONT_SIZE_CLASSES = {
  // Display sizes
  displayXl: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
  displayLg: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  displayMd: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  displaySm: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",

  // Heading sizes
  headingXl: "text-2xl sm:text-3xl md:text-[30px] lg:text-4xl",
  headingLg: "text-xl sm:text-2xl md:text-3xl lg:text-[24px]",
  headingMd: "text-lg sm:text-xl md:text-2xl lg:text-[20px]",
  headingSm: "text-base sm:text-lg md:text-xl lg:text-[18px]",
  headingXs: "text-sm sm:text-base md:text-lg lg:text-base",

  // Body sizes
  bodyLg: "text-base sm:text-lg md:text-xl lg:text-[18px]",
  bodyMd: "text-sm sm:text-base md:text-lg lg:text-base",
  bodySm: "text-xs sm:text-sm md:text-base lg:text-sm",
  bodyXs: "text-xs sm:text-sm md:text-sm lg:text-[13px]",

  // UI sizes
  uiLg: "text-sm sm:text-base md:text-lg lg:text-base",
  uiMd: "text-xs sm:text-sm md:text-base lg:text-sm",
  uiSm: "text-xs sm:text-sm md:text-sm lg:text-[13px]",
  uiXs: "text-[10px] sm:text-xs md:text-sm lg:text-xs",

  // Code sizes
  codeLg: "text-sm sm:text-base md:text-lg lg:text-[15px]",
  codeMd: "text-xs sm:text-sm md:text-base lg:text-sm",
  codeSm: "text-xs sm:text-sm md:text-sm lg:text-[13px]",
} as const;

// Button size classes (following best practices)
export const BUTTON_SIZE_CLASSES = {
  // Primary buttons
  primary: {
    xs: "px-3 py-1.5 text-xs h-8 min-h-[32px]",
    sm: "px-4 py-2 text-sm h-9 min-h-[36px]",
    md: "px-5 py-2.5 text-base h-10 min-h-[40px]",
    lg: "px-6 py-3 text-lg h-12 min-h-[48px]",
  },
  // Secondary buttons
  secondary: {
    xs: "px-3 py-1.5 text-xs h-8 min-h-[32px]",
    sm: "px-4 py-2 text-sm h-9 min-h-[36px]",
    md: "px-5 py-2.5 text-base h-10 min-h-[40px]",
    lg: "px-6 py-3 text-lg h-12 min-h-[48px]",
  },
  // Ghost/text buttons
  ghost: {
    xs: "px-3 py-1.5 text-xs h-8 min-h-[32px]",
    sm: "px-4 py-2 text-sm h-9 min-h-[36px]",
    md: "px-5 py-2.5 text-base h-10 min-h-[40px]",
    lg: "px-6 py-3 text-lg h-12 min-h-[48px]",
  },
} as const;

// Line height classes
export const LINE_HEIGHT_CLASSES = {
  tight: "leading-tight",
  normal: "leading-normal",
  relaxed: "leading-relaxed",
  loose: "leading-loose",
} as const;

// Font family classes
export const FONT_FAMILY_CLASSES = {
  heading: "font-heading",
  body: "font-body",
  mono: "font-mono",
} as const;

// Font weight classes
export const FONT_WEIGHT_CLASSES = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

// Text color classes for semantic meaning
export const TEXT_COLOR_CLASSES = {
  primary: "text-neutral-900",
  secondary: "text-neutral-600",
  tertiary: "text-neutral-500",
  muted: "text-neutral-400",
  inverse: "text-white",
  accent: "text-indigo-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  error: "text-red-600",
} as const;

// Spacing classes for consistent rhythm
export const SPACING_CLASSES = {
  xs: "space-y-2",
  sm: "space-y-3",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
} as const;
