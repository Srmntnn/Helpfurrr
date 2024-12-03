import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import Select from "react-select";
import { Textarea } from "../../components/textarea";
import { FaUser } from "react-icons/fa";
import TimeDisplay from "../../components/time-display";
import { styles } from "../../styles";
import { toast, useToast } from "../../components/use-toast";
import success from "../../components/Success.gif";
import { Loader } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import uploadImage from "../../assets/upload (1).svg";
import { useAuthStore } from "@/store/authStore";


const options = [
  { value: "adoption", label: "Adoption & Rescue" },
  { value: "wellbeing", label: "Campaign Wellbeing" },
  { value: "ownership", label: "Responsible Ownership" },
  { value: "products", label: "Campaign Products" },
  { value: "services", label: "Campaign Services" },
  { value: "lifestyle", label: "Campaign Lifestyle" },
  { value: "entertainment", label: "Campaign Entertainment" },
];

function DonationCampaign() {
  const { user, checkAuth } = useAuthStore();
  console.log(user)
  const [campaignName, setCampaignName] = useState("");
  const [maxDonation, setMaxDonation] = useState("");
  const [campDeadline, setCampDeadline] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [picture, setPicture] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [active, setActive] = useState();
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setFormError(false);
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);

    if (!showPopup) {
      document.body.classList.remove("modal-open");
    }
    setActive("");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !campaignName ||
      !campDeadline ||
      !selectedOption ||
      !email ||
      !shortDescription ||
      !longDescription ||
      !maxDonation
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    const formattedDate = new Date(campDeadline).toISOString();

    const formData = new FormData();
    formData.append("campaignName", campaignName);
    formData.append("campDeadline", formattedDate);
    formData.append("maxDonation", maxDonation);
    formData.append("campaignCategory", selectedOption.value);
    formData.append("shortDescription", shortDescription);
    formData.append("longDescription", longDescription);
    formData.append("email", email);
    formData.append("author", user?.name || "");

    image1 && formData.append("image1", image1);
    image2 && formData.append("image2", image2);
    image3 && formData.append("image3", image3);
    image4 && formData.append("image4", image4);

    try {
      const response = await fetch(
        "http://localhost:8080/campaigns/create-campaign",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Campaign created successfully:");
      resetForm();
      togglePopup();
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCampaignName("");
    setMaxDonation("");
    setCampDeadline("");
    setSelectedOption(null);
    setShortDescription("");
    setLongDescription("");
    setEmail(user?.email || "");
    setPicture(null);
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
  };

  return (
    <section className="w-full justify-center h-full gap -10 flex">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div
        className={`${styles.paddingX} max-w-screen-2xl justify-center w-full`}
      >
        <Helmet>
          <title>Admin | Create Campaign</title>
        </Helmet>
        <div className="sm:bg-light-orange bg-secondary-orange sm:h-70 h-60 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl sm:text-secondary-orange text-light-orange font-bold text-center fredoka-bold`}
          >
            Create Campaign
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row py-4 gap-6 sm:pt-58 pt-56 mt-24 w-full">
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col border border-gray-100 rounded-lg p-4 space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="">
                <Label>Pictures:</Label>
                <div className="flex gap-4 w-full justify-evenly border py-7">
                  <div className="flex flex-col w-36 aspect-square overflow-hidden items-center justify-center ">
                    <label
                      htmlFor="image1"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image1 ? uploadImage : URL.createObjectURL(image1)
                        }
                        className="w-36 object-cover  "
                        alt=""
                      />
                      <input
                        onChange={(e) => setImage1(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image1"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-36 overflow-hidden aspect-square justify-center ">
                    <label
                      htmlFor="image2"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image2 ? uploadImage : URL.createObjectURL(image2)
                        }
                        className="w-36 object-cover"
                        alt=""
                      />
                      <input
                        onChange={(e) => setImage2(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image2"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-36 overflow-hidden aspect-square justify-center ">
                    <label
                      htmlFor="image3"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image3 ? uploadImage : URL.createObjectURL(image3)
                        }
                        className="w-36 object-cover"
                      />
                      <input
                        onChange={(e) => setImage3(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image3"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col w-36 overflow-hidden aspect-square justify-center ">
                    <label
                      htmlFor="image4"
                      className="text-main-brown cursor-pointer"
                    >
                      <img
                        src={
                          !image4 ? uploadImage : URL.createObjectURL(image4)
                        }
                        className="w-36 object-cover"
                        alt=""
                      />
                      <input
                        onChange={(e) => setImage4(e.target.files[0])}
                        type="file"
                        accept="image/*"
                        hidden
                        id="image4"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-donation">Maximum Donation $</Label>
                <Input
                  type="number"
                  placeholder="Enter maximum donation amount"
                  value={maxDonation}
                  onChange={(e) => setMaxDonation(e.target.value)}
                />
              </div>

              <div className="space-y-2 w-full">
                <Label>Campaign Deadline</Label>
                <DatePicker setDate={setCampDeadline} date={campDeadline} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="short-description">Short Description</Label>
                <Input
                  type="text"
                  placeholder="Enter a brief description"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="campaign-category">Campaign Category</Label>
                <Select
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused
                        ? "border-gray-200"
                        : "border-gray-300",
                    }),
                  }}
                  onChange={setSelectedOption}
                  options={options}
                  className="quicksand-regular"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="long-description">Long Description</Label>
              <Textarea
                placeholder="Enter a detailed description"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="quicksand-regular"
              />
            </div>
            {emailError && (
              <p className="error-message text-red-600">
                Please provide a valid email address.
              </p>
            )}
            {formError && (
              <p className="error-message text-red-600">
                Please fill out all fields correctly.
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="w-6 h-6 animate-spin  mx-auto" />
              ) : (
                "Submit"
              )}
            </motion.button>
          </form>
          <div className="basis-1/3 quicksand-regular">
            <div className="border border-gray-100 rounded-lg p-4 space-y-4">
              <h1 className="text-lg text-main-brown font-bold inline-flex items-center gap-2">
                <FaUser />
                User Info
              </h1>
              <hr />
              <p>Name: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>
                Current Time: <TimeDisplay />
              </p>
            </div>
            <p className="text-red-200 font-light mt-2">
              * These info will be submitted
            </p>
          </div>
        </div>
        {showPopup && (
          <div
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-black bg-opacity-50 flex justify-center items-center z-50 ${
              showPopup ? "modal-open" : ""
            }`}
          >
            <div className="modal-box bg-white p-4 rounded-lg shadow-lg ">
              <div className="w-92 h-60">
                <img
                  src={success}
                  alt=""
                  className=" object-cover w-full h-full mt-4"
                />
              </div>
              <h4 className="text-lg font-bold mb-4 quicksand-regular">
                Application Submitted, we'll get in touch with you soon.
              </h4>
              <div className=" flex justify-end">
                <button
                  onClick={togglePopup}
                  className="btn bg-light-orange text-main-orange"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export default DonationCampaign;
