import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";

const FormCard = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejecting, setShowRejectPopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [remarks, setRemarks] = useState("");

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const closeModal = () => {
    setShowErrorPopup(false);
    setShowApproved(false);
    setShowDeletedSuccess(false);
    setShowDetailsPopup(false);
    setShowRejectPopup(false);
  };

  const updateStatus = async (status) => {
    setIsUpdating(true);
    try {
      const requestBody = { status };

      if (status === "waiting for owner") {
        const appointmentDate = prompt("Enter Appointment Date (YYYY-MM-DD):");
        if (!appointmentDate) {
          toast.error("Appointment date is required!");
          setIsUpdating(false);
          return;
        }
        requestBody.appointmentDate = appointmentDate;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/approve/${props.form._id}`,
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error in approval:", errorData.message); // Log the error message from the backend
        setShowErrorPopup(true); // Trigger the error popup if the status update fails
      } else {
        setShowApproved(true); // Show success message if the status update is successful
      }
    } catch (err) {
      console.error("Error in updateStatus:", err);
      setShowErrorPopup(true); // Show error popup if there is an issue in the request
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!remarks) {
      toast.error("Please provide remarks for rejection.");
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/reject/${props.form._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: "rejected",
            remarks,
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
        props.fetchFormData(); // Fetch updated data after rejection
        setShowDeletedSuccess(true);
        closeModal();
      }
    } catch {
      setShowErrorPopup(true);
    } finally {
      setIsUpdating(false);
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
          <div className="flex flex-col w-full sm:w-1/2 lg:w-1/3">
            <b>Updated:</b> {formatTimeAgo(props.form.updatedAt)}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={() => setShowRejectPopup(true)}
            disabled={isUpdating}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {isUpdating ? "Processing..." : "Reject"}
          </button>
          <button
            onClick={() => setShowDetailsPopup(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Full
          </button>
          {props.form.status === "pending" && (
            <button
              onClick={() => updateStatus("waiting for owner")}
              disabled={isUpdating}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              {isUpdating ? "Processing..." : "Set Appointment"}
            </button>
          )}
          {props.form.status === "waiting for owner" && (
            <button
              onClick={() => updateStatus("adopted")}
              disabled={isUpdating}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {isUpdating ? "Processing..." : "Approve"}
            </button>
          )}
        </div>

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
                {showApproved && <p>Status Updated Successfully.</p>}
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
                        disabled={isUpdating}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      >
                        {isUpdating ? "Processing..." : "Reject"}
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
