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
      showToast("Unable to generate preview. Please try refreshing the page.", "error");
      return;
    }

    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .set({
        margin: [15, 15, 15, 15],
        filename: `${eventName || "vocal-performance-agreement"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(previewRef.current)
      .save();
    showToast("PDF generated successfully", "success");
  } catch (error) {
    console.error("PDF generation error:", error);
    showToast(getErrorMessage(error, "pdf"), "error");
  } finally {
    setIsLoading(false);
  }
}
