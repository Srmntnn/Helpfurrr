import React, { useState, useEffect } from "react";
import AdoptedCards from "./AdoptedCards";

const AdoptedHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdoptedPets = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/adoptedPets`
      );
      if (!response.ok) {
        throw new Error("An error occurred while fetching adopted pets");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching adopted pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptedPets();
  }, []);

  return (
    <div className="pet-container min-h-[80%]">
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <AdoptedCards
            key={request._id}
            dog={request}
            updateCards={fetchAdoptedPets}
            deleteBtnText="Delete History"
            approveBtn={false}
          />
        ))
      ) : (
        <p className="flex justify-center items-center h-full quicksand-semi-bold">No adopted pets available</p>
      )}
    </div>
  );
};

export default AdoptedHistory;
