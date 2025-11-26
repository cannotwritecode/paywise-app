"use client";

import { type ReactNode, useEffect, useState } from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomTabBar } from "./BottomTabBar";
import { useAuthStore } from "@/src/lib/store/authStore";

interface AppShellProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

// NEW: A dedicated component for our atmospheric background.
// This lives here so it's on every page.
function BackgroundGlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-background via-transparent to-primary/10 dark:from-background dark:to-primary/20 blur-3xl" />
    </div>
  );
}

// NEW: A dedicated hook to handle client-side hydration.
// This cleans up the AppShell component itself.
function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
    setIsHydrated(true);
  }, [hydrate]);

  return isHydrated;
}

export function AppShell({ children, hideNavigation }: AppShellProps) {
  const isHydrated = useHydration();

  if (!isHydrated) return null;

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background text-foreground overflow-x-hidden">
      {/* Premium Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      {!hideNavigation && <TopAppBar />}

      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 transition-all duration-300 ${
          !hideNavigation ? "pt-[var(--header-height)] pb-[var(--bottom-nav-height)]" : ""
        }`}
      >
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>

      {!hideNavigation && <BottomTabBar />}
    </div>
  );
}
