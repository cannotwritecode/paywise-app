"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TrendingUp, ScanLine, PenSquare, Gift, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/src/components/layout/AppShell";
import { Button } from "@/src/components/common/Button";
import { Card } from "@/src/components/common/Card";
import { PriceCard } from "@/src/components/price/PriceCard";
import AdContainer from "@/components/ads/AdContainer";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import type { PriceEntry } from "@/src/lib/types";
import { apiClient, setApiToken } from "@/src/lib/api";

type InflationLevel = "Low" | "Moderate" | "High";

// Premium Price Pulse Widget
const PricePulse = ({ level }: { level: InflationLevel }) => {
  const levelData = {
    Low: {
      text: "Prices are stable",
      color: "text-emerald-500",
      bg: "bg-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5",
    },
    Moderate: {
      text: "Prices are rising",
      color: "text-amber-500",
      bg: "bg-amber-500",
      gradient: "from-amber-500/20 to-amber-500/5",
    },
    High: {
      text: "High inflation warning",
      color: "text-rose-500",
      bg: "bg-rose-500",
      gradient: "from-rose-500/20 to-rose-500/5",
    },
  };

  const { text, color, bg, gradient } = levelData[level];

  return (
    <Card className={cn("relative overflow-hidden border-none", gradient)}>
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm" />
      
      <div className="relative p-6 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className={cn("w-5 h-5", color)} />
            <h3 className="font-display font-semibold text-lg">Price Pulse</h3>
          </div>
          <p className="text-muted-foreground font-medium">{text}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm", bg)}>
            {level}
          </span>
          <span className="text-xs text-muted-foreground">Updated today</span>
        </div>
      </div>

      {/* Animated Bar */}
      <div className="relative h-1.5 w-full bg-background/50">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.2)]",
            bg,
            level === "Low" && "w-1/3",
            level === "Moderate" && "w-2/3",
            level === "High" && "w-full"
          )}
        />
      </div>
    </Card>
  );
};

// Premium Rewards Widget
const RewardsDisplay = ({ points }: { points: number }) => (
  <Link href="/rewards" className="block group">
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/15 transition-all duration-300">
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Available Balance</p>
          <h3 className="font-display text-3xl font-bold text-primary tracking-tight">
            {points.toLocaleString()} <span className="text-lg font-normal text-muted-foreground">pts</span>
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Gift size={24} className="text-primary" />
        </div>
      </div>
    </Card>
  </Link>
);

export default function HomePage() {
  const { data: session } = useSession();
  const [trends, setTrends] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inflationLevel, setInflationLevel] = useState<InflationLevel>("Moderate");

  useEffect(() => {
    if (session) {
      const token = (session as any).accessToken;
      if (token) setApiToken(token);
    }
  }, [session]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data } = await apiClient.get("/prices/trending", {
          params: { limit: 4 }
        });
        setTrends(data.items || []);
      } catch (error) {
        console.error("Failed to load trending prices", error);
        toast.error("Failed to load trending prices");
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const userFirstName = session?.user?.name?.split(" ")[0] || "Friend";
  const rewardsBalance = (session?.user as any)?.rewardsBalance || 0;

  return (
    <AppShell>
      <div className="space-y-8 pb-20">
        {/* Dynamic Hero */}
        <div className="relative pt-4 pb-2">
          <div className="flex items-end justify-between mb-6">
            <div className="space-y-1">
              <h1 className="font-display font-bold text-4xl tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                Hello, {userFirstName}
              </h1>
              <p className="text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                Ready to find the best deals?
              </p>
            </div>
            {session && (
               <div className="hidden md:block animate-in fade-in zoom-in duration-500 delay-200">
                 <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-background shadow-lg">
                   <img src={session.user?.image || `https://ui-avatars.com/api/?name=${userFirstName}`} alt="Profile" className="w-full h-full object-cover" />
                 </div>
               </div>
            )}
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <Link href="/scan-receipt" className="group">
              <div className="h-full p-5 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[140px]">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ScanLine size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Scan Receipt</h3>
                  <p className="text-primary-foreground/80 text-sm">+15 points</p>
                </div>
              </div>
            </Link>
            
            <Link href="/add-price" className="group">
              <div className="h-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[140px]">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                  <PenSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Add Price</h3>
                  <p className="text-muted-foreground text-sm">+10 points</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <PricePulse level={inflationLevel} />
          {session && <RewardsDisplay points={rewardsBalance} />}
        </div>

        {/* Sponsored Ad */}
        <div className="animate-in fade-in slide-in-from-bottom-9 duration-1000 delay-400">
          <AdContainer category="general" />
        </div>

        {/* Trending Section */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                <TrendingUp size={20} />
              </div>
              <h2 className="font-display font-bold text-xl">Trending Now</h2>
            </div>
            <Link 
              href="/compare" 
              className="group flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all 
              <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-muted/50 border-none" />
              ))}
            </div>
          ) : trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trends.map((trend) => (
                <PriceCard key={trend.id} entry={trend} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center border-dashed bg-muted/30">
              <p className="text-muted-foreground">No trending prices available yet.</p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
