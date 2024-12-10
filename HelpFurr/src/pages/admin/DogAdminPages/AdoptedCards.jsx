import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const AdoptedCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const HandleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/delete/${props.dog._id}`,
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
    <div className="req-container">
      <div className="pet-view-card grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg bg-white shadow-md">
        <div className="pet-card-pic">
          <img
            src={props.dog.image[0]}
            alt={`${props.dog.name}`}
            className="w-full h-auto rounded-lg"
          />
        </div>

        <div className="pet-card-details flex flex-col justify-between space-y-2">
          <h2 className="text-xl font-bold">{props.dog.name}</h2>
          <p>
            <span className="font-semibold">New Owner Email:</span>{" "}
            {props.dog.email}
          </p>
          <p>
            <span className="font-semibold">New Owner Phone:</span>{" "}
            {props.dog.phone}
          </p>
          <p>
            <span className="font-semibold">Adopted:</span>{" "}
            {formatTimeAgo(props.dog.updatedAt)}
          </p>
        </div>

        <div className="app-rej-btn flex justify-center items-center">
          <button
            onClick={HandleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 text-white font-medium rounded-lg transition ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isDeleting ? "Deleting..." : props.deleteBtnText}
          </button>
        </div>
      </div>

      {/* Popups */}
      {showErrorPopup && (
        <Popup
          message="Oops!... Connection Error"
          onClose={() => setShowErrorPopup(false)}
        />
      )}
      {showApproved && (
        <Popup
          message="Approval Successful"
          details={`Please contact the customer at ${props.dog.email} or ${props.dog.phone} for further steps.`}
          onClose={() => {
            setShowApproved(false);
            props.updateCards();
          }}
        />
      )}
      {showDeletedSuccess && (
        <Popup
          message="Deleted Successfully from Database"
          onClose={() => {
            setshowDeletedSuccess(false);
            props.updateCards();
          }}
        />
      )}
    </div>
  );
};

export default AdoptedCards;
