export function getErrorMessage(error: any, context: string): string {
  const errorLower = String(error?.message || error || "").toLowerCase();
  
  // Network errors
  if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('connection')) {
    return "Please check your internet connection and try again.";
  }
  
  // Authentication errors
  if (context.includes('auth') || context.includes('sign')) {
    if (errorLower.includes('invalid') || errorLower.includes('credentials')) {
      return "Please check your email and password and try again.";
    }
    if (errorLower.includes('email')) {
      return "Please enter a valid email address.";
    }
    if (errorLower.includes('already')) {
      return "An account with this email already exists.";
    }
    return "Unable to sign in. Please try again.";
  }
  
  // Supabase/Database errors
  if (context.includes('supabase') || context.includes('save') || context.includes('load')) {
    if (errorLower.includes('permission') || errorLower.includes('unauthorized')) {
      return "You don't have permission to perform this action.";
    }
    if (errorLower.includes('duplicate') || errorLower.includes('unique')) {
      return "This record already exists.";
    }
    if (errorLower.includes('not found')) {
      return "The requested record was not found.";
    }
    if (context.includes('save')) {
      return "Unable to save your changes. Please try again.";
    }
    if (context.includes('load')) {
      return "Unable to load your data. Please refresh the page.";
    }
    return "A database error occurred. Please try again.";
  }
  
  // PDF generation errors
  if (context.includes('pdf') || context.includes('generate')) {
    return "Unable to generate PDF. Please try again or contact support.";
  }
  
  // Clipboard errors
  if (context.includes('copy') || context.includes('clipboard')) {
    return "Unable to copy to clipboard. Please try again.";
  }
  
  // Calendar errors
  if (context.includes('calendar')) {
    return "Unable to generate calendar event. Please check the date format.";
  }
  
  // Default
  return "An unexpected error occurred. Please try again.";
}
