/**
 * Environment configuration helpers.
 * The application is intentionally backend-free and requires no secrets.
 */

export interface EnvConfig {
  ready: boolean;
}

export function validateEnv(): EnvConfig {
  return { ready: true };
}
