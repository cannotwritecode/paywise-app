import type React from "react";
import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/src/components/providers/Providers";
import "./globals.css";

// This font setup is perfect. No changes needed.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

// This metadata is great. No changes needed.
export const metadata: Metadata = {
  title: "Paywise - Fair Prices Together",
  description: "Community-verified price tracking app for Nigeria",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  generator: "Paywise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variable injection is perfect.
    <html lang="en" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/*
          NEW: World-class PWA viewport.
          This prevents zooming and ensures a native-app feel.
        */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />

        {/*
          NEW: Theme color for mobile browser UI.
          Matches our light/dark mode changes.
        */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />

        {/* Your existing PWA meta tags are great */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>

      {/*
        The base styles are perfect.
        We've just wrapped the body's children in our ThemeProvider.
      */}
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}