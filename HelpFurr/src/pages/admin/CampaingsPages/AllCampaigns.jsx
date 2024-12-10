import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/authStore";
import { styles } from "@/styles";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import Modal from "@/components/Modal";
import { format } from "date-fns";
import { toast } from "@/components/use-toast";
import { Label } from "@/components/label";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { SlOptionsVertical } from "react-icons/sl";


const AllCampaigns = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals and data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "view", "edit", or "addCost"
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [budgetItem, setBudgetItem] = useState("");
  const [budgetCost, setBudgetCost] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchRequests();
  }, [checkAuth]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/get-all-campaigns`
      );
      setRequests(response.data || []);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    format(new Date(dateString), "MMMM do, yyyy");

  const openModal = (type, data = null) => {
    setModalType(type);
    if (type === "view") setSelectedDescription(data);
    if (type === "edit" || type === "addCost") setSelectedCampaign(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
    setSelectedDescription("");
    setBudgetItem("");
    setBudgetCost(0);
  };

  const handleUpdateCampaign = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/edit-campaign/${
          selectedCampaign._id
        }`,
        selectedCampaign
      );
      toast({
        title: "Successful!",
        description: "Campaign Updated Successfully!",
      });
      fetchRequests();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error updating campaign");
    }
  };

  const handleAddCost = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/${
          selectedCampaign._id
        }/post-budget-usage`,
        { item: budgetItem, cost: budgetCost }
      );
      toast({
        title: "Successful!",
        description: "Budget Usage Added Successfully!",
      });
      fetchRequests();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error adding budget usage");
    }
  };

  return (
    <div className={`${styles.paddingX} pt-8 relative overflow-hidden`}>
      {loading || isCheckingAuth ? (
        <p>Loading...</p>
      ) : error ? (
        <div>
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchRequests} className="retry-button">
            Retry
          </button>
        </div>
      ) : requests.length > 0 ? (
        <div className="overflow-x-auto w-full">
          <Table className="divide-y divide-gray-200 border rounded-md quicksand-regular">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Min Donation</TableHead>
                <TableHead>Total Donation</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow key={request._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={request.image[0]} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{request.campaignName}</TableCell>
                  <TableCell>{formatDate(request.campDeadline)}</TableCell>
                  <TableCell>{request.maxDonation}</TableCell>
                  <TableCell>{request.totalDonations}</TableCell>
                  <TableCell>{request.campaignCategory}</TableCell>
                  <TableCell>
                    {request.longDescription.length > 30
                      ? `${request.longDescription.substring(0, 30)}...`
                      : request.longDescription}
                    {request.longDescription.length > 30 && (
                      <button
                        onClick={() =>
                          openModal("view", request.longDescription)
                        }
                        className="text-blue-500 ml-2"
                      >
                        Read More
                      </button>
                    )}
                  </TableCell>
                  <TableCell>{request.author}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Menu>
                      <MenuButton className="inline-flex items-center gap-2 focus:outline-none">
                        <SlOptionsVertical />
                      </MenuButton>

                      <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 origin-top-right rounded-md px-4 mt-2 py-5 gap-2 flex flex-col border bg-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                      >
                        <MenuItem>
                          <button
                            onClick={() => openModal("edit", request)}
                            className=" bg-light-orange flex w-full items-center gap-2 rounded-md py-1.5 px-3 quicksand-regular text-sm text-main-orange"
                          >
                            Edit
                          </button>
                        </MenuItem>

                        <MenuItem>
                          <button
                            onClick={() => openModal("addCost", request)}
                            className="bg-light-orange flex w-full items-center gap-2 rounded-md py-1.5 px-3 quicksand-regular text-sm text-main-orange"
                          >
                            Add Cost
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Modal
            className="quicksand-semi-bold"
            isOpen={isModalOpen}
            closeModal={closeModal}
            title={
              modalType === "view"
                ? "Description"
                : modalType === "edit"
                ? "Edit Campaign"
                : "Add Budget Usage"
            }
          >
            {modalType === "view" && (
              <p className="quicksand-semi-bold">{selectedDescription}</p>
            )}
            {modalType === "edit" && (
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 mt-4">
                  <Label>Campaign Name</Label>
                  <Input
                    type="text"
                    value={selectedCampaign?.campaignName || ""}
                    onChange={(e) =>
                      setSelectedCampaign({
                        ...selectedCampaign,
                        campaignName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Description</Label>
                  <Input
                    type="text"
                    value={selectedCampaign?.longDescription || ""}
                    onChange={(e) =>
                      setSelectedDescription({
                        ...selectedCampaign,
                        campaignName: e.target.value,
                      })
                    }
                  />
                </div>
                {/* Add other fields similarly */}
                <Button
                  onClick={handleUpdateCampaign}
                  className="w-full hover:text-light-orange quicksand-semi-bold"
                >
                  Save
                </Button>
              </form>
            )}
            {modalType === "addCost" && (
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 mt-4">
                  <Label>Item</Label>
                  <Input
                    type="text"
                    value={budgetItem}
                    onChange={(e) => setBudgetItem(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Cost</Label>
                  <Input
                    type="number"
                    value={budgetCost}
                    onChange={(e) => setBudgetCost(e.target.value)}
                    className=""
                  />
                </div>
                <Button
                  onClick={handleAddCost}
                  className="w-full hover:text-light-orange quicksand-semi-bold"
                >
                  Add Cost
                </Button>
              </form>
            )}
          </Modal>
        </div>
      ) : (
        <p>No requests available</p>
      )}
    </div>
  );
};

export default AllCampaigns;
