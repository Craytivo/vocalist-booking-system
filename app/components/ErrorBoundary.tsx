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
        <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.16),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(51,65,85,0.10),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#f8fafc_100%)] px-4 py-10 text-slate-900">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 border border-red-200 bg-red-50 rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-2">Something went wrong</h2>
              <p className="text-sm text-slate-600 text-center mb-6">
                An unexpected error occurred. Please refresh the page and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-sm active:scale-95 min-h-[48px] focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
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
