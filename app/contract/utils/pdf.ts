// Client-side PDF export for the contract document.
let html2pdfLib: any = null;

function getPageSize(pdf: any) {
  const pageSize = pdf.internal?.pageSize;
  const width = typeof pageSize?.getWidth === "function" ? pageSize.getWidth() : pageSize?.width;
  const height = typeof pageSize?.getHeight === "function" ? pageSize.getHeight() : pageSize?.height;
  return { width, height };
}

export function addPdfPageNumbers(pdf: any) {
  const totalPages = typeof pdf.internal?.getNumberOfPages === "function"
    ? pdf.internal.getNumberOfPages()
    : pdf.getNumberOfPages?.();
  if (!totalPages) return;
  const { width, height } = getPageSize(pdf);
  if (!width || !height) return;

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
    pdf.setPage(pageNumber);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(110);
    pdf.text(`Page ${pageNumber} of ${totalPages}`, width - 18, height - 9, { align: "right" });
    pdf.setDrawColor(210);
    pdf.setLineWidth(0.2);
    pdf.line(18, height - 13, width - 18, height - 13);
  }
}

async function getHtml2pdfLib() {
  if (html2pdfLib) return html2pdfLib;
  const module = await import("html2pdf.js");
  html2pdfLib = module.default;
  return html2pdfLib;
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
    const source = previewRef.current?.querySelector("article[role=\"document\"]") || previewRef.current?.querySelector("article");
    if (!source) {
      showToast("Unable to locate the contract document.", "error");
      return;
    }

    showToast("Preparing professional PDF...", "info");
    const Html2pdf = await getHtml2pdfLib();
    const cloned = source.cloneNode(true) as HTMLElement;

    cloned.querySelectorAll("button, input, textarea, select, .no-print, [class~='print:hidden'], .zoom-controls").forEach((el) => el.remove());
    cloned.style.cssText = "background:#fff;color:#111827;box-shadow:none;border:0;margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;font-size:10.5pt;line-height:1.55;";

    cloned.querySelectorAll("*").forEach((el: any) => {
      const classes = typeof el.className === "string" ? el.className.split(/\s+/) : [];
      el.className = classes.filter((c: string) =>
        !c.startsWith("shadow-") &&
        !c.startsWith("backdrop-") &&
        !c.startsWith("hover:") &&
        !c.startsWith("focus:") &&
        !c.startsWith("dark:") &&
        c !== "hidden"
      ).join(" ");
      if (el.tagName === "H1") el.style.cssText += "font-family:Arial,Helvetica,sans-serif;font-size:18pt;font-weight:700;color:#111827;margin-bottom:5pt;";
      if (el.tagName === "H2") el.style.cssText += "font-family:Arial,Helvetica,sans-serif;font-size:12pt;font-weight:700;color:#111827;break-after:avoid;";
      if (el.tagName === "H3") el.style.cssText += "font-family:Arial,Helvetica,sans-serif;font-size:10pt;font-weight:700;color:#374151;break-after:avoid;";
    });

    const safeName = (eventName || "vocal-performance-agreement")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "vocal-performance-agreement";
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${safeName}-${date}.pdf`;

    const options = {
      margin: [18, 18, 22, 18],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "letter",
        orientation: "portrait",
        compress: true,
      },
      pagebreak: {
        mode: ["css", "legacy"],
        before: [".break-before-page", ".signatures", ".signature-section"],
        avoid: ["section", ".break-inside-avoid", ".signature-section", ".signatures"],
      },
    };

    const worker = Html2pdf().set(options).from(cloned).toPdf();
    await worker.get("pdf").then((pdf: any) => addPdfPageNumbers(pdf));
    await worker.save();
    showToast(`PDF ready: ${filename}`, "success");
  } catch (error) {
    console.error("PDF export error:", error);
    const message = error instanceof Error ? error.message : String(error);
    showToast(`PDF generation failed: ${message}`, "error");
  } finally {
    setIsLoading(false);
  }
}