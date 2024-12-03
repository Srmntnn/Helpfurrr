import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "@/styles";
import axios from "axios"; // Import axios
import VolunteerCard from "./VolunteerCard";

const AllVolunteers = () => {
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/volunteers/all-volunteer"
      );
      setRequests(response.data);
      setError(null); // Clear any previous errors on success
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
    <div className={`${styles.paddingX} pt-8`}>
      {loading || isCheckingAuth ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : requests.length > 0 ? (
        requests.map((request, index) => (
          <VolunteerCard
            key={request._id}
            volunteer={request} // Pass correct prop
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

export default AllVolunteers;
