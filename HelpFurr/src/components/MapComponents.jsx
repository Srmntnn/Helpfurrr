import React, { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api"; // Using @react-google-maps/api for managing the loading

const MapComponent = () => {
  const [clinics, setClinics] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [showClinics, setShowClinics] = useState(false);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
      });
    }
  }, []);

  const fetchNearbyClinics = (location) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API is not loaded.");
      return; // Ensure google.maps is defined
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.nearbySearch(
      {
        location,
        radius: 500, // Search within 500 meters
        type: ["clinic"],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setClinics(results);
        } else {
          console.error("Places service failed due to " + status);
        }
      }
    );
  };

  const handleShowClinicsClick = () => {
    if (userLocation) {
      fetchNearbyClinics(userLocation);
      setShowClinics(true);
    }
  };

  return (
    <div>
      {/* LoadScript dynamically loads Google Maps API */}
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        {userLocation && (
          <GoogleMap
            center={userLocation}
            zoom={14}
            mapContainerStyle={{ height: "800px", width: "100%" }}
          >
            <Marker position={userLocation} title="You are here" />
            {clinics.map((clinic) => (
              <Marker
                key={clinic.place_id}
                position={clinic.geometry.location}
                title={clinic.name}
              />
            ))}
          </GoogleMap>
        )}
      </LoadScript>
      <button
        onClick={handleShowClinicsClick}
        style={{
          margin: "10px",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Show All Clinics
      </button>
    </div>
  );
};

export default MapComponent;
