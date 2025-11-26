"use client";

import { Bell, User, Gift } from "lucide-react"; // Added Gift icon
import Link from "next/link";
import { useAuthStore } from "@/src/lib/store/authStore";
import { UserAvatar } from "@/src/components/common/UserAvatar";

export function TopAppBar() {
  const { user } = useAuthStore();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
                 h-[var(--header-height)]
                 px-4 md:px-8
                 glass-nav
                 flex items-center justify-between transition-all duration-300"
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <span className="font-display font-bold text-lg">P</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden md:block">
            Paywise
          </span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Points Badge */}
        {user && (
          <Link
            href="/rewards"
            className="hidden md:flex items-center gap-2 bg-secondary/50 hover:bg-secondary 
                       rounded-full px-4 py-1.5 border border-border/50
                       transition-all duration-300 hover:scale-105"
          >
            <Gift size={16} className="text-primary" />
            <span className="text-sm font-semibold">{user.rewards_balance?.toLocaleString() ?? 0}</span>
          </Link>
        )}

        {/* Notifications */}
        <button
          className="relative p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
          aria-label="View Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background animate-pulse"></span>
        </button>

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="ml-1 rounded-full transition-transform hover:scale-105 active:scale-95"
          aria-label="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden shadow-sm">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={18} className="text-muted-foreground" />
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
