"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    // Local-only mode: skip authentication and go straight to the contract editor
    router.replace("/contract");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center text-sm text-neutral-700">Local mode: redirecting to the contract editor...</div>
    </main>
  );
}
