declare module "@supabase/supabase-js" {
  export interface User {
    id: string;
    email?: string | null;
    email_confirmed_at?: string | null;
  }
}
