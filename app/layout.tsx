import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { validateEnv } from "./utils/env";
import { Plus_Jakarta_Sans, Inter, Merriweather } from "next/font/google";

// UI Fonts for the entire site
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Contract preview font (for legal documents only)
const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-legal",
  display: "swap",
  weight: ["300", "400", "700"],
});

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
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} ${merriweather.variable}`}>
      <head>
      </head>
      <body className="font-sans antialiased">
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
