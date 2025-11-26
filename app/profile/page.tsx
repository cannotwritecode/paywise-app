"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { User as UserIcon, Mail, Edit2, LogOut, Settings, ChevronRight, Shield, Award, Code2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { AppShell } from "@/src/components/layout/AppShell";
import { Button } from "@/src/components/common/Button";
import { Card } from "@/src/components/common/Card";
import { useNotifications } from "@/src/hooks/useNotifications";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { isSubscribed, subscribe, unsubscribe } = useNotifications();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/auth/signin" });
  };

  if (!session) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  const user = session.user;

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8 pb-24 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-3xl text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and settings</p>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-b from-card to-background">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-background relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-card bg-card p-1 shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={40} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-6 text-center space-y-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">
                {user.name}
              </h2>
              <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                <Mail size={14} /> {user.email}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                Member
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield size={10} /> Verified
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 border-t border-border">
            <div className="p-6 text-center border-r border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <Award size={20} />
                <span className="font-display font-bold text-2xl">{(user as any).rewards_balance || 0}</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reward Points</p>
            </div>
            <div className="p-6 text-center hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center gap-2 text-foreground mb-1">
                <Edit2 size={20} />
                <span className="font-display font-bold text-2xl">12</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contributions</p>
            </div>
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg px-2">Settings</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <UserIcon size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Personal Information</p>
                  <p className="text-xs text-muted-foreground">Update your details</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Settings size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Preferences</p>
                  <p className="text-xs text-muted-foreground">App settings</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => {
                console.log("Profile notification toggle clicked");
                if (isSubscribed) {
                  unsubscribe();
                } else {
                  subscribe();
                }
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSubscribed ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                  <Shield size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">{isSubscribed ? 'Enabled' : 'Enable push notifications'}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isSubscribed ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isSubscribed ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* Developer Dashboard Link */}
            <a href="/developer" className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Code2 size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Developer Dashboard</p>
                  <p className="text-xs text-muted-foreground">Manage API keys & integrations</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="pt-4">
            <Button
              variant="danger"
              fullWidth
              size="lg"
              onClick={handleSignOut}
              disabled={loading}
              className="justify-center"
            >
              {loading ? (
                "Signing out..."
              ) : (
                <>
                  <LogOut size={18} className="mr-2" /> Sign Out
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
