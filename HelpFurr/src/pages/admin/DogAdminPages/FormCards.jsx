import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setShowRejectPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [remarks, setRemarks] = useState(""); // New state for remarks

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const closeModal = () => {
    setShowErrorPopup(false);
    setShowApproved(false);
    setShowDeletedSuccess(false);
    setShowDetailsPopup(false);
    setShowRejectPopup(false); // Fix: closing the reject popup when closing modal
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/approve/${props.form._id}`, // Make sure the correct endpoint is used for approval
        {
          method: "PUT",
          body: JSON.stringify({
            status: "adopted", // Mark as adopted
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
    } catch {
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  };

  const deleteFormAdoptedPet = async () => {
    try {
      const deleteResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/delete/many/${props.form.dogId}`,
        { method: "DELETE" }
      );
      if (!deleteResponse.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch {
      // Handle errors silently if needed
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!remarks) {
      toast.error("Please provide remarks for rejection."); // Display error if remarks are empty
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/reject/${props.form._id}`,
        {
          method: "PUT", // Changed to PUT to update status instead of DELETE
          body: JSON.stringify({
            status: "rejected",
            remarks: remarks, // Sending remarks with the rejection request
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error("Failed to reject form");
      } else {
        setShowDeletedSuccess(true);
        closeModal(); // Close the modal after successful rejection
      }
    } catch {
      setShowErrorPopup(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="overflow-auto">
      <div className="overflow-x-auto w-full p-4">
        <div className="flex flex-wrap justify-between gap-4 border p-4 rounded-md">
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Adoptor Name:</b> {props.form.adopterName}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Adoptor Email:</b> {props.form.email}
          </div>
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Adoptor Phone Number:</b> {props.form.phoneNo}
          </div>
          {/* Other Details */}
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Updated:</b> {formatTimeAgo(props.form.updatedAt)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => setShowRejectPopup(true)}
            disabled={isDeleting || isApproving}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {isDeleting ? "Rejecting..." : "Reject"}
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
              {isApproving ? "Approving..." : "Approve"}
            </button>
          )}
        </div>

        {/* Popups */}
        <Transition
          appear
          show={
            showErrorPopup ||
            showApproved ||
            showDeletedSuccess ||
            showDetailsPopup ||
            isRejecting
          }
          as={Fragment}
        >
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-lg shadow-md quicksand-regular">
                {showErrorPopup && <p>Oops! Connection Error.</p>}
                {showApproved && (
                  <div>
                    <p>Pet is Adopted Successfully...</p>
                    <p>
                      Please contact the Adopter at{" "}
                      <a href={`mailto:${props.form.email}`}>
                        {props.form.email}
                      </a>{" "}
                      or{" "}
                      <a href={`tel:${props.form.phoneNo}`}>
                        {props.form.phoneNo}
                      </a>{" "}
                      to arrange the transfer of the pet from our adoption
                      center to their house.
                    </p>
                  </div>
                )}
                {showDeletedSuccess && <p>Request Rejected Successfully.</p>}
                {showDetailsPopup && (
                  <div className="quicksand-regular">
                    <h2>
                      <b>Dog name: </b>
                      {props.dog.name}
                    </h2>
                    <div className="w-full h-px bg-gray-200 my-2"></div>
                    {/* Details */}
                    <div className="flex flex-col gap-1 ml-2">
                      <p>
                        <b>Adoptor name: </b>
                        {props.form.adopterName}
                      </p>
                      <p>
                        <b>Adoptor Email: </b>
                        {props.form.email}
                      </p>
                      <p>
                        <b>Adoptor Phone Number: </b>
                        {props.form.phoneNo}
                      </p>
                      <p>
                        <b>Contact Reference Number: </b>
                        {props.form.contactReference}
                      </p>
                      <p>
                        <b>Adoptor Occupation: </b>
                        {props.form.occupation}
                      </p>
                      <div className="w-[80%] mx-auto h-px bg-gray-200 my-2"></div>

                      <p>
                        <b>Living Situation: </b>
                        {props.form.livingSituation}
                      </p>
                      <p>
                        <b>Previous Dog Experience: </b>
                        {props.form.previousExperience}
                      </p>
                      <p>
                        <b>Complete Address: </b>
                        {props.form.address}
                      </p>
                      <p>
                        <b>
                          Any of your family members who are allergic to dog?:{" "}
                        </b>
                        {props.form.familyAllergic}
                      </p>
                      <p>
                        <b>
                          Are you in favor of neutering/spaying your petto avoid
                          unwanted litters/pups?:{" "}
                        </b>
                        {props.form.neutering}
                      </p>
                      <p>
                        <b>Are you renting an apartment?: </b>
                        {props.form.renting}
                      </p>
                      <p>
                        <b>Other Pets: </b>
                        {props.form.familyComposition}
                      </p>
                    </div>
                    <div>
                      <img src={props.form.image[0]} alt="" />
                    </div>
                  </div>
                )}

                {isRejecting && (
                  <div>
                    <label htmlFor="remarks" className="font-bold">
                      Remarks:
                    </label>
                    <textarea
                      id="remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full p-2 border rounded-md mt-2"
                      placeholder="Provide a reason for rejection"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleReject}
                        disabled={isDeleting}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        {isDeleting ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={closeModal}
                  className="mt-4 bg-main-orange text-light-orange px-4 py-2 rounded-lg quicksand-regular"
                >
                  Close
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormCard;
