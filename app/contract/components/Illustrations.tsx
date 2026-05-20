import { FileText, Calendar, Clock, Sparkles } from "lucide-react";

export function EmptyContracts() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <FileText size={48} className="text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2 font-display">
        No contracts yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        Create your first contract to get started with professional booking agreements.
      </p>
      <div className="flex gap-2">
        <Sparkles size={16} className="text-primary/60" />
        <Sparkles size={16} className="text-primary/40" />
        <Sparkles size={16} className="text-primary/60" />
      </div>
    </div>
  );
}

export function EmptyTemplates() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-secondary/10">
          <FileText size={48} className="text-secondary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2 font-display">
        No templates saved
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        Save your contract configurations as templates for faster setup.
      </p>
    </div>
  );
}

export function EmptyAnalytics() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-accent/10">
          <Clock size={48} className="text-accent" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2 font-display">
        No data yet
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        Create and send contracts to see analytics and insights.
      </p>
    </div>
  );
}

export function SuccessState({ title = "Success!", message }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-success/20 rounded-full blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
          <svg
            className="w-12 h-12 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-2 font-display">{title}</h3>
      {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", message }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-error/20 rounded-full blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
          <svg
            className="w-12 h-12 text-error"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-slate-900 mb-2 font-display">{title}</h3>
      {message && <p className="text-sm text-slate-500 max-w-sm">{message}</p>}
    </div>
  );
}
