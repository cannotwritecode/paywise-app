"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, MousePointerClick, Eye, TrendingUp } from "lucide-react";

interface AdAnalytics {
  id: string;
  title: string;
  sponsor_name: string;
  impressions: string | number;
  clicks: string | number;
  ctr: string | number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    avgCtr: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await apiClient.get("/admin/ads/analytics");
        const analytics: AdAnalytics[] = data.analytics || [];

        const totalImpressions = analytics.reduce((acc, curr) => acc + Number(curr.impressions), 0);
        const totalClicks = analytics.reduce((acc, curr) => acc + Number(curr.clicks), 0);
        
        // Calculate CTR from totals to be more accurate
        const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

        setStats({
          totalImpressions,
          totalClicks,
          avgCtr,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your ad campaign performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total views across all ads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total user interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click-Through Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgCtr.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performance across campaigns
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
