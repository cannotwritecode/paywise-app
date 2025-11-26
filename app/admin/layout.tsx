"use client";

import AdminGuard from "@/src/components/auth/AdminGuard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Ads Management", href: "/admin/ads", icon: Megaphone },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/20 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r hidden md:flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                P
              </div>
              <span className="font-bold text-lg">Paywise Admin</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
