import { Input } from "@/components/input";
import Select from "react-select";
import { Textarea } from "@/components/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { styles } from "@/styles";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import TimeDisplay from "@/components/Time-display";
import { Loader } from "lucide-react";
import success from "../../components/Success.gif";
import { Disclosure } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoBookOutline } from "react-icons/io5";

const options = [
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "2:00 PM", label: "2:00 PM" },
];

function RequestVolunteer() {
  const { user } = useAuthStore();
  const [typeOfVisit, setTypeOfVisit] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [visitorName, setVisitorName] = useState(user?.name || "");
  const [visitorLastName, setVisitorLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [totalVisitors, setTotalVisitors] = useState("");
  const [questions, setQuestions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [emailError, setEmailError] = useState(false);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !typeOfVisit ||
      !visitDate ||
      !selectedOption ||
      !visitorName ||
      !visitorLastName ||
      !email ||
      !totalVisitors ||
      !questions
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);
    const formattedDate = new Date(visitDate).toISOString();

    // Prepare form data
    const formData = {
      typeOfVisit,
      visitDate: formattedDate,
      visitTime: selectedOption.value,
      visitorName,
      visitorLastName,
      email,
      totalVisitors: Number(totalVisitors), // Convert to number
      questions,
      status: "Pending", // Default status
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volunteers/visit-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Volunteer request created successfully:");
      resetForm();
      togglePopup();
    } catch (error) {
      console.error("Error creating volunteer request:", error);
      alert(
        "There was an error submitting your request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTypeOfVisit("");
    setVisitDate("");
    setSelectedOption(null);
    setVisitorName("");
    setVisitorLastName("");
    setEmail(user?.email || "");
    setTotalVisitors("");
    setQuestions("");
  };

  return (
    <section className="w-full items-center justify-center h-full gap -10 flex">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div
        className={`${styles.paddingX} max-w-screen-2xl justify-center w-full`}
      >
        <Helmet>
          <title>Helpfurr | Create Campaign</title>
        </Helmet>
        <div className="sm:bg-light-orange bg-secondary-orange sm:h-80 h-80 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl sm:text-secondary-orange text-light-orange font-bold text-center fredoka-bold`}
          >
            Shelter Visit
          </h1>
          <p
            className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
          ></p>
        </div>

        <div className="flex flex-col lg:flex-row py-4 gap-6 sm:pt-80 pt-62 mt-24 w-full">
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col border border-gray-100 rounded-lg p-4 space-y-4"
          >
            <div>
              <Label>Appointment Details</Label>
              <p className="quicksand-regular">
                Kindly provide the requested information so we can better
                prepare for your planned visit
              </p>
            </div>
            <hr />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type of Visit:</Label>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="Apply Volunteer"
                    name="visitType"
                    value="Apply Volunteer"
                    checked={typeOfVisit === "Apply Volunteer"}
                    onChange={(e) => setTypeOfVisit(e.target.value)}
                  />
                  <Label htmlFor="Apply Volunteer">Apply Volunteer</Label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="followUp"
                    name="visitType"
                    value="Follow-Up"
                    checked={typeOfVisit === "Follow-Up"}
                    onChange={(e) => setTypeOfVisit(e.target.value)}
                  />
                  <Label htmlFor="followUp">Follow-Up</Label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="radio"
                    id="emergency"
                    name="visitType"
                    value="Emergency"
                    checked={typeOfVisit === "Emergency"}
                    onChange={(e) => setTypeOfVisit(e.target.value)}
                  />
                  <Label htmlFor="emergency">Emergency</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 hover:border-main-orange p-6 border transition duration-300 rounded-md">
              <div className="space-y-2 w-full">
                <Label className="text-main-orange ">
                  Book your Appointment
                </Label>
                <DatePicker setDate={setVisitDate} date={visitDate} />
              </div>
              <div className="space-y-2 w-full">
                <Label className="text-main-orange" htmlFor="campaign-category">
                  Time
                </Label>
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
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="short-description">First Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-description">Lastname</Label>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  value={visitorLastName}
                  onChange={(e) => setVisitorLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="short-description">Email</Label>
                <Input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="short-description">Total Visitors</Label>
                <Input
                  type="text"
                  placeholder="e.g., 23"
                  value={totalVisitors}
                  onChange={(e) => setTotalVisitors(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="long-description">Reason for Visiting</Label>
              <Textarea
                placeholder="Enter any questions or reason you may have."
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
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
            <Label>
              Volunteers must meet all of the following requirements:
            </Label>
            <div className="border rounded-md">
              <div className="w-full">
                <div className="mx-auto w-full rounded-2xl bg-white sm:p-8 p-2">
                  <Disclosure>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-orange-500 hover:bg-light-orange/80 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/75">
                          <span className="quicksand-bold">
                            Volunteers Qualifications.
                          </span>
                          <IoIosArrowDown
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-orange-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="pt-4 text-sm text-gray-500 flex flex-col gap-3">
                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Be at least 18 years of age or older.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Able to understand and fulfil all the
                                  responsibilities of their role independently.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Be able to commit your time in the shelter
                                  at least 2-4 hours depending on assignment.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Be able to physically fulfil the duties of
                                  their volunteer role which include standing or
                                  walking for up to three hours; able to lift
                                  and carry up to 20 pounds; be able to reach
                                  and lift; and able to talk with employees and
                                  other volunteers.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  <Disclosure as="div" className="mt-2">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium text-orange-500 hover:bg-light-orange/80 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/75">
                          <span className="quicksand-bold">
                            How Could You Help?
                          </span>
                          <IoIosArrowDown
                            className={`${
                              open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-orange-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className=" pb-2 pt-4 text-sm text-gray-500 flex flex-col gap-3">
                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg ">
                                <IoBookOutline className="text-main-orange " />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Animal Care: Help in cleaning the animal
                                  areas in the shelter, help in feeding,
                                  bathing, medication and basic grooming as
                                  needed, walk the dogs and or /puppies,
                                  socialize with the cats/kittens by petting
                                  them. Help and support in adoption process.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Education: Help out in spreading the word
                                  about C.A.R.E. Animal Rescue Efforts and
                                  animals for adoptions by campaigning,
                                  designing flyers and brochures to be given out
                                  or distributed in barangay, schools,
                                  veterinary clinics, city government and
                                  various organisations that support animal
                                  welfare to create awareness regarding issues
                                  such as responsible pet ownership; pet
                                  handling and safety.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Fund Raising: Help out in organising events
                                  and activities to raise funds for the shelter.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Miscellaneous: Various areas requiring
                                  expertise
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="w-full border hover:border-main-orange rounded-md transition duration-300 cursor-pointer px-6 py-4 text-sm">
                            <div className="flex items-center gap-3 sm:flex-row flex-col">
                              <div className="p-4 bg-light-orange w-fit rounded-lg">
                                <IoBookOutline className="text-main-orange" />
                              </div>

                              <div>
                                <p className=" rounded-md quicksand-semi-bold">
                                  - Foster: Be a foster parent or consider
                                  adopting one of them. It would be the best
                                  gift that you could ever bestow on them and
                                  us.
                                </p>
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Submit"
              )}
            </motion.button>
          </form>
          <div className="basis-1/3">
            <div className="border border-gray-100 rounded-lg p-4 space-y-4 text-secondary-brown">
              <h1 className="text-2xl font-bold inline-flex items-center gap-2 quicksand-bold">
                <FaUser />
                User Info
              </h1>
              <hr />
              <p className="quicksand-regular"><span className="quicksand-bold">Name:</span> {user?.name}</p>
              <p className="quicksand-regular"><span className="quicksand-bold">Email:</span> {user?.email}</p>
              <p className="quicksand-regular">
                <span className="quicksand-bold">Current Time:</span> <TimeDisplay />
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
            <div className="modal-box bg-white p-4 rounded-lg shadow -lg ">
              <div className="w-92 h-60">
                <img
                  src={success}
                  alt=""
                  className="object-cover w-full h-full mt-4"
                />
              </div>
              <h4 className="text-lg font-bold mb-4 quicksand-regular">
                Application Submitted, we'll get in touch with you soon.
              </h4>
              <div className="flex justify-end">
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

export default RequestVolunteer;
