import axios from "axios";
import React, { useState, useEffect } from "react";
import VolunteerCard from "./VolunteerCard";

function VolunteerRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/volunteers/requests"
      );
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="pet-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : requests.length > 0 ? (
        requests.map((request, index) => (
          <VolunteerCard
            key={request._id}
            volunteer={request}
            index={index}
            updateCards={fetchRequests}
            deleteBtnText={"Reject"}
            approveBtn={true}
          />
        ))
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
}

export default VolunteerRequest;
