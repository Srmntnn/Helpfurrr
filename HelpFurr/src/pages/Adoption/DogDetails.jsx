import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdOutlineAttachEmail } from "react-icons/md";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaHeart } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { MdShareLocation } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { useParams } from "react-router-dom";
import moment from "moment";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useAuthStore } from "../../store/authStore";

function DogDetails() {
  const { user } = useAuthStore();
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/dogs/getdogbyId/${dogId}`
        );
        setDog(response.data);
      } catch (error) {
        setError(error);
      }
    };

    if (dogId) {
      fetchDog();
    }
  }, [dogId]);

  return (
    <div>
      {error ? (
        <p>Error fetching dog data: {error.message}</p>
      ) : (
        dog && (
          <div>
            <Helmet>
              <title>HelpFur | {`${dog?.name}`}</title>
            </Helmet>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  className="object-cover"
                  src={`http://localhost:8080/images/${dog.filename}`}
                  alt={dog.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 text-white">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    {dog.name}
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg font-medium">
                    {dog.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 md:space-y-10 lg:space-y-12">
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                    About {dog.name}
                  </h2>
                  <h1 className="text-2xl font-bold inline-flex gap-2 items-center text-orange-400">
                    <FaHeart /> {dog?.interactionCount}
                  </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                  {dog?.condition}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <LuCalendarDays />{" "}
                    {moment(dog?.postedBy?.postedTime).format("MMMM Do YYYY")}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <MdShareLocation /> {dog.shelter}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <HiOutlineStatusOnline />{" "}
                    {dog?.adopted ? "Adopted" : "Not Adopted"}
                  </p>
                </div>
                <div className="flex flex-col border rounded-lg p-4 space-y-4">
                  <h1 className="text-base md:text-lg lg:text-xl font-semibold">
                    Post Author Info:
                  </h1>
                  <hr />
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <IoPersonCircleOutline /> {dog.prevOwnername}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <MdOutlineAttachEmail /> {dog.email}
                  </p>
                </div>
              </div>
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Details
                </h2>
                <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                      Age:
                    </p>
                    <p className="text-base md:text-lg lg:text-xl">
                      {dog?.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                      Neutered:
                    </p>
                    <p className="text-base md:text-lg lg:text-xl">
                      {dog?.neutered ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                      Vaccinated:
                    </p>
                    <p className="text-base md:text-lg lg:text-xl">
                      {dog?.vaccinated ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                      Urgent:
                    </p>
                    <p className="text-base md:text-lg lg:text-xl">
                      {dog?.adoptionUrgency ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default DogDetails;
