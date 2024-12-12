import React, { useState, Fragment } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, Transition } from "@headlessui/react";

const AdoptedCards = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupDetails, setPopupDetails] = useState("");
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
        throw new Error("Failed to delete pet");
      } else {
        setPopupMessage("Deleted Successfully");
        setPopupDetails(
          "The pet has been successfully deleted from the database."
        );
        setShowPopup(true);
      }
    } catch (err) {
      setPopupMessage("Oops!... Connection Error");
      setPopupDetails(
        "There was an issue connecting to the server. Please try again later."
      );
      setShowPopup(true);
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

      {/* Popup Modal */}
      <Transition appear show={showPopup} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setShowPopup(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {popupMessage}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{popupDetails}</p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-light-orange px-4 py-2 text-sm font-medium text-main-orange hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setShowPopup(false);
                        if (popupMessage === "Deleted Successfully") {
                          props.updateCards(); // Update cards after deletion
                        }
                      }}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdoptedCards;
