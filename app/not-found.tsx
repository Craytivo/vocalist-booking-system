import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.16),transparent_34%),radial-gradient(circle_at_78%_12%,rgba(51,65,85,0.10),transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#f8fafc_100%)] px-4 py-10 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 text-sm font-semibold text-slate-100 shadow-md shadow-slate-900/10">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-sm text-slate-600 mb-8">The page you’re looking for doesn’t exist or may have moved.</p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
