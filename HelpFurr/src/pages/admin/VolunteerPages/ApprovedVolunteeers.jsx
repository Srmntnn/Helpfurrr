import React, { useState, useEffect, Fragment } from "react";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "@/styles";
import axios from "axios";
import { Table, TableRow } from "@/components/table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";
import { Dialog, Transition } from "@headlessui/react";

const ApprovedVounteeers = () => {
  const { isCheckingAuth, checkAuth, user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0); // State for total requests
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

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

  // Check auth on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      await checkAuth();
    };
    checkAuthentication();
  }, [checkAuth]);

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/volunteers/approved-visits`
      );
      setRequests(response.data);
      setTotalRequests(response.data.length); // Update total requests count
    } catch (error) {
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data only once when the component mounts
  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle approval
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
  const handleReject = async (volunteer) => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volunteers/rejecting-volunteer/${
          volunteer._id
        }`,
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reject volunteer");
      }

      openModal("Success", "This dog has been successfully rejected!");
      fetchRequests(); // Optionally refetch requests here to update UI
    } catch (err) {
      console.error("Error rejecting volunteer:", err);
      openModal(
        "Oops!... Connection Error",
        err.message || "An error occurred during rejection"
      );
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className={`${styles.paddingX} pt-8`}>
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of <span className="text-main-orange">Approved Volunteers</span>
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
      {loading || isCheckingAuth ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : requests.length > 0 ? (
        <div className="overflow-x-auto w-full rounded-md border mt-8">
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
                {/* <TableHead>Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow key={request._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.typeOfVisit}</TableCell>
                  <TableCell>
                    {new Date(request.visitDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.visitTime}</TableCell>
                  <TableCell>{request.totalVisitors}</TableCell>
                  <TableCell>{request.questions}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-bold">
                        {`${request.visitorName} ${request.visitorLastName}`}
                      </div>
                      <p>{request.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.status}</TableCell>
                  {/* <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <SlOptionsVertical />{" "}
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
                            onClick={() => handleReject(request)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400 w-full"
                          >
                            {isRejecting ? "Rejecting..." : "Reject"}
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Modal for feedback */}
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
        </div>
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
};

export default ApprovedVounteeers;
