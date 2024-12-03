"use client";

import React, { useState, useEffect } from "react";
import { Map, APIProvider, AdvancedMarker } from "@vis.gl/react-google-maps";

function MapComponent() {
    const [userLocation, setUserLocation] = useState({ lat: null, lng: null });

    // Function to get user location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // Use effect to call getUserLocation when component mounts
    useEffect(() => {
        getUserLocation();
    }, []);

    // Default center if user location is not yet available
    const defaultPosition = { lat: 10.6767, lng: 122.956 };

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div className="mt-[78px] h-screen">
                <Map
                    center={userLocation.lat ? userLocation : defaultPosition}
                    zoom={12}
                >
                    {userLocation.lat && (
                        <AdvancedMarker position={userLocation}></AdvancedMarker>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}

export default MapComponent;