import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const DogCards = (props) => {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

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
        `http://localhost:8080/dogs/approving/${props.dog._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
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
        {
          method: "DELETE",
        }
      );
      if (!deleteResponses.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch (err) {
    } finally {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/dogs/delete/${props.dog._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete pet");
      } else {
        setshowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error("Error deleting pet:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="pet-card-pic">
          <img
            src={`http://localhost:8080/images/${props.dog.filename}`}
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
            <b>Owner Email:</b> {props.dog.email}
          </p>
          <p>
            <b>Owner Phone:</b> {props.dog.phone}
          </p>
          <p>
            <b>Condition:</b>
            <span>
              {props.dog.condition &&
                truncateText(props.dog.condition, maxLength)}
              {props.dog.condition?.length > maxLength && ( 
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
            {isDeleting ? <p>Deleting</p> : props.deleteBtnText}
          </button>
          {props.approveBtn ? (
            <button
              disabled={isDeleting || isApproving}
              onClick={handleApprove}
            >
              {isApproving ? <p>Approving</p> : "Approve"}
            </button>
          ) : (
            ""
          )}
        </div>
        {showConditionPopup && (
          <div className="popup">
            <div className="popup-content">
              <h4>Condition:</h4>
              <p>{props.dog.Condition}</p>
            </div>
            <button
              onClick={() => setShowConditionPopup(!showConditionPopup)}
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
              onClick={() => setShowErrorPopup(!showErrorPopup)}
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
                arrange the transfer of the pet from the owner's home to our
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

        {showDeletedSuccess && (
          <div className="popup">
            <div className="popup-content">
              <p>Deleted Successfully from Database...</p>
            </div>
            <button
              onClick={() => {
                setshowDeletedSuccess(!showDeletedSuccess);
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

export default DogCards;
