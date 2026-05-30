// Dynamically import html2pdf to avoid SSR issues
let html2pdfLib: any = null;

function getPageSize(pdf: any) {
  const pageSize = pdf.internal?.pageSize;
  const width = typeof pageSize?.getWidth === "function" ? pageSize.getWidth() : pageSize?.width;
  const height = typeof pageSize?.getHeight === "function" ? pageSize.getHeight() : pageSize?.height;

  return { width, height };
}

export function addPdfPageNumbers(pdf: any) {
  const totalPages =
    typeof pdf.internal?.getNumberOfPages === "function"
      ? pdf.internal.getNumberOfPages()
      : pdf.getNumberOfPages?.();

  if (!totalPages) {
    return;
  }

  const { width, height } = getPageSize(pdf);

  if (!width || !height) {
    return;
  }

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    pdf.setPage(pageNumber);
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(`Page ${pageNumber} of ${totalPages}`, width - 12, height - 7, {
      align: "right",
    });
  }
}

async function getHtml2pdfLib() {
  if (html2pdfLib) {
    return html2pdfLib;
  }
  
  try {
    const module = await import('html2pdf.js');
    html2pdfLib = module.default;
    console.log('html2pdf library imported successfully');
    return html2pdfLib;
  } catch (err) {
    console.error('Failed to import html2pdf:', err);
    throw new Error('Failed to load html2pdf library');
  }
}

export async function downloadPdf(
  previewRef: React.RefObject<HTMLDivElement>,
  eventName: string,
  showToast: (message: string, type: "success" | "error" | "info") => void,
  getErrorMessage: (error: any, context: string) => string,
  setIsLoading: (loading: boolean) => void
) {
  try {
    setIsLoading(true);
    
    if (!previewRef.current) {
      showToast("Unable to locate preview container. Please try refreshing.", "error");
      return;
    }

    // Find the contract article element
    let contractElement = previewRef.current.querySelector('article[role="document"]');
    
    if (!contractElement) {
      contractElement = previewRef.current.querySelector('article');
    }
    
    if (!contractElement) {
      console.error("Contract element not found");
      showToast("Unable to locate contract. Please ensure preview is loaded.", "error");
      return;
    }

    // Show loading message
    showToast("Preparing PDF...", "info");

    console.log("Getting html2pdf library...");
    // Get html2pdf library
    let Html2pdf;
    try {
      Html2pdf = await getHtml2pdfLib();
    } catch (err) {
      console.error("html2pdf library failed to load:", err);
      showToast("PDF library is not available. Please try again.", "error");
      return;
    }

    console.log("Starting PDF generation...");

    // Clone and clean the element
    const clonedElement = contractElement.cloneNode(true) as HTMLElement;

    // Remove hidden UI elements
    const hiddenSelectors = [
      '[class*="print:hidden"]',
      '[class*="no-print"]',
      'button',
      '.zoom-controls'
    ];

    hiddenSelectors.forEach(selector => {
      try {
        clonedElement.querySelectorAll(selector).forEach((el) => {
          el.remove();
        });
      } catch (e) {
        // Continue if selector fails
      }
    });

    // Clean Tailwind styling classes that may interfere
    let classList: string[] = clonedElement.className.split(/\s+/);
    classList = classList.filter((c: string) => {
      return !(
        c.startsWith('shadow-') ||
        c.startsWith('backdrop-') ||
        c.includes('dark:') ||
        c.startsWith('hover:') ||
        c.startsWith('focus:')
      );
    });
    clonedElement.className = classList.join(' ');

    // Apply export styles
    Object.assign(clonedElement.style, {
      boxShadow: 'none !important',
      border: 'none !important',
      backgroundColor: '#ffffff !important'
    });

    // Recursively clean child elements
    clonedElement.querySelectorAll('*').forEach((el: any) => {
      const classStr = typeof el.className === "string" ? el.className : '';
      let classes: string[] = classStr.split(/\s+/);
      classes = classes.filter((c: string) => {
        return !(
          c.startsWith('shadow-') ||
          c.startsWith('backdrop-') ||
          c.includes('dark:') ||
          c.startsWith('hover:') ||
          c.startsWith('focus:') ||
          c.includes('border-gray-') ||
          c.includes('bg-white/') ||
          c === 'print:hidden' ||
          c === 'hidden'
        );
      });
      el.className = classes.join(' ');
    });

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = eventName && eventName.trim()
      ? `${eventName.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50)}-${timestamp}.pdf`
      : `vocal-performance-agreement-${timestamp}.pdf`;

    console.log("Generating PDF:", filename);

    // PDF options
    const options = {
      margin: [12, 12, 12, 12],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        letterRendering: true,
        foreignObjectRendering: false
      },
      jsPDF: { 
        format: 'a4',
        orientation: 'portrait',
        compress: true,
        unit: 'mm'
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'],
        prevent: ['.no-break']
      }
    };

    // Execute PDF generation and wait for completion
    try {
      const pdfWorker = Html2pdf()
        .set(options)
        .from(clonedElement)
        .toPdf();

      await pdfWorker.get("pdf").then((pdf: any) => {
        addPdfPageNumbers(pdf);
      });

      await pdfWorker.save();
      
      console.log("PDF generated successfully");
      showToast(`PDF downloaded: ${filename}`, "success");
    } catch (err: any) {
      console.error("PDF save error:", err);
      showToast(`PDF generation failed: ${err?.message || 'Unknown error'}`, "error");
    }

  } catch (error) {
    console.error("PDF download error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    showToast(`Error: ${msg}`, "error");
  } finally {
    setIsLoading(false);
  }
}
