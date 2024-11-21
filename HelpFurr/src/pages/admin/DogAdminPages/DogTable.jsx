import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const DogTable = (props) => {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [user, setUser] = useState(null);

  const truncateText = (text, maxLength) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/auth/users/`); // Adjust endpoint as necessary
        setUser(response.data); // Set user data
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const formatTimeAgo = (updatedAt) => {
    return formatDistanceToNow(new Date(updatedAt), { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `http://localhost:8080/dogs/approving/${props.dog._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "Approved", userId: user._id }), // Ensure user._id is defined
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setShowErrorPopup(true);
      } else {
        setShowApproved(true); // Show success popup
      }
    } catch (err) {
      console.error("Error approving dog:", err);
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(
        `http://localhost:8080/form/delete/many/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!deleteResponses.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch (err) {
      console.error(err);
    } finally {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/dogs/delete/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pet");
      } else {
        setshowDeletedSuccess(true);
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      setShowErrorPopup(true); // Show error popup on catch
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="pet-card-pic">
          <img
            src={props.dog.image[0]}
            alt={props.dog.name}
          />
        </div>
        <div className="pet-card-details">
          <h2>{props.dog.name}</h2>
          <p>
            <b>Age:</b> {props.dog.age}
          </p>
          <p>
            <b>Location:</b> {props.dog.shelter}
          </p>
          <p>
            <b>Owner Name:</b> {props.dog.postedBy}
          </p>
          <p>
            <b>Owner Email:</b> {props.dog.email}
          </p>
          <p>
            <b>Owner Phone:</b> {props.dog.phone}
          </p>
          <p>
            <b>Condition:</b>
            <span>
              {truncateText(props.dog.condition, 40)}
              {props.dog.condition?.length > 40 && (
                <span
                  onClick={() => setShowConditionPopup(!showConditionPopup)}
                  className="read-more-btn"
                >
                  Read More
                </span>
              )}
            </span>
          </p>
          <p>{formatTimeAgo(props.dog.updatedAt)}</p>
        </div>
        <div className="app-rej-btn">
          <button
            onClick={deleteFormsAdoptedPet}
            disabled={isDeleting || isApproving}
          >
            {isDeleting ? "Deleting..." : props.deleteBtnText}
          </button>
          {props.approveBtn && (
            <button
              disabled={isDeleting || isApproving}
              onClick={handleApprove}
            >
              {isApproving ? "Approving..." : "Approve"}
            </button>
          )}
        </div>

        {/* Popups */}
        {showConditionPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Condition:</h4>
              <p>{props.dog.condition}</p>
            </div>
            <button
              onClick={() => setShowConditionPopup(false)}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showErrorPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Oops!... Connection Error</p>
            </div>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showApproved && (
          <div className="popup">
            <div className="popup-content">
              <p>Approval Successful...</p>
              <p>
                Please contact the customer at{" "}
                <a href={`mailto:${props.dog.email}`}>{props.dog.email}</a> or{" "}
                <a href={`tel:${props.dog.phone}`}>{props.dog.phone}</a> to
                arrange the transfer of the pet.
              </p>
            </div>
            <button
              onClick={() => {
                setShowApproved(false);
                props.updateCards();
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDeletedSuccess && (
          <div className="popup">
            <div className="popup-content">
              <p>Deleted Successfully from Database...</p>
            </div>
            <button
              onClick={() => {
                setshowDeletedSuccess(false);
                props.updateCards();
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogTable;
