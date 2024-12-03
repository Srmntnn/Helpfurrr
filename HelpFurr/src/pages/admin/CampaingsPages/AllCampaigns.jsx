import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "@/styles";
import axios from "axios";
import CampaignCard from "./CampaignCard";

const AllCampaigns = () => {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/get-all-campaigns`
      );
      setRequests(response.data || []); // Fallback for empty data
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "An error occurred fetching requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className={`${styles.paddingX} pt-8`}>
      {loading || isCheckingAuth ? (
        <p>Loading...</p>
      ) : error ? (
        <div>
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchRequests}>Retry</button>
        </div>
      ) : requests.length > 0 ? (
        requests.map((request, index) => (
          <CampaignCard
            key={request._id}
            campaign={request}
            updateCards={fetchRequests}
            deleteBtnText={"Reject"}
            approveBtn={true}
            index={index}
          />
        ))
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
};

export default AllCampaigns;
