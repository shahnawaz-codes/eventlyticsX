import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import Provider from "@/providers/main";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
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
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-white text-zinc-900 antialiased selection:bg-blue-500/20 selection:text-blue-900`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
