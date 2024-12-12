import React, { useEffect, useState } from "react";
import Dummy2 from "../assets/dummy2.png";
import Dummy3 from "../assets/dummy3.png";
import { styles } from "../styles";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import cover from "../assets/cover.png";
import axios from "axios";
import { PiDogDuotone } from "react-icons/pi";
import { FaWpforms } from "react-icons/fa6";
import { MdOutlineCampaign } from "react-icons/md";

function About() {
  const [forms, setForms] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDogs = async () => {
    try {
      const dogs = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/dogs/all-dogs`
      );
      setDogs(dogs.data);
      setError(null); // Clear any previous errors on success
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };
  const fetchCampaigns = async () => {
    try {
      const campaigns = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/get-all-campaigns`
      );
      setCampaigns(campaigns.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(
        error.campaigns?.data?.message ||
          error.message ||
          "An error occurred fetching requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const forms = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/getForms`
      );
      if (!forms.ok) {
        throw new Error("An error occurred while fetching forms.");
      }
      const data = await forms.json();
      setForms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const volunteers = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/volunteers/all-volunteer`
      );
      setVolunteers(volunteers.data);
    } catch (error) {
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDogs();
    fetchForms();
    fetchCampaigns();
    fetchVolunteers();
  }, []);
  return (
    <section className="w-full max-w-screen-xl flex sm:flex-row flex-col-reverse items-center justify-center gap-10 sm:py-40 py-10   ">
      <div className="  flex gap-6 items-center flex-col justify-center w-full">
        <div className="space-y-8 text-center">
          <div className="">
            <h1 className="fredoka-bold lg:text-4xl sm:text-[48px] xs:text-[40px] text-[32px]  text-main-brown">
              About <span className="text-main-orange">Helpfur</span>
            </h1>
            <p className="quicksand-regular text-secondary-brown font-medium sm:text-[18px] xs:text-[16px] text-[16px] text-center">
              HelpFurr's mission{" "}
              <span className="text-main-orange font-bold">
                "WE FIND FOREVER HOMES"
              </span>{" "}
              for rescue dogs encapsulates our dedication to facilitating
              successful adoptions through our platform. Our app serves as a
              pivotal tool in achieving this mission by connecting adopters with
              shelter dogs in need of loving homes. Through intuitive features
              like Adoption Listings, users can explore detailed profiles and
              photos of dogs available for adoption, making informed decisions
              that match their preferences and lifestyles.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <img
                src={cover}
                className="rounded-lg shadow-lg h-96 object-cover w-full "
              />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-6 w-full">
              <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <div className="bg-light-orange dark:bg-indigo-900 p-3 rounded-full">
                    <PiDogDuotone className="w-8 h-8 text-main-orange" />
                  </div>
                  <h3 className="text-3xl fredoka-bold font-bold mt-4 text-gray-900 dark:text-gray-50">
                    {dogs.length}
                  </h3>
                  <p className="text-secondary-brown quicksand-semi-bold">
                    Dogs
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <div className="bg-light-orange dark:bg-indigo-900 p-3 rounded-full">
                    <FaWpforms className="w-8 h-8 text-main-orange" />
                  </div>
                  <h3 className="text-3xl fredoka-bold font-bold mt-4 text-gray-900 dark:text-gray-50">
                    {forms.length}
                  </h3>
                  <p className="text-secondary-brown quicksand-semi-bold">
                    Adoption Requests
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <div className="bg-light-orange dark:bg-indigo-900 p-3 rounded-full">
                    <FaWpforms className="w-8 h-8 text-main-orange" />
                  </div>
                  <h3 className="text-3xl fredoka-bold font-bold mt-4 text-gray-900 dark:text-gray-50">
                    {volunteers.length}
                  </h3>
                  <p className="text-secondary-brown quicksand-semi-bold">
                    Volunteers
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <div className="bg-light-orange dark:bg-indigo-900 p-3 rounded-full">
                    <MdOutlineCampaign className="w-8 h-8 text-main-orange" />
                  </div>
                  <h3 className="text-3xl fredoka-bold font-bold mt-4 text-gray-900 dark:text-gray-50">
                    {campaigns.length}
                  </h3>
                  <p className="text-secondary-brown quicksand-semi-bold">
                    Campaigns
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
