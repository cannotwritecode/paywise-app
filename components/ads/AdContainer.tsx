"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useMaps } from "@/src/context/MapsContext";
import { apiClient } from "@/src/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin } from "lucide-react";

interface AdData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  sponsor_name: string;
  is_global: boolean;
}

interface AdContainerProps {
  category?: string;
  className?: string;
}

export default function AdContainer({ category = "general", className }: AdContainerProps) {
  const { userLocation, isLoaded } = useMaps();
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      try {
        const params: any = { category };
        
        if (userLocation) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const { data } = await apiClient.get("/ads", { params });
        if (data.ad) {
          setAd(data.ad);
        }
      } catch (error) {
        console.error("Failed to fetch ad:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded || !isLoaded) { 
       const timer = setTimeout(fetchAd, 1000);
       return () => clearTimeout(timer);
    }
  }, [category, userLocation, isLoaded]);

  const handleAdClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!ad) return;

    try {
      const { data } = await apiClient.post(`/ads/${ad.id}/click`);
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to record click:", error);
      // Fallback to direct link if tracking fails
      window.open(ad.link_url, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return <div className={`h-64 bg-muted/20 animate-pulse rounded-xl ${className}`} />;
  }

  if (!ad) return null;

  return (
    <Card className={`overflow-hidden border-muted/40 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="relative h-40 w-full">
        <Image
          src={ad.image_url}
          alt={ad.title}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/70 text-white border-none backdrop-blur-sm">
          Sponsored
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              {ad.sponsor_name}
            </p>
            <h3 className="font-semibold text-lg leading-tight">{ad.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ad.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant="outline" onClick={handleAdClick}>
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            Learn More <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
