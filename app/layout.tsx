import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { validateEnv } from "./utils/env";

// Validate environment variables on startup
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation error:", error);
}

export const metadata: Metadata = {
  title: "Vocalist Booking System",
  description: "A fast booking-to-contract system for professional vocalists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
