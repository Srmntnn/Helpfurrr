import React, { useState, useEffect } from "react";
import DogCards from "./DogCards";
import axios from "axios";
import { styles } from "@/styles";
import { useAuthStore } from "@/store/authStore";

const PostingDogs = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [totalUsers, setTotalUsers] = useState(0); // For future usage if needed
  const [totalRequests, setTotalRequests] = useState(0); // State for total requests

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/dogs/requests/`);

      if (response.status === 404 || response.data.length === 0) {
        setError(" No request found.");
        setRequests([]);
      } else {
        setRequests(response.data);
        setTotalRequests(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      if (error.response && error.response.status === 404) {
        setError(" No request available.");
      } else {
        setError(error.message || "An error occurred fetching requests.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className={`${styles.paddingX} pt-8`}>
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md border border-secondary-orange">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of{" "}
            <span className="text-main-orange">Dog Posting Requests</span>
          </h5>
          <h5 className="quicksand-regular">
            Total Post Requests: {totalRequests}
          </h5>
        </div>

        <div className="basis-1/3 py-8 rounded-lg border border-secondary-orange quicksand-regular shadow-md">
          {user ? (
            <div className="flex flex-col text-center w-full">
              <p className="text-main-orange font-bold capitalize text-lg">
                {user.name}
              </p>
              <p>{user.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="quicksand-regular h-[70%] flex items-center justify-center">{error}</p> // Styled error message
      ) : requests.length > 0 ? (
        requests.map((request, index) => (
          <DogCards
            key={request._id}
            dog={request}
            updateCards={fetchRequests}
            deleteBtnText={"Reject"}
            approveBtn={true}
            index={index}
          />
        ))
      ) : (
        <p>No requests available</p> // Empty state message
      )}
    </div>
  );
};

export default PostingDogs;
