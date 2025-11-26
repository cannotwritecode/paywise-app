"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useMaps } from "@/src/context/MapsContext";
import { apiClient } from "@/src/lib/api";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

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

function AdCard({ ad }: { ad: AdData }) {
  const handleAdClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post(`/ads/${ad.id}/click`);
      if (data.url) {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to record click:", error);
      window.open(ad.link_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="overflow-hidden border-muted/40 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-40 w-full shrink-0">
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
      <CardContent className="p-4 pt-0 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {ad.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full" variant="outline" onClick={handleAdClick}>
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            Learn More <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AdContainer({ category, className }: AdContainerProps) {
  const { userLocation, isLoaded } = useMaps();
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const params: any = { limit: 5 }; // Request up to 5 ads
        
        // Only add category if it's provided and not "all"
        if (category && category !== "all") {
          params.category = category;
        }
        
        if (userLocation) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const { data } = await apiClient.get("/ads", { params });
        
        console.log("AdContainer response:", data); // DEBUG: Check what backend returns

        // Handle both single ad and array of ads
        if (data.ads && Array.isArray(data.ads)) {
          console.log("Received multiple ads:", data.ads.length);
          setAds(data.ads);
        } else if (data.ad) {
          console.log("Received single ad");
          setAds([data.ad]);
        } else {
          setAds([]);
        }
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately if loaded, or wait a bit if loading (to give geolocation a chance)
    // But don't wait forever, fallback to global ads if location fails
    const timer = setTimeout(fetchAds, isLoaded ? 0 : 1000);
    return () => clearTimeout(timer);
  }, [category, userLocation, isLoaded]);

  // Autoplay functionality
  useEffect(() => {
    if (!api || ads.length <= 1) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api, ads.length]);

  if (loading) {
    return <div className={`h-80 bg-muted/20 animate-pulse rounded-xl ${className}`} />;
  }

  if (ads.length === 0) return null;

  if (ads.length === 1) {
    return (
      <div className={className}>
        <AdCard ad={ads[0]} />
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      className={`w-full ${className}`}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {ads.map((ad) => (
          <CarouselItem key={ad.id}>
            <AdCard ad={ad} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </div>
    </Carousel>
  );
}
