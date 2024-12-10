import React, { useEffect, useState, Fragment } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { SlOptionsVertical } from "react-icons/sl";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";

const DogCards = (props) => {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showRejected, setShowRejected] = useState(false); // Added state for rejection
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [user, setUser] = useState(null);
  let [isOpen, setIsOpen] = useState(false);
  const [remarks, setRemarks] = useState(""); // State for remarks
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const openRemarksModal = () => {
    setIsRemarksModalOpen(true);
  };

  const closeRemarksModal = () => {
    setIsRemarksModalOpen(false);
    setRemarks("");
  };

  const truncateText = (text, maxLength) => {
    return text.length <= maxLength
      ? text
      : text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/auth/users/`
        );
        setUser(response.data);
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
        `${import.meta.env.VITE_BASE_URL}/dogs/approving/${props.dog._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "Approved" }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowApproved(true);
      }
      setIsOpen(true);
    } catch (err) {
      console.error("Error approving dog:", err);
      setShowErrorPopup(true);
      setIsOpen(true);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/rejecting/${props.dog._id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "Rejected", remarks }), // Send remarks
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setShowRejected(true); // Show rejection message
      }
    } catch (err) {
      console.error("Error rejecting dog:", err);
      setShowErrorPopup(true);
    } finally {
      setIsRejecting(false);
      setIsOpen(true); // Always open modal on response
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/delete/many/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!deleteResponses.ok) {
        throw new Error("Failed to delete forms");
      }
    } catch (err) {
      console.error(err);
      setShowErrorPopup(true); // Show error popup modal
      setIsOpen(true); // Open the error modal
    } finally {
      handleReject();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/delete/${props.dog._id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pet");
      } else {
        setshowDeletedSuccess(true); // Show deleted success popup
        setIsOpen(true); // Open the deleted success modal
      }
    } catch (err) {
      console.error("Error deleting pet:", err);
      setShowErrorPopup(true); // Show error popup modal
      setIsOpen(true); // Open the error modal
    } finally {
      setIsDeleting(false); // Reset the deleting state
    }
  };

  return (
    <div className="req-container">
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle quicksand-regular">
          <div class="border border-gray-200 shadow sm:rounded-lg mt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_80px] md:gap-0 gap-4 p-4">
              <div class="flex flex-col p-4 gap-2">
                <span class="font-semibold text-gray-800 text-sm">#</span>
                <span class="text-gray-600 h-full flex items-center">
                  {props.index + 1}
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2">
                <span class="font-semibold text-gray-800 text-sm">
                  Dog Info
                </span>
                <div className="h-full flex items-center gap-3">
                  <div className="avatar text-gray-600 h-full flex items-center">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={props.dog.image[0]} alt={props.dog.name} />
                    </div>
                  </div>
                  <div className="h-full flex items-center flex-col justify-center">
                    <div className="font-bold text-sm">{props.dog.name}</div>
                    <div className="text-sm opacity-50">{props.dog.age}</div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">
                  Dog Gender
                </span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  {props.dog.gender}
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">
                  Dog Condition
                </span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  {truncateText(props.dog.condition, 40)}
                  {props.dog.condition?.length > 40 && (
                    <span
                      onClick={() => setShowConditionPopup(!showConditionPopup)}
                      className="read-more-btn text-blue-500 cursor-pointer"
                    >
                      Read More
                    </span>
                  )}
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">Status</span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  {props.dog.status}
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">
                  Other Information
                </span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  <div className="flex flex-col capitalize">
                    <p>Vaccinated: {props.dog.vaccinated}</p>
                    <p>Adoption Urgency: {props.dog.urgent}</p>
                    <p>Neutered: {props.dog.neutered}</p>
                  </div>
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">
                  Owner Information
                </span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  <div className="align-middle [&:has([role=checkbox])]:pr-0">
                    <p>{props.dog.postedBy}</p>
                    <p>{props.dog.clientEmail}</p>
                    <p> {props.dog.phone}</p>
                  </div>
                </span>
              </div>
              <div class="flex flex-col p-4 gap-2 ">
                <span class="font-semibold text-gray-800 text-sm">Action</span>
                <span class="text-gray-600 h-full flex items-center capitalize text-sm">
                  <Menu>
                    <MenuButton className="inline-flex items-center gap-2 rounded-md  focus:outline-none">
                      <SlOptionsVertical />
                    </MenuButton>

                    <MenuItems
                      transition
                      anchor="bottom end"
                      className="w-52 origin-top-right rounded-xl border px-6 flex flex-col gap-2 py-6 bg-white  transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                      <button
                        onClick={openRemarksModal}
                        disabled={isRejecting}
                        className="group flex w-full items-center gap-2 quicksand-regular bg-secondary-orange px-4 py-2 rounded-lg text-light-orange hover:bg-main-orange"
                      >
                        <IoClose />
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </button>

                      <MenuItem>
                        {props.approveBtn && (
                          <button
                            disabled={isDeleting || isApproving}
                            onClick={handleApprove}
                            className="bg-green-500 text-white quicksand-regular px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 group flex w-full items-center gap-2 "
                          >
                            <FaCheck />
                            {isApproving ? "Approving..." : "Approve"}
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={deleteFormsAdoptedPet}
                          disabled={isDeleting || isApproving}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 flex items-center gap-2 quicksand-regular w-full"
                        >
                          <MdDelete />
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-black/25" />
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
                    className="text-lg font-medium leading-6 text-gray-900 quicksand-bold"
                  >
                    {showApproved
                      ? "Dog Approved"
                      : showRejected
                      ? "Dog Rejected"
                      : showDeletedSuccess
                      ? "Pet Deleted"
                      : showErrorPopup
                      ? "Oops!... Connection Error"
                      : "Processing"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 quicksand-regular">
                      {showApproved
                        ? "This dog has been approved!"
                        : showRejected
                        ? "This dog has been rejected."
                        : showDeletedSuccess
                        ? "This dog has been successfully deleted."
                        : showErrorPopup
                        ? "There was an issue connecting to the server. Please try again later."
                        : "Please wait while we process your request..."}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-light-orange px-4 py-2 text-sm font-medium text-main-orange hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
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

      <Transition appear show={isRemarksModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeRemarksModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center quicksand-regular">
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
                    className="text-lg font-medium leading-6 text-gray-900 quicksand-bold"
                  >
                    Add Remarks for Rejection
                  </Dialog.Title>
                  <div className="mt-2">
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter remarks here..."
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded-lg"
                      onClick={closeRemarksModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={handleReject}
                      disabled={isRejecting}
                    >
                      {isRejecting ? "Rejecting..." : "Reject"}
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

export default DogCards;
