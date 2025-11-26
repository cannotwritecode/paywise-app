"use client";

import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMaps } from "@/src/context/MapsContext";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

const defaultCenter = {
  lat: 40.7128, // New York
  lng: -74.006,
};

interface MapComponentProps {
  height?: string;
  showUserLocation?: boolean;
}

export default function MapComponent({ height = "400px", showUserLocation = true }: MapComponentProps) {
  const { isLoaded, loadError, userLocation } = useMaps();

  if (loadError) {
    return <div className="p-4 bg-red-50 text-red-500 rounded-lg">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="p-4 bg-gray-100 animate-pulse rounded-lg h-[400px]">Loading Maps...</div>;
  }

  const center = showUserLocation && userLocation ? userLocation : defaultCenter;

  return (
    <GoogleMap
      mapContainerStyle={{ ...containerStyle, height }}
      center={center}
      zoom={14}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      }}
    >
      {showUserLocation && userLocation && <Marker position={userLocation} />}
    </GoogleMap>
  );
}
