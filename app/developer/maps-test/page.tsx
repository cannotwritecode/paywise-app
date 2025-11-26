"use client";

import React from "react";
import MapComponent from "@/components/maps/MapComponent";
import AdContainer from "@/components/ads/AdContainer";
import { useMaps } from "@/src/context/MapsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MapsTestPage() {
  const { isLoaded, userLocation, userAddress, loadError, geoError } = useMaps();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Maps & Ads Integration Test</h1>
        <p className="text-muted-foreground">
          Verifying Google Maps loading, geolocation, and location-based ad serving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Map Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">API Loaded:</span>
                <span className={isLoaded ? "text-green-600" : "text-yellow-600"}>
                  {isLoaded ? "Yes" : "Loading..."}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Error:</span>
                <span className={loadError ? "text-red-600" : "text-green-600"}>
                  {loadError ? loadError.message : "None"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">User Location:</span>
                <span>
                  {userLocation
                    ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                    : "Not detected"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Address:</span>
                <span>{userAddress || "Not resolved"}</span>
              </div>
              {geoError && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-red-600">Geo Error:</span>
                  <span className="text-red-600 text-right">{geoError}</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <MapComponent height="300px" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ad Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Finance Ad (Context Aware)</h3>
              <AdContainer category="finance" />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Retail Ad (Context Aware)</h3>
              <AdContainer category="retail" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
