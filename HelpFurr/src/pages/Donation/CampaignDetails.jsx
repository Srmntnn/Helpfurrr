import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdOutlineAttachEmail, MdShareLocation } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useAuthStore } from "../../store/authStore"; // Assuming you have an auth store
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { FaArrowLeftLong } from "react-icons/fa6";
import { styles } from "@/styles";
import { format } from "date-fns";
import { Input } from "@/components/input";

function CampaignDetails() {
  const { user } = useAuthStore();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");

  const togglePopup = () => setShowPopup(!showPopup);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/campaigns/get-campaignbyid/${campaignId}`
        );
        if (response.data.image && response.data.image.length > 0) {
          setMainImage(response.data.image[0]);
        }
        console.log("Fetched campaign data:", response.data);
        setCampaign(response.data);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        setError(error);
      }
    };

    if (campaignId) fetchCampaign();
  }, [campaignId]);

  const handleDonate = async () => {
    try {
      // Check if all required fields are filled
      if (!donorName || !donorEmail || !amount) {
        console.error("All donation fields must be filled out.");
        return;
      }

      // Make the API call to create the donation (Payment Link)
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/donations/donate`, // Replace with your backend URL
        {
          campaignId,
          donorName,
          donorEmail,
          amount,
        }
      );

      console.log("API Response:", response.data);

      // Destructure checkoutUrl and donationId from the response
      const { checkoutUrl, donationId } = response.data;

      if (!checkoutUrl) {
        console.error("Checkout URL is missing in the response");
        return;
      }

      // Redirect the user to PayMongo checkout to complete the payment
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(
        "Donation failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const formatDate = (dateString) =>
    format(new Date(dateString), "MMMM do, yyyy");

  return (
    <section className={`${styles.paddingX} pt-[78px]`}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="max-w-screen-xl mx-auto">
        <Helmet>
          <title>HelpFurr | {`${campaign?.campaignName}`}</title>
        </Helmet>
        {error ? (
          <p>Error fetching campaign data: {error.message}</p>
        ) : (
          campaign && (
            <div>
              <div className="flex gap-12 sm:gap-12 flex-col md:flex-row mt-14">
                {/* Campaign Image */}
                <div className="flex-1 flex flex-col-reverse gap-3 md:flex-row">
                  <div className="w-full md:w-[100%]">
                    <div className="relative rounded-md overflow-hidden border">
                      <img className="w-full h-auto" src={mainImage} alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 fredoka-bold tracking-wider text-secondary-orange">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                          {campaign.campaignName}
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg font-medium quicksand-bold text-light-orange">
                          {formatDate(campaign.campDeadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="basis-1/2">
                  <div className="flex flex-col w-full ">
                    <p className="quicksand-regular badge gap-1 text-green-400">
                      <span className="font-bold text-main-brown">Status:</span>{" "}
                      {campaign.status}
                    </p>
                    <button className="w-full hover:text-main-orange transition duration-300">
                      <Link to="/campaigns" className="w-full flex justify-end">
                        <div className="p-3 quicksand-regular flex items-center gap-2 text-secondary-brown hover:text-main-orange transition duration-300 hover:bg-light-orange rounded-sm">
                          <FaArrowLeftLong />
                          Back to list
                        </div>
                      </Link>
                    </button>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl fredoka-bold tracking-wider text-secondary-brown">
                      About{" "}
                      <span className="text-main-orange">
                        {campaign.campaignName}
                      </span>
                    </h2>
                  </div>

                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-base lg:text-lg quicksand-regular mt-2 mb-4">
                      {campaign?.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-col border rounded-lg p-4 space-y-2 quicksand-regular mt-4">
                    <h1 className="text-base md:text-lg lg:text-xl quicksand-bold">
                      Post Author Info:
                    </h1>
                    <hr />
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-base lg:text-lg inline-flex gap-2 items-center">
                      <IoPersonCircleOutline /> {campaign.author}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-4 quicksand-regular">
                    <p className="text-gray-500 dark:text-gray-400 text-base lg:text-lg inline-flex gap-2 items-center">
                      <MdShareLocation /> {campaign.longDescription}
                    </p>
                  </div>

                  <div className="space-y-4 md:space-y-5 mt-4">
                    <h2 className="text-base md:text-lg lg:text-xl fredoka-medium text-main-brown">
                      Details
                    </h2>
                    <div>
                      <h1 className="quicksand-regular">
                        <span className="font-bold text-main-brown">
                          Minimum Donation:{" "}
                        </span>
                        P{campaign.maxDonation}
                      </h1>
                      <p className=" dark:text-gray-400 text-base md:text-base font-bold inline-flex gap-2 items-center quicksand-regular  text-main-brown">
                        <LuCalendarDays />{" "}
                        {moment(campaign?.author?.postedTime).format(
                          "MMMM Do YYYY"
                        )}
                      </p>
                      <p className="quicksand-regular ">
                        <span className="font-bold text-main-brown">
                          Campaign Deadline:
                        </span>{" "}
                        {formatDate(campaign.campDeadline)}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <div className="bg-light-orange mt-6 quicksand-semi-bold w-full text-center md:py-4 md:px-6 py-3 px-4 rounded-lg text-main-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm">
                        <button>Continue</button>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Donate</DialogTitle>
                        <DialogDescription>
                          <div className="space-y-4 mt-4">
                            <Input
                              type="text"
                              placeholder="Donor Name"
                              value={donorName}
                              onChange={(e) => setDonorName(e.target.value)}
                              className="border p-2 rounded"
                            />
                            <Input
                              type="email"
                              placeholder="Donor Email"
                              value={donorEmail}
                              onChange={(e) => setDonorEmail(e.target.value)}
                              className="border p-2 rounded"
                            />
                            <Input
                              type="number"
                              placeholder="Enter donation amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="border p-2 rounded"
                            />
                          </div>

                          <div
                            className={`bg-main-orange mt-6 quicksand-semi-bold text-center cursor-pointer md:py-4 md:px-6 py-3 px-4 rounded-lg text-light-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm ${
                              campaign.status === "Paused"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <button
                              onClick={handleDonate}
                              disabled={
                                !donorName ||
                                !donorEmail ||
                                !amount ||
                                campaign.status === "Paused"
                              }
                              className="flex h-full w-full justify-center"
                            >
                              Donate
                            </button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div>
                <div className="flex gap-2 items-center mt-10">
                  <h1 className="fredoka-bold tracking-wider md:text-3xl text-lg text-main-orange">
                    Donations
                  </h1>
                  <div className="flex max-w-40 w-full h-0.5 mt-2 rounded-full bg-main-orange"></div>
                </div>

                <p className="quicksand-semi-bold text-secondary-brown">
                  This is where your donations go.
                </p>
                <div>
                  {Array.isArray(campaign.budgetUsage) &&
                  campaign.budgetUsage.length > 0 ? (
                    <div>
                      <div className="sm:py-6 py-4 px-6 pt-6 grid grid-cols-1 mt-4 overflow-hidden md:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-4 w-full items-center place-content-center md:place-items-center place-items-start border rounded-b-none rounded-md relative">
                        {campaign.budgetUsage.map((usage, index) => (
                          <div
                            key={index}
                            className="quicksand-regular flex flex-col gap-1"
                          >
                            <p className="quicksand-semi-bold">
                              Item: {usage.item}
                            </p>
                            <p>
                              <p className="quicksand-semi-bold">
                                Cost: <span>&#8369; {usage.cost}</span>
                              </p>
                            </p>
                            <p className="quicksand-semi-bold">
                              Date: {formatDate(usage.date)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="  bg-main-orange px-6 py-4 left-0 bottom-0 w-full flex justify-between flex-wrap rounded-b-md">
                        <div className="flex items-center gap-1 text-lg">
                          <p className="text-lg text-light-orange quicksand-bold">
                            Available Amount:{" "}
                          </p>
                          <p className="text-light-orange quicksand-bold">
                            {campaign.totalDonations}
                          </p>
                        </div>
                        <p className="flex items-center gap-1 text-lg text-light-orange quicksand-bold">
                          <p className="text-lg text-light-orange quicksand-bold">
                            Total Cost:
                          </p>
                          {campaign.budgetUsage.reduce(
                            (total, usage) =>
                              total + parseFloat(usage.cost || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p>No budget usage available</p>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default CampaignDetails;
