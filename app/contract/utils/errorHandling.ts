export function getErrorMessage(error: any, context: string): string {
  const errorLower = String(error?.message || error || "").toLowerCase();

  if (errorLower.includes("network") || errorLower.includes("fetch") || errorLower.includes("connection")) {
    return "Please check your connection and try again.";
  }

  if (context.includes("auth") || context.includes("sign")) {
    if (errorLower.includes("invalid") || errorLower.includes("credentials")) return "Please check your sign-in details and try again.";
    if (errorLower.includes("email")) return "Please enter a valid email address.";
    return "Unable to access the workspace. Please try again.";
  }

  if (context.includes("save") || context.includes("load") || context.includes("workspace")) {
    if (errorLower.includes("duplicate") || errorLower.includes("unique")) return "This record already exists.";
    if (errorLower.includes("not found")) return "The requested record was not found.";
    if (context.includes("save")) return "Unable to save your changes on this device. Please try again.";
    if (context.includes("load")) return "Unable to load your saved contracts. Please refresh the page.";
    return "Unable to update your workspace. Please try again.";
  }

  if (context.includes("pdf") || context.includes("generate")) return "Unable to generate the PDF. Please try again.";
  if (context.includes("copy") || context.includes("clipboard")) return "Unable to copy to clipboard. Please try again.";
  if (context.includes("calendar")) return "Unable to generate the calendar event. Please check the date format.";

  return "An unexpected error occurred. Please try again.";
}
