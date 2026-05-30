// Print-specific styles and utilities for contract PDF generation

/**
 * Print CSS classes that should be applied to the contract document
 * These can be added to a style tag or used with Tailwind's @layer utilities
 */
export const PRINT_STYLES = `
  @media print {
    /* Reset print margins and page size */
    @page {
      size: A4;
      margin: 15mm;
    }

    /* Hide everything by default */
    body * {
      visibility: hidden;
    }

    /* Show only the contract container and its contents */
    .print-contract, .print-contract * {
      visibility: visible;
    }

    /* Position the contract properly */
    .print-contract {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    /* Hide UI elements in print */
    .no-print {
      display: none !important;
    }

    /* Ensure text doesn't overflow - contract-appropriate font sizing */
    .print-contract {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color: #000 !important;
      text-shadow: none !important;
      box-shadow: none !important;
      border: none !important;
      font-size: 11pt !important;
      line-height: 1.4 !important;
      orphans: 2;
      widows: 2;
    }

    /* Contract headings */
    .print-contract h1 {
      font-size: 16pt !important;
      font-weight: bold !important;
      break-after: avoid;
      break-inside: avoid;
    }

    .print-contract h2, .print-contract h3 {
      font-size: 12pt !important;
      font-weight: bold !important;
      break-after: avoid;
      break-inside: avoid;
    }

    /* Prevent page breaks inside critical sections */
    .break-inside-avoid {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .break-after-avoid {
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    .break-before-avoid {
      break-before: avoid !important;
      page-break-before: avoid !important;
    }

    /* Force page break before signatures */
    .break-before-page {
      break-before: page !important;
      page-break-before: always !important;
    }

    /* Add space between sections */
    .print-contract > div > div {
      margin-bottom: 24pt !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Prevent paragraphs from being split at the end of pages */
    .print-contract p {
      orphans: 3 !important;
      widows: 3 !important;
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Prevent lists from being split */
    .print-contract ul, .print-contract ol {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    /* Remove all margins/padding for body during print */
    body, html {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }

    /* Adobe Reader compatibility */
    @supports (-ms-ime-align: auto) {
      .print-contract {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
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
  container: "print:shadow-none print:border-none print:box-border print:px-14 print:py-20 print:text-sm",
  section: "print:pb-8 break-after-avoid print:break-inside-avoid",
  footer: "print:fixed print:bottom-0 print:left-0 print:right-0 print:border-t print:border-neutral-300 print:bg-white print:px-14 print:py-4",
  watermark: "print:hidden",
} as const;
