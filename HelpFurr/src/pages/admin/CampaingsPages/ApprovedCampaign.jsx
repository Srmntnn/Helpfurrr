import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";

function ApprovedCampaign() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:8080/campaigns/get-campaigns");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.log(error);
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
      ) : requests.length > 0 ? (
        requests.map((request, index) => (
          <CampaignCard
            key={request._id}
            campaign={request}
            updateCards={fetchRequests}
            deleteBtnText={"Delete Post"}
            approveBtn={false}
          />
        ))
      ) : (
        <p>No Approved Campaign available</p>
      )}
    </div>
  );
}

export default ApprovedCampaign;
