"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdAnalytics {
  id: string;
  title: string;
  sponsor_name: string;
  impressions: string | number;
  clicks: string | number;
  ctr: string | number;
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState<AdAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      // Use analytics endpoint as it lists all ads with stats
      const { data } = await apiClient.get("/admin/ads/analytics");
      setAds(data.analytics || []);
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      toast.error("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
      await apiClient.delete(`/admin/ads/${id}`);
      toast.success("Ad deleted successfully");
      fetchAds(); // Refresh list
    } catch (error) {
      console.error("Failed to delete ad:", error);
      toast.error("Failed to delete ad");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading ads...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ads Management</h1>
          <p className="text-muted-foreground">Create and manage your ad campaigns.</p>
        </div>
        <Button asChild>
          <Link href="/admin/ads/create">
            <Plus className="mr-2 h-4 w-4" /> Create Ad
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Sponsor</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No ads found. Create your first campaign!
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>{ad.sponsor_name}</TableCell>
                  <TableCell className="text-right">
                    {Number(ad.impressions).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(ad.clicks).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(ad.ctr).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/ads/${ad.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
