import React, { useEffect, useState, Fragment } from "react";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { SlOptionsVertical } from "react-icons/sl";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { TableCell, TableRow } from "@/components/ui/table";

function VolunteerTable(props) {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [user, setUser] = useState(null);

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
        `${import.meta.env.VITE_BASE_URL}/volunteers/approving-volunteer/`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: volunteer.email,
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
        `${import.meta.env.VITE_BASE_URL}/volunteers/rejecting-volunteer/`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: volunteer.email,
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-500"; // Green
      case "Rejected":
        return "text-red-500"; // Red
      case "Pending":
        return "text-orange-500"; // Orange
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Intl.DateTimeFormat("en-US", options).format(
        new Date(dateString)
      );
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div>
      <div>
        <TableCell>{props.index + 1}</TableCell>
        <TableCell>{props.request.typeOfVisit}</TableCell>
        <TableCell>{formatDate(props.request.visitDate)}</TableCell>
        <TableCell>{props.request.visitTime}</TableCell>
        <TableCell>{props.request.totalVisitors}</TableCell>
        <TableCell>{props.request.questions}</TableCell>
        <TableCell>
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1 font-bold">
              <p>{props.request.visitorName}</p>
              <p>{props.request.visitorLastName}</p>
            </div>
            <p>{props.request.email}</p>
          </div>
        </TableCell>
        <TableCell>{props.request.status}</TableCell>
        <TableCell>
          <Menu>
            <MenuButton className="inline-flex items-center gap-2 focus:outline-none">
              <SlOptionsVertical />
            </MenuButton>

            <MenuItems
              transition
              className="w-52 rounded-md px-4 mt-2 py-6 gap-2 flex flex-col border bg-white"
            >
              <MenuItem>
                <button
                  disabled={isDeleting || isApproving}
                  onClick={() => handleApprove(request)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </button>
              </MenuItem>

              <MenuItem>
                <button
                  disabled={isDeleting || isRejecting}
                  onClick={() => handleReject(request)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </TableCell>
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
    </div>
  );
}

export default VolunteerTable;
