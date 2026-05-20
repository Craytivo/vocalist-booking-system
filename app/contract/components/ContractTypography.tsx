// Typography system for professional legal contract documents
// Font pair: Merriweather (serif) for body text + Inter (sans-serif) for headings
// Optimized for both screen readability and print quality

export const TYPOGRAPHY_SYSTEM = {
  // Font families
  heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "Merriweather, Georgia, 'Times New Roman', Times, serif",
  mono: "JetBrains Mono, 'Fira Code', 'Courier New', monospace",

  // Font sizes (rem-based for scalability)
  sizes: {
    // Display sizes
    displayXl: "2.5rem",      // 40px - main contract title
    displayLg: "2rem",        // 32px - section headers on large screens
    displayMd: "1.75rem",     // 28px - section headers on medium screens
    displaySm: "1.5rem",     // 24px - section headers on small screens

    // Heading sizes
    headingXl: "1.5rem",      // 24px
    headingLg: "1.25rem",     // 20px
    headingMd: "1.125rem",    // 18px
    headingSm: "1rem",        // 16px
    headingXs: "0.875rem",    // 14px

    // Body sizes
    bodyLg: "1rem",           // 16px - main body text
    bodyMd: "0.9375rem",      // 15px - slightly smaller body
    bodySm: "0.875rem",       // 14px - compact body
    bodyXs: "0.8125rem",      // 13px - very compact

    // Caption sizes
    caption: "0.75rem",       // 12px - labels, metadata
    captionSm: "0.6875rem",   // 11px - small metadata
    captionXs: "0.625rem",    // 10px - tiny labels
  },

  // Line heights (optimized for readability)
  lineHeights: {
    tight: "1.2",             // Headings
    normal: "1.5",            // Body text (optimal for reading)
    relaxed: "1.7",           // Long-form content
    loose: "2",               // Spaced out text
  },

  // Letter spacing (tracking)
  letterSpacing: {
    tight: "-0.01em",         // Large headings
    normal: "0",              // Body text
    wide: "0.02em",           // Small text
    wider: "0.05em",          // Uppercase text
    widest: "0.1em",         // Very small uppercase
  },

  // Font weights
  weights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
} as const;

// Responsive font size classes for Tailwind
export const FONT_SIZE_CLASSES = {
  // Contract title (main heading)
  contractTitle: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
  
  // Section headers
  sectionHeader: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
  
  // Subsection headers
  subsectionHeader: "text-base sm:text-lg md:text-xl",
  
  // Body text
  bodyText: "text-sm sm:text-base md:text-lg",
  
  // Compact body (for dense sections)
  bodyCompact: "text-xs sm:text-sm md:text-base",
  
  // Labels and metadata
  label: "text-xs sm:text-sm",
  
  // Small labels
  labelSmall: "text-[10px] sm:text-xs md:text-sm",
  
  // Captions and fine print
  caption: "text-[10px] sm:text-[11px] md:text-xs",
  captionSm: "text-[9px] sm:text-[10px] md:text-xs",
  captionXs: "text-[8px] sm:text-[9px] md:text-[10px]",
} as const;

// Line height classes
export const LINE_HEIGHT_CLASSES = {
  heading: "leading-tight",
  body: "leading-relaxed",
  relaxed: "leading-loose",
} as const;

// Font family classes
export const FONT_FAMILY_CLASSES = {
  heading: "font-sans",
  body: "font-serif",
  mono: "font-mono",
} as const;

// Print-specific typography
export const PRINT_TYPOGRAPHY = `
  @media print {
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:300,400,700&family=Inter:400,500,600,700&display=swap');
    
    body {
      font-family: ${TYPOGRAPHY_SYSTEM.body};
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${TYPOGRAPHY_SYSTEM.heading};
      line-height: 1.2;
      color: #000;
    }
    
    .font-display {
      font-family: ${TYPOGRAPHY_SYSTEM.heading};
    }
    
    .font-serif {
      font-family: ${TYPOGRAPHY_SYSTEM.body};
    }
  }
`;

// Screen typography
export const SCREEN_TYPOGRAPHY = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@400;500;600;700&display=swap');
  
  :root {
    --font-heading: ${TYPOGRAPHY_SYSTEM.heading};
    --font-body: ${TYPOGRAPHY_SYSTEM.body};
  }
  
  body {
    font-family: var(--font-body);
  }
  
  .font-display {
    font-family: var(--font-heading);
  }
  
  .font-serif {
    font-family: var(--font-body);
  }
`;
