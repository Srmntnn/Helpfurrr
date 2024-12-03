import axios from "axios";
import React, { useState, useEffect } from "react";
import { MdOutlineAttachEmail } from "react-icons/md";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaHeart } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { MdShareLocation } from "react-icons/md";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Helmet } from "react-helmet";
import { useAuthStore } from "../../store/authStore";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import AdoptForm from "../../components/AdoptForm";
import { styles } from "../../styles";
import { FaArrowLeftLong } from "react-icons/fa6";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

function DogDetails() {
  const { user } = useAuthStore();
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [mainImage, setMainImage] = useState(""); // State for main image

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/dogs/getdogbyId/${dogId}`
        );

        // Set the first image as the main image initially
        if (response.data.image && response.data.image.length > 0) {
          setMainImage(response.data.image[0]);
        }
        console.log("Fetched dog data:", response.data); // Log fetched data
        setDog(response.data);
      } catch (error) {
        console.error("Error fetching dog data:", error); // Log error details
        setError(error);
      }
    };

    if (dogId) {
      fetchDog();
    }
  }, [dogId]);

  return (
    <section className={`${styles.paddingX} pt-[78px]`}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div classname="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="max-w-screen-xl mx-auto">
        <Helmet>
          <title>HelpFur | {`${dog?.name}`}</title>
        </Helmet>
        {error ? (
          <p>Error fetching dog data: {error.message}</p>
        ) : (
          dog && (
            <div className="flex gap-12 sm:gap-12 flex-col md:flex-row mt-14">
              {/* Dog Image */}
              <div className="flex-1 flex flex-col-reverse gap-3 md:flex-row">
                <div className="flex sm:flex-col overflow-x-auto sm:gap-[14px] gap-1 sm:overflow-y-auto justify-normal sm:w-[18.7%] w-full">
                  {dog.image.map((item, index) => (
                    <img
                      key={index}
                      className="w-[24%] sm:w-full flex-shrink-0 cursor-pointer border rounded"
                      src={item}
                      alt={dog.name}
                      onClick={() => setMainImage(item)}
                    />
                  ))}
                </div>
                <div className="w-full md:w-[80%] ">
                  <div className="relative rounded-md overflow-hidden border">
                    <img className="w-full h-auto" src={mainImage} alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8 fredoka-bold tracking-wider text-secondary-orange">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                        {dog.name}
                      </h1>
                      <p className="text-sm md:text-base lg:text-lg font-medium quicksand-bold text-light-orange">
                        {dog.condition}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="basis-1/3">
                <div className="flex flex-col w-full ">
                  <button className="w-full  hover:text-main-orange transition duration-300">
                    <Link to="/adoption" className="w-full flex justify-end ">
                      <div className="p-3 quicksand-regular flex items-center gap-2 text-secondary-brown hover:text-main-orange transition duration-300 hover:bg-light-orange rounded-sm">
                        <FaArrowLeftLong className=" " />
                        Back to list
                      </div>
                    </Link>
                  </button>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl fredoka-bold tracking-wider text-secondary-brown">
                    About <span className="text-main-orange">{dog.name}</span>
                  </h2>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                    {dog?.condition}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4 quicksand-regular">
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

                <div className="flex flex-col border rounded-lg p-4 space-y-4 quicksand-regular mt-4">
                  <h1 className="text-base md:text-lg lg:text-xl quicksand-bold">
                    Post Author Info:
                  </h1>
                  <hr />
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <IoPersonCircleOutline /> {dog.postedBy}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl inline-flex gap-2 items-center">
                    <MdOutlineAttachEmail /> {dog.email}
                  </p>
                </div>

                <div className="space-y-4 md:space-y-5 mt-4 lg:space-y-6">
                  <h2 className="text-base md:text-lg lg:text-2xl fredoka-medium text-main-brown">
                    Details
                  </h2>
                  <div className="grid grid-cols-2 gap-1 md:gap-3 lg:gap-4 quicksand-regular">
                    <div className="flex gap-2">
                      <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                        Age:
                      </p>
                      <p className="text-base md:text-lg lg:text-xl">
                        {dog?.age}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                        Neutered:
                      </p>
                      <p className="text-base md:text-lg lg:text-xl">
                        {dog?.neutered ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                        Vaccinated:
                      </p>
                      <p className="text-base md:text-lg lg:text-xl">
                        {dog?.vaccinated ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
                        Urgent:
                      </p>
                      <p className="text-base md:text-lg lg:text-xl">
                        {dog?.urgent ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-light-orange mt-6 quicksand-semi-bold text-center md:py-4 md:px-6 py-3 px-4 rounded-lg text-main-orange hover:bg-main-orange hover:text-light-orange transition duration-200 shadow-sm">
                  {/* <button onClick={togglePopup} className=" whitespace-nowrap ">
                    Adopt Now <i className="fa fa-paw"></i>
                  </button> */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <button>Continue</button>
                    </SheetTrigger>
                    <SheetContent className="" side="bottom">
                      <SheetHeader>
                        <SheetTitle>Dog Adoption Form</SheetTitle>
                        <p className="w-full max-w-[750px] text-center quicksand-regular">
                          Adoption is a loving choice that allows you to provide
                          a permanent home for a child in need. This form will
                          help us get to know you better and determine if
                          adoption is the right path for you
                        </p>
                        <SheetDescription>
                          <AdoptForm dog={dog} />
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default DogDetails;
