import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import Provider from "@/providers/main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventlyticsX | Privacy-First Web Analytics & Event Tracking",
  description:
    "Track visitors, pageviews, and custom conversions in real-time. EventlyticsX is a fast, lightweight (<1KB script), privacy-compliant analytics platform for modern developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
