import React, { useState, useEffect } from "react";
import DogCards from "./DogCards";
import axios from 'axios';

const PostingDogs = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/dogs/requests/');
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
          <DogCards
            key={request._id}
            dog={request}
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
};

export default PostingDogs;