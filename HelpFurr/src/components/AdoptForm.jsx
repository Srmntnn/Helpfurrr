import React, { useState } from "react";
import "../index.css";
import { motion } from "framer-motion";

function AdoptForm(props) {
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ErrPopup, setErrPopup] = useState(false);
  const [SuccPopup, setSuccPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);

    if (
      !email ||
      !phoneNo ||
      !livingSituation ||
      !previousExperience ||
      !familyComposition
    ) {
      setFormError(true);
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:8080/form/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          dogId: props.dog._id,
        }),
      });

      if (!response.ok) {
        setErrPopup(true);
        return;
      } else {
        setSuccPopup(true);
      }
    } catch (err) { 
      setErrPopup(true);
      console.error(err);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setEmailError(false);
    setFormError(false);
    setEmail("");
    setPhoneNo("");
    setLivingSituation("");
    setPreviousExperience("");
    setFamilyComposition("");
  };

  return (
    <div className=" flex flex-col items-center justify-between p-8 pb-[64px]">
      <h2 className="mb-6">Pet Adoption Application</h2>
      <div className="flex sm:flex-row  flex-col gap-6 justify-between items-center">
        {props.dog && (
          <div className="pet-details">
            <div className="max-w-sm w-full max-h-lg h-full">
              <img
                src={`http://localhost:8080/images/${props.dog.filename}`}
                alt={props.dog.name}
                className="w-full max-w-[300px]  max-h-lg h-full"
              />
            </div>
            <div className="pet-info">
              <h2>{props.dog.name}</h2>
              <p>
                <b>Age:</b> {props.dog.age}
              </p>
              <p>
                <b>Location:</b> {props.dog.shelter}
              </p>
            </div>
          </div>
        )}
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="">
              <div className="flex justify-center items-center">
                <label className="relative w-full">
                  {emailError && <p>Please provide valid email address.</p>}
                  <input
                    type="email"
                    value={email}
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                  />
                  <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email">
                    Email
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-center">
              <label className="relative w-full">
                <input
                  type="text"
                  value={phoneNo}
                  placeholder="Phone #"
                  onChange={(e) => setPhoneNo(e.target.value)}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                />
                <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                  Phone #.
                </span>
              </label>
            </div>
            <div className="flex justify-center">
              <label className="relative w-full">
                <input
                  type="text"
                  placeholder="Living Situation"
                  value={livingSituation}
                  onChange={(e) => setLivingSituation(e.target.value)}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                />
                <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                  Living Situation
                </span>
              </label>
            </div>
            <div className="flex justify-center">
              <label className="relative w-full">
                <input
                  type="text"
                  placeholder="Previous Dog Experience"
                  value={previousExperience}
                  onChange={(e) => setPreviousExperience(e.target.value)}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                />
                <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                  Previous Dog Experience
                </span>
              </label>
            </div>
            <div className="flex justify-center">
              <label className="relative w-full">
                <input
                  type="text"
                  placeholder="Any Other Pets"
                  value={familyComposition}
                  onChange={(e) => setFamilyComposition(e.target.value)}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                />
                <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text">
                  Any Other Pets
                </span>
              </label>
            </div>
            {formError && (
              <p className="error-message">Please fill out all fields.</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </motion.button>

            {ErrPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h4>Oops!... Connection Error.</h4>
                </div>
                <button
                  onClick={(e) => setErrPopup(!ErrPopup)}
                  className="close-btn"
                >
                  Close <i className="fa fa-times"></i>
                </button>
              </div>
            )}
            {SuccPopup && (
              <div className="popup">
                <div className="popup-content">
                  <h4>
                    Adoption Form of {props.dog.name} is Submitted; we'll get in
                    touch with you soon for further process.
                  </h4>
                </div>
                <button
                  onClick={(e) => {
                    setSuccPopup(!SuccPopup);
                    props.closeForm();
                  }}
                  className="close-btn"
                >
                  Close <i className="fa fa-times"></i>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdoptForm;
