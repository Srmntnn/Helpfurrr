import React, { useState } from "react";
import "../index.css";
import { motion } from "framer-motion";
import { Label } from "./label";
import { Input } from "./input";
import { useAuthStore } from "../store/authStore";

function AdoptForm(props) {
  const { user } = useAuthStore();
  const [email, setEmail] = useState(user?.email || "");
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
    <div className=" flex flex-col  sm:p-8 p-6 pb-[64px]">
      <h2 className="mb-6 quicksand-bold text-2xl sm:text-start text-center">Pet Adoption Application</h2>
      <div className="flex sm:flex-row  flex-col gap-6">
        {props.dog && (
          <div className="">
            <div className="w-full">
              <img
                src={props.dog.image[0]}
                alt={props.dog.name}
                className="sm:w-[500px] w-full rounded-md"
              />
            </div>
            <div className="flex flex-col mt-4 capitalize quicksand-regular">
              <h2 className="text-2xl fredoka-bold text-secondary-orange mb-2">
                {props.dog.name}
              </h2>
              <p>
                <b>Age:</b> {props.dog.age}
              </p>
              <p>
                <b>Gender:</b> {props.dog.gender}
              </p>
              <p>
                <b>Location:</b> {props.dog.shelter}
              </p>
            </div>
          </div>
        )}
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="">
              <div className="flex  flex-col">
                <Label className="">Email</Label>
                {emailError && <p>Please provide valid email address.</p>}
                <Input
                  type="email"
                  value={email}
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex  flex-col">
              <Label className="relative w-full">Phone #</Label>
              <Input
                type="text"
                value={phoneNo}
                placeholder="Phone #"
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </div>
            <div className="flex justify-center flex-col">
              <Label className="relative w-full "> Living Situation</Label>
              <Input
                type="text"
                placeholder="Living Situation"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
              />
            </div>
            <div className="flex justify-center flex-col">
              <Label className="relative w-full">Previous Dog Experience</Label>
              <Input
                type="text"
                placeholder="Previous Dog Experience"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
              />
            </div>
            <div className="flex justify-center flex-col">
              <Label className="relative w-full">Other Pets </Label>
              <Input
                type="text"
                placeholder="Any Other Pets"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
              />
            </div>
            {formError && (
              <p className="error-message">Please fill out all fields.</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-regular"
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
