import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import { styles } from "../../styles";
import "../../index.css";

function PostForAdoption() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [shelter, setShelter] = useState("");
  const [condition, setCondition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  //   const [type, setType] = useState("None");
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
      !fileName ||
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
      setEmail("");
      setPhone("");
      setPicture(null);
      setFileName("");
      togglePopup();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`${styles.paddingX} flex justify-center `}>
      <div className="mt-52 flex gap-4 flex-col">
        <h2 className={`${styles.heroHeadText} text-[#564941] `}>
          Post a Pet for Adoption
        </h2>
        <div className="flex justify-center gap-4 bg-light-orange py-6 rounded-2xl shadow-sm mb-8 ">
          <img
            src={postPet}
            className="object-contain h-[128px] "
            alt="Pet Looking for a Home"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-4"
        >
          <div className="flex justify-center gap-4 ">
            <label className="relative w-full">
              <input
                type="text"
                value={name}
                placeholder="Dog Name"
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                Dog name
              </span>
            </label>
          </div>

          <div className="flex justify-center">
            <label className="relative w-full">
              <input
                type="text"
                value={age}
                placeholder="Pet Age"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                Pet Age
              </span>
            </label>
          </div>

          <div className="flex flex-col">
            <label>Picture:</label>
            <label className="file-input-label">
              <span className="file-input-text">
                {fileName || "Choose a Picture"}
              </span>
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="flex justify-center">
            <label className="relative w-full">
              <input
                type="text"
                value={shelter}
                placeholder="Location"
                onChange={(e) => setShelter(e.target.value)}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                Location
              </span>
            </label>
          </div>

          <div className="flex justify-center">
            <label className="relative w-full">
              <input
                type="text"
                value={condition}
                placeholder="Condition"
                onChange={(e) => setCondition(e.target.value)}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                Condition
              </span>
            </label>
          </div>

          <h3 className="mt-4 text-[24px] font-bold">Contact Information</h3>

          <div className="flex justify-center">
            <label className="relative w-full">
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email">
                Email
              </span>
            </label>
          </div>

          <div className="flex justify-center">
            <label className="relative w-full">
              <input
                type="text"
                value={phone}
                placeholder="Email"
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                Phone Number
              </span>
            </label>
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

          <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Your Pet"}
          </button>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h4>
                  Application Submitted; we'll get in touch with you soon.
                </h4>
              </div>
              <button onClick={togglePopup} className="close-btn">
                Close <i className="fa fa-times"></i>
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default PostForAdoption;
