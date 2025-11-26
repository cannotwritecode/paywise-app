"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMaps } from "@/src/context/MapsContext";

// Fix Leaflet marker icon issue
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter = {
  lat: 40.7128, // New York
  lng: -74.006,
};

interface MapComponentProps {
  height?: string;
  showUserLocation?: boolean;
}

function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapComponent({ height = "400px", showUserLocation = true }: MapComponentProps) {
  const { userLocation } = useMaps();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const center = showUserLocation && userLocation ? userLocation : defaultCenter;
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  if (!isMounted) {
    return <div className="bg-muted animate-pulse rounded-lg" style={{ height }} />;
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-lg text-muted-foreground" style={{ height }}>
        Map configuration missing
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
        />
        {showUserLocation && userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={icon} />
        )}
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}
