import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdOutlineAttachEmail } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { MdShareLocation } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useAuthStore } from "../../store/authStore"; // Assuming you have an auth store
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"; // For modal
import { FaArrowLeftLong } from "react-icons/fa6";
import { styles } from "@/styles";

function CampaignDetails() {
  const { user } = useAuthStore();
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mainImage, setMainImage] = useState("");

  // Donation state variables
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/campaigns/get-campaignbyid/${campaignId}`
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

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  // Handle donation submission
  const handleDonate = async (campaignId, donorName, donorEmail, amount) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/donations/donate",
        {
          campaignId,
          donorName,
          donorEmail,
          amount,
        }
      );

      // Log the entire response to inspect the data
      console.log("API Response:", response.data);

      const { paymentIntent } = response.data;

      if (!paymentIntent || !paymentIntent.next_action) {
        console.error("Invalid payment intent data:", paymentIntent);
        return;
      }

      // Redirect to PayMongo checkout
      window.location.href = paymentIntent.next_action.redirect.url;
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  return (
    <section className={`${styles.paddingX} pt-[78px]`}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div classname="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="max-w-screen-xl mx-auto">
        <Helmet>
          <title>HelpFur | {`${campaign?.campaignName}`}</title>
        </Helmet>
        {error ? (
          <p>Error Campaign campaign data: {error.message}</p>
        ) : (
          campaign && (
            <div className="flex gap-12 sm:gap-12 flex-col md:flex-row mt-14">
              {/* Dog Image */}
              <div className="flex-1 flex flex-col-reverse gap-3 md:flex-row">
                {/* <div className="flex sm:flex-col overflow-x-auto sm:gap-[14px] gap-1 sm:overflow-y-auto justify-normal sm:w-[18.7%] w-full">
                  {campaign.image.map((item, index) => (
                    <img
                      key={index}
                      className="w-[24%] sm:w-full flex-shrink-0 cursor-pointer border rounded"
                      src={item}
                      alt={campaign.name}
                      onClick={() => setMainImage(item)}
                    />
                  ))}
                </div> */}
                <div className="w-full md:w-[100%] ">
                  <div className="relative rounded-md overflow-hidden border">
                    <img className="w-full h-auto" src={mainImage} alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 fredoka-bold tracking-wider text-secondary-orange">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        {campaign.campaignName}
                      </h1>
                      <p className="text-sm md:text-base lg:text-lg font-medium quicksand-bold text-light-orange">
                        {campaign.campDeadline}
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
                  <button className="w-full  hover:text-main-orange transition duration-300">
                    <Link to="/donation" className="w-full flex justify-end ">
                      <div className="p-3 quicksand-regular flex items-center gap-2 text-secondary-brown hover:text-main-orange transition duration-300 hover:bg-light-orange rounded-sm">
                        <FaArrowLeftLong className=" " />
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
                {/* <div className="flex h-[1px] w-[80%] mx-auto bg-gray-300 md:px-2 px-4 items-center"></div> */}

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
                  <h2 className="text-base md:text-lg lg:text-xl fredoka-medium text-main-brown ">
                    Details
                  </h2>
                  <div>
                    <h1 className="quicksand-regular">
                      <span className="font-bold text-main-brown">
                        Max Donation:{" "}
                      </span>
                      {campaign.maxDonation}
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
                      {campaign.campDeadline}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 md:gap-3 lg:gap-4 quicksand-regular"></div>
                </div>

                <div className="bg-light-orange mt-6 quicksand-semi-bold text-center md:py-4 md:px-6 py-3 px-4 rounded-lg text-main-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm">
                  <div>
                    <input
                      type="text"
                      placeholder="Donor Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Donor Email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Enter donation amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() =>
                      handleDonate(campaignId, donorName, donorEmail, amount)
                    }
                  >
                    Donate
                  </button>

                  {/* <Dialog open={showPopup} onClose={togglePopup}>
                    <DialogBackdrop />
                    <DialogPanel>
                      <DialogTitle className="text-lg font-bold">
                        Make a Donation
                      </DialogTitle>
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="border rounded p-2 w-full"
                        />
                        <input
                          type="email"
                          placeholder="Your Email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="border rounded p-2 w-full mt-2"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="border rounded p-2 w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleDonate}
                          className="bg-main-orange text-white rounded-lg p-2"
                        >
                          Donate
                        </button>
                        <button
                          onClick={togglePopup}
                          className="bg-gray-300 text-black rounded-lg p-2 ml-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </DialogPanel>
                  </Dialog> */}
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
