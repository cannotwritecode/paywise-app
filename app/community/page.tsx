"use client";

import { apiClient } from "@/src/lib/api";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { AppShell } from "@/src/components/layout/AppShell";
import { VerificationCard } from "@/src/components/community/VerificationCard";
import { Card } from "@/src/components/common/Card";
import AdContainer from "@/components/ads/AdContainer";
import { PriceEntry } from "@/src/lib/types";
import { toast } from "sonner";
import { Users, RefreshCw } from "lucide-react";

function LoadingSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-sm">
      <div className="p-4 flex items-center gap-3">
        <div className="skeleton h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 rounded bg-muted" />
          <div className="skeleton h-3 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="h-48 bg-muted/30" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-8 w-full rounded bg-muted" />
        <div className="skeleton h-4 w-2/3 rounded bg-muted" />
      </div>
    </Card>
  );
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [feed, setFeed] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const token = (session as any).accessToken;
      if (token) {
        const { setApiToken } = require("@/src/lib/api");
        setApiToken(token);
      }
    }
  }, [session]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/feed", {
        params: { limit: 20 }
      });
      setFeed(data.items || []);
    } catch (error) {
      console.error("Failed to load feed", error);
      toast.error("Failed to load community feed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleVerify = async (
    id: string,
    action: string,
    priceReported?: number
  ) => {
    if (!session) {
      const signInUrl = new URL("/auth/signin", window.location.origin);
      signInUrl.searchParams.set("callbackUrl", pathname);
      router.push(signInUrl.toString());
      return;
    }

    try {
      await apiClient.post(`/prices/${id}/verify`, {
        action,
        priceReported,
      });

      // Optimistic update or refetch
      const { data } = await apiClient.get("/feed", {
        params: { limit: 20 }
      });
      setFeed(data.items || []);

      toast.success(
        action === "agree"
          ? "Thanks for verifying!"
          : "Your price has been submitted!"
      );
    } catch (error: any) {
      console.error("Verification failed", error);
      const errorMsg = error.response?.data?.error || "Verification failed. Please try again.";
      toast.error(errorMsg);
    };
  };

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2">
            <Users size={24} />
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground">
            Community Feed
          </h1>
          <p className="text-muted-foreground">
            Verify prices shared by your neighbors.
          </p>
        </div>

        {/* Sponsored Ad */}
        <div className="mb-6">
          <AdContainer />
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {loading ? (
            <>
              <LoadingSkeleton />
              <LoadingSkeleton />
              <LoadingSkeleton />
            </>
          ) : feed.length > 0 ? (
            feed.map((entry) => (
              <VerificationCard
                key={entry.id}
                entry={entry}
                onVerify={(action, priceReported) =>
                  handleVerify(entry.id, action ? "agree" : "disagree", priceReported)
                }
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-muted-foreground" size={24} />
              </div>
              <h3 className="font-semibold text-lg">All caught up!</h3>
              <p className="text-muted-foreground">No new prices to verify right now.</p>
              <button 
                onClick={fetchFeed}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Refresh Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
