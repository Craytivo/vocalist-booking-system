"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { FONT_SIZE_CLASSES, LINE_HEIGHT_CLASSES, FONT_FAMILY_CLASSES, BUTTON_SIZE_CLASSES, FONT_WEIGHT_CLASSES } from "../components/GlobalTypography";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSetNewPassword, setIsSetNewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!supabase) {
      setError("Supabase is not configured. Please add your credentials to .env.local");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/contract");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          router.push("/contract");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError("Supabase is not configured. Please add your credentials to .env.local");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/contract`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!supabase) {
      setError("Supabase is not configured. Please add your credentials to .env.local");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      setSuccess("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!supabase) {
      setError("Supabase is not configured. Please add your credentials to .env.local");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      setSuccess("Password updated successfully. Signing you in...");
      
      // Auto-sign-in after password reset
      setTimeout(async () => {
        if (supabase) {
          const { data: { session }, error: signInError } = await supabase.auth.getSession();
          if (session && !signInError) {
            router.push("/contract");
          } else {
            // If no active session, redirect to sign in
            setIsSetNewPassword(false);
            setIsLogin(true);
            setSuccess("");
          }
        } else {
          setIsSetNewPassword(false);
          setIsLogin(true);
          setSuccess("");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Check for reset=true query parameter to show set new password form
  useEffect(() => {
    const resetParam = searchParams.get("reset");
    if (resetParam === "true") {
      setIsSetNewPassword(true);
      setIsResetPassword(false);
      setIsLogin(false);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 px-4 py-10 text-stone-950 dark:text-stone-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-200/30 via-transparent to-orange-200/30 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-orange-200/30 via-transparent to-amber-200/30 dark:from-orange-900/20 dark:via-transparent dark:to-amber-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="relative rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 shadow-2xl shadow-amber-900/10 dark:border-white/10 dark:bg-stone-900/60 dark:shadow-black/40">
          {/* Glassmorphism shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 via-transparent to-white/20 dark:from-white/10 dark:via-transparent dark:to-white/5 pointer-events-none" />
          
          <div className="relative z-10 text-center mb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-100 to-amber-50 shadow-lg shadow-amber-900/20 dark:border-amber-500/30 dark:from-stone-800 dark:to-stone-900 dark:shadow-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-amber-600 dark:text-amber-400">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <h1 className={`${FONT_SIZE_CLASSES.headingLg} ${FONT_WEIGHT_CLASSES.bold} bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent mb-2 dark:from-amber-100 dark:to-amber-300 ${FONT_FAMILY_CLASSES.heading} ${LINE_HEIGHT_CLASSES.tight}`}>Setlist</h1>
            <p className={`${FONT_SIZE_CLASSES.bodyMd} text-stone-600 dark:text-stone-300 ${FONT_FAMILY_CLASSES.body} ${LINE_HEIGHT_CLASSES.normal}`}>
              {isSetNewPassword ? "Set your new password" : isResetPassword ? "Reset your password" : isLogin ? "Sign in to access your contracts" : "Create your account"}
            </p>
            {isSetNewPassword && (
              <p className={`mt-2 ${FONT_SIZE_CLASSES.uiSm} text-stone-500 dark:text-stone-400 ${FONT_FAMILY_CLASSES.body} ${LINE_HEIGHT_CLASSES.normal}`}>
                Enter your new password below. Use at least 6 characters.
              </p>
            )}
            {!isLogin && !isResetPassword && !isSetNewPassword && (
              <p className={`mt-2 ${FONT_SIZE_CLASSES.uiSm} text-stone-500 dark:text-stone-400 ${FONT_FAMILY_CLASSES.body} ${LINE_HEIGHT_CLASSES.normal}`}>
                Use at least 6 characters. You may need to verify your email before full access.
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50/80 backdrop-blur border border-red-200/60 rounded-xl dark:bg-red-950/40 dark:border-red-800/60 shadow-sm" role="alert">
              <p className={`${FONT_SIZE_CLASSES.bodyMd} text-red-700 dark:text-red-200 ${FONT_FAMILY_CLASSES.body}`}>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50/80 backdrop-blur border border-emerald-200/60 rounded-xl dark:bg-emerald-950/40 dark:border-emerald-800/60 shadow-sm" role="status" aria-live="polite">
              <p className={`${FONT_SIZE_CLASSES.bodyMd} text-emerald-700 dark:text-emerald-200 ${FONT_FAMILY_CLASSES.body}`}>{success}</p>
            </div>
          )}

          {isSetNewPassword ? (
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label htmlFor="new-password" className={`block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-stone-700 mb-2 dark:text-stone-200 ${FONT_FAMILY_CLASSES.heading}`}>
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all hover:border-amber-400 hover:bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:bg-white/90 min-h-[48px] dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 dark:focus:bg-stone-900/90 ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className={`block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-stone-700 mb-2 dark:text-stone-200 ${FONT_FAMILY_CLASSES.heading}`}>
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all hover:border-amber-400 hover:bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:bg-white/90 min-h-[48px] dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 dark:focus:bg-stone-900/90 ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl border border-amber-300/50 bg-gradient-to-br from-stone-950 to-stone-900 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.semibold} text-amber-100 transition-all hover:border-amber-400 hover:from-stone-900 hover:to-stone-800 hover:shadow-lg hover:shadow-amber-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:from-amber-200 dark:to-amber-300 dark:text-stone-950 dark:hover:from-amber-300 dark:hover:to-amber-400 dark:hover:shadow-amber-500/20`}
              >
                {loading ? "Updating..." : "Set New Password"}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetNewPassword(false);
                    setIsLogin(true);
                    setError("");
                    setSuccess("");
                  }}
                  className={`${FONT_SIZE_CLASSES.bodyMd} text-amber-700 hover:text-amber-900 ${FONT_WEIGHT_CLASSES.medium} dark:text-amber-300 dark:hover:text-amber-200 ${FONT_FAMILY_CLASSES.body}`}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          ) : isResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className={`block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-stone-700 mb-2 dark:text-stone-200 ${FONT_FAMILY_CLASSES.heading}`}>
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all hover:border-amber-400 hover:bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:bg-white/90 min-h-[48px] dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 dark:focus:bg-stone-900/90 ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl border border-amber-300/50 bg-gradient-to-br from-stone-950 to-stone-900 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.semibold} text-amber-100 transition-all hover:border-amber-400 hover:from-stone-900 hover:to-stone-800 hover:shadow-lg hover:shadow-amber-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:from-amber-200 dark:to-amber-300 dark:text-stone-950 dark:hover:from-amber-300 dark:hover:to-amber-400 dark:hover:shadow-amber-500/20`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(false);
                    setError("");
                    setSuccess("");
                  }}
                  className={`${FONT_SIZE_CLASSES.bodyMd} text-amber-700 hover:text-amber-900 ${FONT_WEIGHT_CLASSES.medium} dark:text-amber-300 dark:hover:text-amber-200 ${FONT_FAMILY_CLASSES.body}`}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Google Sign-In Button */}
              {supabase && (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className={`w-full flex items-center justify-center gap-3 rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} ${FONT_WEIGHT_CLASSES.medium} text-stone-700 transition-all hover:bg-white/80 hover:border-amber-400 hover:shadow-md mb-4 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              )}

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-200/60 dark:border-amber-500/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className={`px-3 bg-white/70 backdrop-blur-sm text-stone-500 dark:bg-stone-900/70 dark:text-stone-400 ${FONT_SIZE_CLASSES.uiXs} ${FONT_FAMILY_CLASSES.body} shadow-sm rounded-full`}>Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label htmlFor="email" className={`block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-stone-700 mb-2 dark:text-stone-200 ${FONT_FAMILY_CLASSES.heading}`}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all hover:border-amber-400 hover:bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:bg-white/90 min-h-[48px] dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 dark:focus:bg-stone-900/90 ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className={`block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-stone-700 mb-2 dark:text-stone-200 ${FONT_FAMILY_CLASSES.heading}`}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border border-amber-200/60 bg-white/60 backdrop-blur-sm px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all hover:border-amber-400 hover:bg-white/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:bg-white/90 min-h-[48px] dark:border-amber-500/30 dark:bg-stone-900/60 dark:text-stone-100 dark:hover:bg-stone-900/80 dark:focus:bg-stone-900/90 ${FONT_FAMILY_CLASSES.body} shadow-sm`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl border border-amber-300/50 bg-gradient-to-br from-stone-950 to-stone-900 ${BUTTON_SIZE_CLASSES.primary.md} ${FONT_WEIGHT_CLASSES.semibold} text-amber-100 transition-all hover:border-amber-400 hover:from-stone-900 hover:to-stone-800 hover:shadow-lg hover:shadow-amber-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:from-amber-200 dark:to-amber-300 dark:text-stone-950 dark:hover:from-amber-300 dark:hover:to-amber-400 dark:hover:shadow-amber-500/20`}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-4 text-center">
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setError("");
                      setSuccess("");
                    }}
                    className={`${FONT_SIZE_CLASSES.bodyMd} text-amber-700 hover:text-amber-900 ${FONT_WEIGHT_CLASSES.medium} dark:text-amber-300 dark:hover:text-amber-200 ${FONT_FAMILY_CLASSES.body}`}
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className={`${FONT_SIZE_CLASSES.bodyMd} text-amber-700 hover:text-amber-900 ${FONT_WEIGHT_CLASSES.medium} dark:text-amber-300 dark:hover:text-amber-200 ${FONT_FAMILY_CLASSES.body}`}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </>
          )}

          {!supabase && (
            <p className={`mt-4 text-center ${FONT_SIZE_CLASSES.uiXs} text-stone-500 dark:text-stone-400 ${FONT_FAMILY_CLASSES.body}`}>
              Add Supabase credentials to .env.local to enable authentication
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 px-4 py-10 text-stone-950 dark:text-stone-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-200/30 via-transparent to-orange-200/30 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-orange-200/30 via-transparent to-amber-200/30 dark:from-orange-900/20 dark:via-transparent dark:to-amber-900/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 text-center">
          <div className="text-stone-600 dark:text-stone-300">Loading...</div>
        </div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
