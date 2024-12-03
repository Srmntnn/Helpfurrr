import axios from "axios";
import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";
import CampaignTable from "./CampaignTable";

function CampaignRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/campaign-requests`
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
          <CampaignTable
            key={request._id}
            campaign={request}
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

export default CampaignRequest;
