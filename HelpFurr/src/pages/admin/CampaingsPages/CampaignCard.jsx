import React, { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";

function CampaignCard(props) {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
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

  const formatCampaignDeadline = (deadline) => {
    try {
      return format(new Date(deadline), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/approving-campaign/${props.campaign._id}`,
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

  const HandlePause = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/rejecting-campaign/${props.campaign._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: "Paused",
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
      setShowErrorPopup(true);
    } finally {
      setIsRejecting(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaign/delete-campaign/${props.campaign._id}`,
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
  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="pet-card-pic"></div>
        <div className="pet-card-details">
          <h2>{props.campaign.name}</h2>
          <p>
            <b>Campaign Name</b> {props.campaign.campaignName}
          </p>
          <p>
            <b>Campaign Deadline:</b>{" "}
            {formatCampaignDeadline(props.campaign.campDeadline)}
          </p>
          <p>
            <b>Status</b> {props.campaign.status}
          </p>
          <p>
            <b>Author</b> {props.campaign.author}
          </p>
          <p>
            <b>Description</b>
            <span>
              {props.campaign.longDescription &&
                truncateText(props.campaign.longDescription, maxLength)}
              {props.campaign.longDescription?.length > maxLength && (
                <span
                  onClick={() => setShowConditionPopup(!showConditionPopup)}
                  className="read-more-btn"
                >
                  Read More
                </span>
              )}
            </span>
          </p>
          <p>{formatTimeAgo(props.campaign.updatedAt)}</p>
        </div>
        <div className="app-rej-btn">
          <button onClick={HandlePause} disabled={isRejecting || isApproving}>
            {isRejecting ? <p>Pause</p> : <p>Pause</p>}
          </button>
          {props.approveBtn ? (
            <button
              disabled={isRejecting || isApproving}
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
              <h4>Description:</h4>
              <p>{props.campaign.longDescription}</p>
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
              <p>Approving Successful</p>
              <p>
                Please contact the customer at{" "}
                <a href={`mailto:${props.campaign.email}`}>
                  {props.campaign.email}
                </a>
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

        {showReject && (
          <div className="popup">
            <div className="popup-content">
              <p>Rejecting Successful</p>
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

export default CampaignCard;
