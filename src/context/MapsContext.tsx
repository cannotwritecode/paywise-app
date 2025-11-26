"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";


interface Location {
  lat: number;
  lng: number;
}

interface MapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
  userLocation: Location | null;
  userAddress: string | null;
  geoError: string | null;
  geocodeLocation: (lat: number, lng: number) => Promise<string | null>;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export function MapsProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading state for consistency with consumers
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserAddress("Geolocation not supported");
      setGeoError("Geolocation not supported by browser");
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      setGeoError(null);
      
      geocodeLocation(latitude, longitude).then(setUserAddress);
    };

    const error = (err: GeolocationPositionError) => {
      console.error("Error getting location:", err);
      let errorMessage = "Location access denied";
      if (err.code === 2) errorMessage = "Location unavailable";
      if (err.code === 3) errorMessage = "Location timeout";
      setUserAddress(errorMessage);
      setGeoError(`${errorMessage} (${err.message})`);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, []);

  const geocodeLocation = async (lat: number, lng: number): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.warn("Geoapify API key not found");
      return null;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const properties = data.features[0].properties;
        // Prefer city/town/village, fallback to formatted address
        return properties.city || properties.town || properties.village || properties.formatted;
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  return (
    <MapsContext.Provider
      value={{
        isLoaded,
        loadError: undefined,
        userLocation,
        userAddress,
        geoError,
        geocodeLocation,
      }}
    >
      {children}
    </MapsContext.Provider>
  );
}

export function useMaps() {
  const context = useContext(MapsContext);
  if (context === undefined) {
    throw new Error("useMaps must be used within a MapsProvider");
  }
  return context;
}
