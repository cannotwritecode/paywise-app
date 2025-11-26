"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { MapsProvider } from "@/src/context/MapsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MapsProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </MapsProvider>
    </SessionProvider>
  );
}
