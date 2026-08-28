import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100 px-4 py-10 text-stone-950 dark:bg-stone-900 dark:text-stone-100">
      <div className="w-full max-w-md rounded-2xl border border-amber-200/80 bg-white/85 p-8 text-center shadow-xl shadow-amber-950/10 backdrop-blur dark:border-amber-500/20 dark:bg-stone-950/80 dark:shadow-black/20">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/25 bg-stone-900 text-amber-300 shadow-md shadow-black/20">
          404
        </div>
        <h1 className="text-2xl font-bold text-stone-950 mb-2 dark:text-amber-50">Page not found</h1>
        <p className="text-sm text-stone-600 mb-8 dark:text-stone-300">The page you’re looking for doesn’t exist or may have moved.</p>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-amber-300/70 bg-stone-950 px-6 py-3 text-sm font-semibold text-amber-100 transition-all hover:border-amber-400 hover:bg-stone-900 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
