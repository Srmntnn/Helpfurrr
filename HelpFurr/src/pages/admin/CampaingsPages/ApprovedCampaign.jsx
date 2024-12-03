import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import CampaignCard from "./CampaignCard";

function ApprovedCampaign() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/get-campaigns`
      );
      setRequests(response.data); // Axios automatically parses JSON response
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((request) => (
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
