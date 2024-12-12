import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

function VolunteerCard(props) {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/volunteers/approving-volunteer/${props.volunteer._id}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    email: props.volunteer.email, // Ensure you're sending email
                    status: "Approved",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            setShowErrorPopup(true);
        } else {
            setShowApproved(true);
        }
    } catch (err) {
        console.error("Error approving volunteer:", err);
        setShowErrorPopup(true);
    } finally {
        setIsApproving(false);
    }
};

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volunteers/rejecting-campaign/${props.volunteer._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: "Rejected",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowReject(true);
      }
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      setShowErrorPopup(true);
    } finally {
      setIsRejecting(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaign/delete-campaign/${props.campaign._id}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Failed to delete forms");
      }
      // Optionally handle success here
      setDeletedSuccess(true); // Set success state if needed
    } catch (err) {
      console.error("Error deleting campaign:", err);
      setShowErrorPopup(true); // Show error popup on failure
    } finally {
      handleReject(); // Call reject after deletion attempt
      setIsDeleting(false); // Reset deleting state
    }
  };

  return (
    <div className="req-container">
      <div className="pet-view-card">
        <div className="pet-card-details">
          <p>
            <b>Type of Visit:</b> {props.volunteer.typeOfVisit}
          </p>
          <div>
            <b>Appointment:</b>
            <p>{props.volunteer.visitDate}</p>
            <p>{props.volunteer.visitTime}</p>
          </div>

          <p>
            <b>Author Name:</b> {props.volunteer.visitorName}
          </p>
          <p>
            <b>Author Email:</b> {props.volunteer.email}
          </p>

          <p>
            <b>Description:</b>
            <span>
              {props.volunteer.questions &&
                truncateText(props.volunteer.questions, maxLength)}
              {props.volunteer.questions?.length > maxLength && (
                <span
                  onClick={() => setShowConditionPopup(!showConditionPopup)}
                  className="read-more-btn"
                >
                  Read More
                </span>
              )}
            </span>
          </p>
          <p>{formatTimeAgo(props.volunteer.updatedAt)}</p>
        </div>
        <div className="app-rej-btn">
          <button onClick={handleReject} disabled={isRejecting || isApproving}>
            {isRejecting ? <p>Rejecting...</p> : props.deleteBtnText}
          </button>
          {props.approveBtn && (
            <button
              disabled={isRejecting || isApproving}
              onClick={handleApprove}
            >
              {isApproving ? <p>Approving...</p> : "Approve"}
            </button>
          )}
        </div>

        {/* Condition Popup */}
        {showConditionPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Description:</h4>
              <p>{props.volunteer.questions}</p>
            </div>
            <button
              onClick={() => setShowConditionPopup(!showConditionPopup)}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Error Popup */}
        {showErrorPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Oops!... Connection Error</p>
            </div>
            <button
              onClick={() => setShowErrorPopup(!showErrorPopup)}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Approved Popup */}
        {showApproved && (
          <div className="popup">
            <div className="popup-content">
              <p>Approval Successful</p>
              <p>
                Please contact the customer at{" "}
                <a href={`mailto:${props.volunteer.email}`}>
                  {props.volunteer.email}
                </a>{" "}
                to arrange the transfer of the pet from the owner's home to our
                adoption center.
              </p>
            </div>
            <button
              onClick={() => {
                setShowApproved(!showApproved);
                props.updateCards();
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Reject Popup */}
        {showReject && (
          <div className="popup">
            <div className="popup-content">
              <p>Rejection Successful</p>
            </div>
            <button
              onClick={() => {
                setShowReject(!showReject);
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
}

export default VolunteerCard;
