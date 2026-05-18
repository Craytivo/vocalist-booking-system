"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(251,191,36,0.08),transparent_28%),linear-gradient(135deg,#fffaf0_0%,#f8f4ec_48%,#fff7ed_100%)] px-4 py-10 text-stone-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(180,83,9,0.18),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(120,53,15,0.2),transparent_28%),linear-gradient(135deg,#0c0a09_0%,#1c1917_52%,#111827_100%)] dark:text-stone-100">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-amber-200/80 bg-white/85 p-8 shadow-xl shadow-amber-950/10 backdrop-blur dark:border-amber-500/20 dark:bg-stone-950/80 dark:shadow-black/20">
              <div className="flex items-center justify-center w-16 h-16 border border-red-200 bg-red-50 rounded-full mx-auto mb-4 dark:border-red-800 dark:bg-red-950/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-300">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-stone-950 text-center mb-2 dark:text-amber-50">Something went wrong</h2>
              <p className="text-sm text-stone-600 text-center mb-6 dark:text-stone-300">
                An unexpected error occurred. Please refresh the page and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg border border-amber-300/70 bg-stone-950 px-4 py-3 text-sm font-semibold text-amber-100 transition-all hover:border-amber-400 hover:bg-stone-900 hover:shadow-sm active:scale-95 min-h-[48px] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
