import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/approving/${props.form.dogId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: props.form.email,
            phone: props.form.phoneNo,
            status: "Adopted",
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
      deleteFormAdoptedPet();
    }
  };

  const deleteFormAdoptedPet = async () => {
    try {
      const deleteResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/delete/many/${props.form.dogId}`,
        {
          method: "DELETE",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch (err) {
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/reject/${props.form._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to delete form");
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error("Error deleting form:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-auto">
      <div className="overflow-x-auto w-full p-4">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Email:</b> {props.form.email}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Phone Number:</b> {props.form.phoneNo}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Living Situation:</b> {props.form.livingSituation}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Previous Pet Experience:</b> {props.form.previousExperience}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Having Other Pets?</b> {props.form.familyComposition}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Updated:</b> {formatTimeAgo(props.form.updatedAt)}
          </div>
        </div>

        <div className="app-rej-btn mt-4 flex flex-wrap gap-4">
          <button
            onClick={handleReject}
            disabled={isDeleting || isApproving}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {isDeleting ? <p>Deleting</p> : props.deleteBtnText}
          </button>
          <button
            onClick={() => setShowDetailsPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Full
          </button>
          {props.approveBtn && (
            <button
              onClick={handleApprove}
              disabled={isDeleting || isApproving}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {isApproving ? <p>Approving</p> : "Approve"}
            </button>
          )}
        </div>

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
              <p>Pet is Adopted Successfully...</p>
              <p>
                Please contact the Adopter at{" "}
                <a href={`mailto:${props.form.email}`}>{props.form.email}</a> or{" "}
                <a href={`tel:${props.form.phoneNo}`}>{props.form.phoneNo}</a>{" "}
                to arrange the transfer of the pet from our adoption center to
                their house.
              </p>
            </div>
            <button
              onClick={() => {
                props.updateCards();
                setShowApproved(!showApproved);
                runEvent();
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
              <p>Request Rejected Successfully...</p>
            </div>
            <button
              onClick={() => {
                setShowDeletedSuccess(!showDeletedSuccess);
                props.updateCards();
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {showDetailsPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>{props.dog.name}</h2>
              <p>
                <b>Email:</b> {props.form.email}
              </p>
              <p>
                <b>Phone Number:</b> {props.form.phoneNo}
              </p>
              <p>
                <b>Living Situation:</b> {props.form.livingSituation}
              </p>
              <p>
                <b>Previous Pet Experience:</b> {props.form.previousExperience}
              </p>
              <p>
                <b>Having Other Pets?</b> {props.form.familyComposition}
              </p>
              <p>{formatTimeAgo(props.form.updatedAt)}</p>
            </div>
            <button
              onClick={() => setShowDetailsPopup(false)}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormCard;
