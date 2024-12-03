import React, { useState, useEffect } from "react";
import DogCards from "./DogCards";
import { useAuthStore } from "../../../store/authStore";
import DogTable from "./DogTable"; // Assuming you intend to use this somewhere
import { styles } from "@/styles";
import axios from "axios"; // Import axios

const AllDogs = () => {
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
        `${import.meta.env.VITE_BASE_URL}/dogs/all-dogs`
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
          <DogTable
            key={request._id}
            dog={request}
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

export default AllDogs;
