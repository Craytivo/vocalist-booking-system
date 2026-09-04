// Compatibility declaration for the legacy type-only User import in the contract page.
// Runtime authentication and data storage are handled by the local storage adapter.
declare module "@supabase/supabase-js" {
  export interface User {
    id: string;
    email?: string;
    email_confirmed_at?: string;
  }
}
