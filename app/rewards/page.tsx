"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Gift, Trophy, Star, TrendingUp, Lock, CheckCircle2, Crown } from "lucide-react";
import { AppShell } from "@/src/components/layout/AppShell";
import AdContainer from "@/components/ads/AdContainer";
import { Card } from "@/src/components/common/Card";
import { Button } from "@/src/components/common/Button";
import { apiClient, setApiToken } from "@/src/lib/api";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";

interface Reward {
  id: string;
  name: string;
  points: number;
  available: boolean;
}

interface LeaderboardUser {
  name: string;
  points: number;
}

export default function RewardsPage() {
  const { data: session } = useSession();
  const [userPoints, setUserPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const token = (session as any).accessToken;
      if (token) setApiToken(token);
    }
  }, [session]);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const userId = (session.user as any).id;
        const { data } = await apiClient.get(`/users/${userId}/rewards`);
        
        setUserPoints(data.points || 0);
        setLeaderboard(data.leaderboard?.allTime || []);
      } catch (error) {
        console.error("Failed to load rewards", error);
        toast.error("Failed to load rewards data");
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [session]);

  const rewards: Reward[] = [
    { id: "1", name: "₦500 Voucher", points: 1000, available: userPoints >= 1000 },
    { id: "2", name: "₦1000 Voucher", points: 2000, available: userPoints >= 2000 },
    { id: "3", name: "₦2000 Voucher", points: 4000, available: userPoints >= 4000 },
  ];

  const nextReward = rewards.find(r => !r.available) || rewards[rewards.length - 1];
  const progress = Math.min(100, (userPoints / nextReward.points) * 100);

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8 pb-24 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Rewards Center
          </h1>
          <p className="text-muted-foreground">Earn points and unlock exclusive perks</p>
        </div>

        {/* Points Balance & Progress */}
        <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary to-emerald-600 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={120} />
          </div>
          
          <div className="p-8 relative z-10">
            <p className="text-primary-foreground/80 font-medium mb-1">Available Balance</p>
            <h2 className="font-display font-bold text-5xl mb-6">
              {loading ? "..." : userPoints.toLocaleString()} <span className="text-2xl font-normal opacity-80">pts</span>
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Next Reward: {nextReward.name}</span>
                <span>{userPoints} / {nextReward.points}</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-primary-foreground/70 text-right">
                {nextReward.points - userPoints} points to go!
              </p>
            </div>
          </div>
        </Card>

        {/* Ways to Earn */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Ways to Earn</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Star, title: "Add Price", pts: "+10", color: "text-amber-500", bg: "bg-amber-500/10" },
              { icon: TrendingUp, title: "Scan Receipt", pts: "+15", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: CheckCircle2, title: "Verify", pts: "+5", color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((item, i) => (
              <Card key={i} className="p-4 flex flex-col items-center text-center gap-2 hover:bg-muted/50 transition-colors border-none shadow-sm">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg, item.color)}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs font-bold text-primary">{item.pts} pts</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sponsored Ad */}
        <div className="py-2">
          <AdContainer />
        </div>

        {/* Rewards List */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Available Rewards</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div 
                key={reward.id} 
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  reward.available 
                    ? "bg-card border-primary/20 shadow-sm" 
                    : "bg-muted/30 border-transparent opacity-70"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    reward.available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {reward.available ? <Gift size={24} /> : <Lock size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground">{reward.points.toLocaleString()} points</p>
                  </div>
                </div>
                <Button
                  variant={reward.available ? "primary" : "secondary"}
                  size="sm"
                  disabled={!reward.available}
                >
                  {reward.available ? "Redeem" : "Locked"}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Top Earners</h3>
            <span className="text-xs font-medium text-muted-foreground">This Week</span>
          </div>
          
          <Card className="overflow-hidden border-none shadow-md">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading leaderboard...</div>
            ) : leaderboard.length > 0 ? (
              <div className="divide-y divide-border">
                {leaderboard.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                        index === 0 ? "bg-yellow-100 text-yellow-700" :
                        index === 1 ? "bg-gray-100 text-gray-700" :
                        index === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {index < 3 ? <Crown size={14} /> : `#${index + 1}`}
                      </div>
                      <span className={cn("font-medium", index === 0 && "font-bold")}>{user.name}</span>
                    </div>
                    <span className="font-mono font-medium text-primary">{user.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">No leaderboard data available</div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
