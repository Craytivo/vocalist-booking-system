// Professional print styles for contract documents.
export const PRINT_STYLES = `
  @media print {
    @page {
      size: Letter;
      margin: 18mm 18mm 20mm;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: #111827 !important;
    }

    body * { visibility: hidden; }
    .print-contract, .print-contract * { visibility: visible; }

    .print-contract {
      position: absolute;
      inset: 0;
      width: auto !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      color: #111827 !important;
      box-shadow: none !important;
      border: 0 !important;
      font-family: Georgia, "Times New Roman", serif !important;
      font-size: 10.5pt !important;
      line-height: 1.55 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      orphans: 3;
      widows: 3;
    }

    .print-contract h1 {
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 18pt !important;
      line-height: 1.15 !important;
      letter-spacing: .01em !important;
      margin: 0 0 4pt !important;
      color: #111827 !important;
      break-after: avoid;
    }

    .print-contract h2 {
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 12pt !important;
      line-height: 1.25 !important;
      color: #111827 !important;
      margin-top: 16pt !important;
      margin-bottom: 6pt !important;
      break-after: avoid;
      break-inside: avoid;
    }

    .print-contract h3 {
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 10pt !important;
      line-height: 1.3 !important;
      color: #374151 !important;
      margin-top: 12pt !important;
      margin-bottom: 4pt !important;
      break-after: avoid;
    }

    .print-contract p,
    .print-contract li {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .print-contract p { margin-top: 0 !important; margin-bottom: 7pt !important; }

    .break-inside-avoid,
    .print-contract section,
    .print-contract table,
    .print-contract blockquote {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .break-before-page {
      break-before: page !important;
      page-break-before: always !important;
    }

    .break-after-page {
      break-after: page !important;
      page-break-after: always !important;
    }

    .no-print,
    .print-hidden,
    button,
    input,
    textarea,
    select,
    .zoom-controls {
      display: none !important;
    }

    .print-contract .signature-section,
    .print-contract .signatures {
      break-before: page !important;
      page-break-before: always !important;
    }

    .print-contract a { color: #111827 !important; text-decoration: none !important; }
    .print-contract img { max-width: 100% !important; break-inside: avoid; }
  }
`;

export const PageBreakBefore = () => (
  <div className="hidden print:block break-before-page" aria-hidden="true" />
);

export const PageBreakAfter = () => (
  <div className="hidden print:block break-after-page" aria-hidden="true" />
);

export const NoPrint = ({ children }: { children: React.ReactNode }) => (
  <div className="print:hidden">{children}</div>
);

export const PrintOnly = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden print:block">{children}</div>
);

export function shouldBreakAfterSection(
  sectionContentLength: number,
  currentPageContent: number,
  maxContentPerPage: number = 2000
): boolean {
  const remainingSpace = maxContentPerPage - currentPageContent;
  return remainingSpace < maxContentPerPage * 0.3 || sectionContentLength > maxContentPerPage * 0.5;
}

export function calculatePageCount(totalContentLength: number, charsPerPage: number = 2000): number {
  return Math.ceil(totalContentLength / charsPerPage);
}

export const PRINT_CLASSES = {
  container: "print:shadow-none print:border-none print:box-border print:px-0 print:py-0 print:text-sm",
  section: "print:pb-5 break-after-avoid print:break-inside-avoid",
  footer: "print:border-t print:border-neutral-300 print:bg-white print:px-0 print:py-3",
  watermark: "print:hidden",
} as const;
