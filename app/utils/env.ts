/**
 * Environment variables validation utilities
 */

export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

export function validateEnv(): EnvConfig {
  const errors: string[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is required");
  }

  if (!supabaseAnonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  }

  if (errors.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${errors.join("\n")}\n\nPlease add them to your .env.local file.`
    );
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey!,
  };
}
