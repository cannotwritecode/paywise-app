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

import AdContainer from "@/components/ads/AdContainer";

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
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-w-0">
            {children}
          </div>

          {/* Desktop Ad Sidebar */}
          <aside className="hidden lg:block space-y-6 pt-4">
            <div className="sticky top-[calc(var(--header-height)+2rem)]">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-card border shadow-sm">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Sponsored</h3>
                  <AdContainer />
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                  <h3 className="font-bold text-primary mb-1">Advertise Here</h3>
                  <p className="text-xs text-muted-foreground mb-3">Reach thousands of local shoppers.</p>
                  <button className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors w-full">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {!hideNavigation && <BottomTabBar />}
    </div>
  );
}
