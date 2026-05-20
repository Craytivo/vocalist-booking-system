// Print-specific styles and utilities for contract PDF generation

/**
 * Print CSS classes that should be applied to the contract document
 * These can be added to a style tag or used with Tailwind's @layer utilities
 */
export const PRINT_STYLES = `
  @media print {
    /* Reset print margins */
    @page {
      size: A4;
      margin: 0.75in;
    }

    /* Ensure text doesn't overflow */
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Prevent page breaks inside critical sections */
    .break-inside-avoid {
      break-inside: avoid;
    }

    .break-after-avoid {
      break-after: avoid;
    }

    /* Force page breaks before signatures */
    .break-before-page {
      break-before: page;
    }

    /* Hide UI elements in print */
    .no-print {
      display: none !important;
    }

    /* Ensure footer stays at bottom of each page */
    .print-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 0.5in;
      border-top: 1px solid #e5e5e5;
    }

    /* Optimize text for print */
    * {
      color: #000 !important;
      text-shadow: none !important;
    }

    /* Remove shadows in print */
    * {
      box-shadow: none !important;
    }

    /* Ensure borders print correctly */
    * {
      border-color: #000 !important;
    }
  }
`;

/**
 * Page break utilities for React components
 */
export const PageBreakBefore = () => (
  <div className="hidden print:block break-before-page" />
);

export const PageBreakAfter = () => (
  <div className="hidden print:block break-after-page" />
);

export const NoPrint = ({ children }: { children: React.ReactNode }) => (
  <div className="print:hidden">{children}</div>
);

export const PrintOnly = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden print:block">{children}</div>
);

/**
 * Helper to determine if a section should break after
 * based on content length and position
 */
export function shouldBreakAfterSection(
  sectionContentLength: number,
  currentPageContent: number,
  maxContentPerPage: number = 2000
): boolean {
  const remainingSpace = maxContentPerPage - currentPageContent;
  
  // If remaining space is less than 30% of max, break before this section
  if (remainingSpace < maxContentPerPage * 0.3) {
    return true;
  }
  
  // If section content is very long, break before it
  if (sectionContentLength > maxContentPerPage * 0.5) {
    return true;
  }
  
  return false;
}

/**
 * Calculate estimated page count for PDF generation
 */
export function calculatePageCount(
  totalContentLength: number,
  charsPerPage: number = 2000
): number {
  return Math.ceil(totalContentLength / charsPerPage);
}

/**
 * Get print-specific CSS classes for contract elements
 */
export const PRINT_CLASSES = {
  container: "print:shadow-none print:border-none print:box-border print:min-h-[1123px] print:px-14 print:py-20 print:text-sm",
  section: "print:pb-8 break-after-avoid",
  footer: "print:fixed print:bottom-0 print:left-0 print:right-0 print:border-t print:border-neutral-300 print:bg-white print:px-14 print:py-4",
  watermark: "print:hidden",
} as const;
