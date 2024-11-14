import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import { styles } from "../../styles";
import { FaUser } from "react-icons/fa";
import "../../index.css";
import { useAuthStore } from "../../store/authStore";
import TimeDisplay from "../../components/time-display";
import { Input } from "../../components/input";
import success from "../../components/Success.gif";
import { Helmet } from "react-helmet";
import { Label } from "../../components/label";
import { MdOutlinePets } from "react-icons/md";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../components/use-toast";

function PostForAdoption() {
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [postedBy, setPostedBy] = useState(user?.name || "");
  const [age, setAge] = useState("");
  const [shelter, setShelter] = useState("");
  const [condition, setCondition] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [gender, setGender] = useState("");
  const [urgent, setUrgent] = useState("");
  const [vaccinated, setVaccinated] = useState("");
  const [neutered, setNeutered] = useState("");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSubmitting) {
      setEmailError(false);
      setAgeError(false);
      setFormError(false);
    }
  }, [isSubmitting]);

  const togglePopup = () => {
    setShowPopup(!showPopup);

    if (!showPopup) {
      document.body.classList.remove("modal-open");
    }
    setActive("");
    window.scrollTo(0, 0);
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPicture(selectedFile);
      setFileName(selectedFile.name);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !age ||
      !shelter ||
      !condition ||
      !email ||
      !phone ||
      !postedBy ||
      !fileName ||
      !gender ||
      !vaccinated ||
      !urgent ||
      !neutered ||
      !clientEmail ||
      ageError
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("shelter", shelter);
    formData.append("condition", condition);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("postedBy", postedBy);
    formData.append("gender", gender);
    formData.append("vaccinated", vaccinated);
    formData.append("neutered", neutered);
    formData.append("urgent", urgent);
    formData.append("clientEmail", clientEmail);

    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await fetch("http://localhost:8080/dogs/postadoption", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Form submitted successfully");

      setEmailError(false);
      setFormError(false);
      setName("");
      setAge("");
      setShelter("");
      setCondition("");
      setClientEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      setGender("");
      setVaccinated("");
      setNeutered("");
      setUrgent("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
      useToast.success("Campaign created successfully!");
    }
  };

  return (
    <section className="w-full items-center justify-center h-full gap-10 flex">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div classname="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div
        className={`${styles.paddingX} max-w-screen-2xl justify-center w-full`}
      >
        <Helmet>
          <title>HelpFur | Add dog</title>
          <meta name="Helpfur-all dogs" content="Helmet application" />
        </Helmet>
        <div className="sm:bg-light-orange bg-secondary-orange sm:h-96 h-80 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl sm:text-secondary-orange text-light-orange font-bold text-center fredoka-bold`}
          >
            Post dog for adoption
          </h1>
          <p
            className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
          >
            Browse the list of available dogs
          </p>
        </div>
        <div className="flex flex-col lg:flex-row py-4 gap-6 sm:pt-96 pt-72 mt-24 w-full">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="flex-1 flex flex-col border border-gray-100 rounded-lg p-4 space-y-4"
          >
            <h1 className="text-2xl font-bold inline-flex items-center gap-2 text-main-brown pt-4 quicksand-semi-bold">
              <MdOutlinePets className="text-[32px]" />
              Pet Info
            </h1>

            <div className="flex justify-center flex-col ">
              <Label className="text-main-brown"> Dog name</Label>
              <Input
                type="text"
                value={name}
                placeholder="Dog Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex justify-center flex-col">
              <Label className="text-main-brown">Dog age</Label>
              <Input
                type="text"
                value={age}
                placeholder="Pet Age"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <Label className="text-main-brown">Picture:</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="flex justify-center flex-col">
              <Label className="text-main-brown">Dog age</Label>
              <Input
                type="text"
                value={shelter}
                placeholder="Location"
                onChange={(e) => {
                  setShelter(e.target.value);
                }}
              />
            </div>

            <div className="flex justify-center flex-col">
              <Label>Dog gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-center flex-col">
              <Label className="relative w-full">Dog condition</Label>
              <Input
                type="text"
                value={condition}
                placeholder="Condition"
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label>Other info</Label>
              <ul className="items-center w-full text-sm font-medium text-main-orange  border bg-light-orange border-gray-200 rounded-lg sm:flex   ">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div className="flex items-center ps-3">
                    <Label className="mb-0">Vaccinated:</Label>
                    <select
                      value={vaccinated}
                      onChange={(e) => setVaccinated(e.target.value)}
                      className="flex h-10 w-full items-center justify-between appearance-none rounded-md  border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none bg-light-orange  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div className="flex items-center ps-3">
                    <Label className="mb-0">Neutered:</Label>
                    <select
                      value={neutered}
                      onChange={(e) => setNeutered(e.target.value)}
                      className="flex h-10 w-full items-center justify-between appearance-none rounded-md  border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none bg-light-orange  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r ">
                  <div className="flex items-center ps-3">
                    <Label className="mb-0"> Urgent:</Label>
                    <select
                      value={urgent}
                      onChange={(e) => setUrgent(e.target.value)}
                      className="flex h-10 w-full items-center justify-between appearance-none rounded-md  border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none bg-light-orange disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                    >
                      <option value="" disabled>
                        Select option
                      </option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </li>
              </ul>
              <Label className="text-gray-400">* Select all that apply</Label>
            </div>

            {/* <div className="flex justify-between w-full sm:flex-row flex-col gap-3">
              <div className="flex  items-center gap-2 ">
                <Label className="mb-0">Vaccinated:</Label>
                <select
                  value={vaccinated}
                  onChange={(e) => setVaccinated(e.target.value)}
                  className="flex h-10 w-full items-center justify-between appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="flex justify-center items-center  w-full gap-2">
                <Label className="mb-0">Neutered:</Label>
                <select
                  value={neutered}
                  onChange={(e) => setNeutered(e.target.value)}
                  className="flex h-10 w-full items-center justify-between appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>

              <div className="flex justify-center items-center  w-full gap-2">
                <Label className="mb-0"> Urgent:</Label>
                <select
                  value={urgent}
                  onChange={(e) => setUrgent(e.target.value)}
                  className="flex h-10 w-full items-center justify-between appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 quicksand-regular"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div> */}

            <h3 className="pt-8 text-[24px] font-bold flex items-center sm:justify-start justify-center gap-2 text-main-brown quicksand-semi-bold">
              {" "}
              <FaUser className="text-[32px]" />
              Contact Information
            </h3>
            <div className="flex justify-center flex-col">
              <Label className="text-main-brown">Owner name </Label>
              <Input
                type="text"
                value={postedBy}
                placeholder={user?.name}
                onChange={(e) => setPostedBy(e.target.value)}
              />
            </div>

            <div className="flex justify-center flex-col">
              <Label className="text-main-brown">Owner email</Label>
              <Input
                type="email"
                value={clientEmail}
                placeholder="@gmail.com"
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-center flex-col">
              <Label className="text-main-brown">Owner no.</Label>
              <Input
                type="number"
                value={phone}
                placeholder="+63 |"
                pattern="[0-9]+"
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none peer"
              />
            </div>

            {emailError && (
              <p className="error-message">
                Please provide a valid email address.
              </p>
            )}
            {formError && (
              <p className="error-message">
                Please fill out all fields correctly.
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
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
          <div className="basis-1/3 ">
            <div className="border border-gray-100 rounded-lg p-4 space-y-4 text-secondary-brown">
              <h1 className="text-2xl font-bold inline-flex items-center gap-2 quicksand-bold">
                <FaUser />
                User Info
              </h1>
              <hr />
              <p className="quicksand-regular">Name: {user?.name}</p>
              <p className="quicksand-regular">Email: {user?.email}</p>
              <p className="quicksand-regular">
                Current Time: <TimeDisplay />
              </p>
            </div>
            <p className="text-red-200 font-light mt-2 quicksand-regular">
              * These info might be submitted
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

export default PostForAdoption;
