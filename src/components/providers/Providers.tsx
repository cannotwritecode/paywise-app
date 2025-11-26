"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { MapsProvider } from "@/src/context/MapsContext";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setApiToken } from "@/src/lib/api";

function SessionAuth({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      setApiToken(session.accessToken);
    }
  }, [session]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionAuth>
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
      </SessionAuth>
    </SessionProvider>
  );
}
