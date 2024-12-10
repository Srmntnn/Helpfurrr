import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { styles } from "@/styles";
import { useAuthStore } from "@/store/authStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, Transition } from "@headlessui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";

const VolunteerRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0); // For future usage if needed
  const [totalRequests, setTotalRequests] = useState(0); // State for total requests

  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isRemarksModalOpen, setIsRemarksModalOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState(null);

  function closeModal() {
    setIsOpen(false);
    // Reset modal message and title when closing
    setModalMessage("");
    setModalTitle("");
  }

  function openModal(title, message) {
    setModalTitle(title);
    setModalMessage(message);
    setIsOpen(true);
  }

  const openRemarksModal = (volunteer) => {
    setCurrentVolunteer(volunteer);
    setIsRemarksModalOpen(true);
  };

  const closeRemarksModal = () => {
    setIsRemarksModalOpen(false);
    setRemarks("");
    setCurrentVolunteer(null);
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/volunteers/requests/`
      );
      setRequests(response.data);
      setTotalRequests(response.data.length); // Update total requests count
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const handleApprove = async (volunteer) => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volunteers/approving-volunteer/${
          volunteer._id
        }`,
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
        const errorText = await response.text();
        throw new Error(`Failed to approve volunteer: ${errorText}`);
      }

      openModal("Success", "This dog has been approved!");
      fetchRequests(); // Optionally refetch requests here to update UI
    } catch (err) {
      console.error("Error approving volunteer:", err);
      openModal(
        "Oops!... Connection Error",
        err.message || "An error occurred during approval"
      );
    } finally {
      setIsApproving(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!remarks) {
      alert("Please provide remarks for rejection.");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volunteers/rejecting-volunteer/${
          currentVolunteer._id
        }`,
        {
          method: "PUT",
          body: JSON.stringify({
            email: currentVolunteer.email,
            status: "Rejected",
            remarks,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject volunteer");
      }

      closeRemarksModal();
      openModal("Success", "The volunteer's visit request has been rejected.");
      fetchRequests(); // Refresh the requests list
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      openModal("Error", err.message || "An error occurred during rejection.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className={`${styles.paddingX} pt-8`}>
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of <span className="text-main-orange">Volunteer Request</span>
          </h5>
          <h5 className="quicksand-regular">Total Requests: {totalRequests}</h5>
        </div>

        <div className="basis-1/3 py-8 rounded-lg border border-secondary-orange quicksand-regular shadow-md">
          {user ? (
            <div className="flex flex-col text-center w-full">
              <p className="text-main-orange font-bold capitalize text-lg">
                {user.name}
              </p>
              <p>{user.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : requests.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-md  mt-8">
          <ScrollArea className="sm:w-full w-[768px] whitespace-nowrap rounded-md border">
            <Table className="divide-y divide-gray-200 quicksand-regular overflow-x-auto rounded-lg">
              <TableHeader className="quicksand-bold">
                <TableRow className="text-main-orange">
                  <TableHead>#</TableHead>
                  <TableHead>Type of Visit</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Visit Time</TableHead>
                  <TableHead>Total Visitors</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={request._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{request.typeOfVisit}</TableCell>
                    <TableCell>{formatDate(request.visitDate)}</TableCell>
                    <TableCell>{request.visitTime}</TableCell>
                    <TableCell>{request.totalVisitors}</TableCell>
                    <TableCell>{request.questions}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-col">
                        <div className="flex gap-1 font-bold">
                          <p>{request.visitorName}</p>
                          <p>{request.visitorLastName}</p>
                        </div>
                        <p>{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <SlOptionsVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <button
                              disabled={isApproving || isRejecting}
                              onClick={() => handleApprove(request)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 w-full"
                            >
                              {isApproving ? "Approving..." : "Approve"}
                            </button>{" "}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <button
                              disabled={isApproving || isRejecting}
                              onClick={() => openRemarksModal(request)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 w-full"
                            >
                              Reject
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : (
        <p>No requests available</p>
      )}
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
                    {modalTitle}
                  </Dialog.Title>

                  <div className="mt-2">
                    <p className="text-sm text-gray-500 quicksand-regular">
                      {modalMessage}
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

export default VolunteerRequest;
