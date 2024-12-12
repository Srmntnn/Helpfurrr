import React, { Fragment, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../../../components/button";
import { SlOptionsVertical } from "react-icons/sl";
import { Dialog, Transition } from "@headlessui/react";

function CampaignTable(props) {
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showReject, setShowReject] = useState(false);

  let [isOpen, setIsOpen] = useState(false);

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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/rejecting-campaign/${props.campaign._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
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
    <section>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Campaign Name</th>
              <th>Maximum Donation</th>
              <th>Status</th>
              <th>Campaign Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>{props.index + 1}</th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {props.campaign.campaignName}
                    </div>
                    <div className="text-sm opacity-50 capitalize">
                      {formatTimeAgo(props.campaign.updatedAt)}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                &#x20B1;
                {props.campaign.maxDonation}
                <br />
                <span className="badge badge-ghost badge-sm">
                  Desktop Support Technician
                </span>
              </td>
              <td>
                <span className="rounded-full bg-secondary-orange py-1 px-2 text-[12px]">
                  {props.campaign.status}
                </span>
              </td>
              <td className="capitalize">{props.campaign.campaignCategory}</td>
              <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                <button
                  onClick={openModal}
                  className="hover:text-main-brown text-main-orange"
                >
                  <SlOptionsVertical className=" " />
                </button>
              </td>
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
                            Detailed Description
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 quicksand-regular">
                              {props.campaign.longDescription}
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
            </tr>
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>#</th>
              <th>Campaign Name</th>
              <th>Maximum Donation</th>
              <th>Status</th>
              <th>Campaign Category</th>
              <th>Action</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default CampaignTable;
