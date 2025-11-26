"use client";

import { LayoutGrid, ScanLine, BarChart3, Users, Gift } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// No change to the data structure, this is perfect.
const tabs = [
  { icon: LayoutGrid, label: "Home", href: "/" },
  { icon: ScanLine, label: "Scan", href: "/scan-receipt" },
  { icon: BarChart3, label: "Compare", href: "/compare" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Gift, label: "Rewards", href: "/rewards" },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50
                 h-[var(--bottom-nav-height)]
                 grid grid-cols-5 items-center
                 bg-white/80 dark:bg-black/80 backdrop-blur-xl
                 border-t border-border/50
                 pb-safe"
    >
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

        const Icon = tab.icon;

        if (tab.label === "Scan") {
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative z-10 flex justify-center -mt-8"
              aria-label="Scan new receipt"
            >
              <div
                className="flex items-center justify-center
                           w-14 h-14 rounded-2xl rotate-45
                           bg-primary shadow-lg shadow-primary/30
                           hover:bg-primary/90 hover:scale-105 transition-all duration-300
                           group"
              >
                <Icon size={26} className="text-primary-foreground -rotate-45 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-full transition-all duration-300 relative",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label={tab.label}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300",
              isActive && "bg-primary/10"
            )}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-all duration-300",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 hidden"
            )}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
