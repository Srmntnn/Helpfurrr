import React, { useState, useEffect } from "react";
import postPet from "./images/postPet.png";
import { styles } from "../../styles";
import { FaUser } from "react-icons/fa";
import "../../index.css";
import { useAuthStore } from "../../store/authStore";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import TimeDisplay from "../../components/time-display";
import { MdOutlinePets } from "react-icons/md";
import { Helmet } from "react-helmet";
import useAxiosSecure from "../../hooks/useAxiosSecure";
function AddDogs() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthStore();
  const [age, setAge] = useState("");
  const [shelter, setShelter] = useState("");
  const [condition, setCondition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [gender, setGender] = useState("");
  const [urgent, setUrgent] = useState("");
  const [vaccinated, setVaccinated] = useState("");
  const [neutered, setNeutered] = useState("");
  const [picture, setPicture] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const handleAddPet = async (data) => {
    const petName = data.name;
    const petAge = data.age;
    const shelter = data.shelter;
    const condition = data.condition;
    const urgentCheck = Boolean(data.urgent);
    const vaccinationCheck = Boolean(data.vaccinated);
    const neuteredCheck = Boolean(data.neutered);
    const postedBy = {
      name: user?.name,
      email: user?.email,
      phone: "",
      postedTime: new Date().toISOString(),
    };
    const petData = {
      name: petName,
      age: petAge,
      shelter: shelter,
      condition: condition,
      postedBy: postedBy,
      postedDate: new Date().toISOString(),
      interactionCount: 0,
      adoptionUrgency: urgentCheck,
      vaccinated: vaccinationCheck,
      neutered: neuteredCheck,
    };

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setPicture(selectedFile);
        setFileName(selectedFile.name);
      }
    };
  };

  return (
    <div>
      <div className="w-full">
        <Helmet>
          <title>Pranighor | Add pet</title>
        </Helmet>
        <h1 className="text-2xl font-bold text-center">Add Pet</h1>
        <hr />
        <div className="flex flex-col lg:flex-row py-4 gap-6">
          <form
            onSubmit={handleSubmit(handleAddPet)}
            className="flex-1 flex flex-col border border-gray-100 rounded-lg p-4 space-y-4"
          >
        
            <div className="space-y-4">
              <label>Other info</label>
              <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      {...register("neurationStatus")}
                      id="vue-checkbox-list"
                      type="checkbox"
                      value={true}
                    />
                    <label
                      htmlFor="vue-checkbox-list"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Neutered
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      {...register("vaccinationStatus")}
                      id="react-checkbox-list"
                      type="checkbox"
                      defaultChecked={false}
                      value={true}
                    />
                    <label
                      htmlFor="react-checkbox-list"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Vaccinated
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      {...register("urgencyStatus")}
                      id="angular-checkbox-list"
                      type="checkbox"
                      value={true}
                    />
                    <label
                      htmlFor="angular-checkbox-list"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Urgent
                    </label>
                  </div>
                </li>
              </ul>
              <label className="text-gray-400">* Select all that apply</label>
            </div>
            <button>Submit</button>
          </form>
          <div className="basis-1/3 ">
            <div className="border border-gray-100 rounded-lg p-4 space-y-4">
              <h1 className="text-2xl font-bold inline-flex items-center gap-2">
                <FaUser />
                User Info
              </h1>
              <hr />
              <p>Name: {user?.displayName}</p>
              <p>Email: {user?.email}</p>
              <p>Phone: +880 1643091606</p>
              <p>
                Current Time: <TimeDisplay />
              </p>
            </div>
            <p className="text-red-200 font-light mt-2">
              * These info will be submitted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDogs;
