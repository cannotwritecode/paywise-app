"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

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

const LIBRARIES: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

export function MapsProvider({ children }: { children: ReactNode }) {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

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
      
      // Reverse geocode immediately if maps loaded
      if (isLoaded) {
        geocodeLocation(latitude, longitude).then(setUserAddress);
      }
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
  }, [isLoaded]);

  const geocodeLocation = async (lat: number, lng: number): Promise<string | null> => {
    if (!isLoaded || !window.google) return null;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results[0]) {
        // Try to find city/locality
        const addressComponent = response.results[0].address_components.find(
          (component) => component.types.includes("locality")
        );
        return addressComponent ? addressComponent.long_name : response.results[0].formatted_address;
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
        loadError,
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
