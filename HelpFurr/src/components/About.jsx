import React from "react";
import Dummy2 from "../assets/dummy2.png";
import Dummy3 from "../assets/dummy3.png";
import { styles } from "../styles";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function About() {
  return (
    <section className="w-full max-w-screen-2xl flex sm:flex-row flex-col-reverse items-center justify-center gap-10 sm:py-40 py-10   ">
      <div className="  flex gap-6 items-center md:flex-row flex-col justify-center w-full">
        <div className="flex max-w-[685px] w-full gap-6 justify-center">
          <div className="">
            <img src={Dummy2} alt="" />
          </div>
          <div className="mt-16">
            <img src={Dummy3} alt="" />
          </div>
        </div>
        <div className="flex flex-col max-w-[580px] w-full gap-4">
          <div className="sm:text-start text-center">
            <h1 className="fredoka-bold lg:text-[64px] sm:text-[48px] xs:text-[40px] text-[32px] lg:leading-[64px] text-main-brown">
              About <span className="text-main-orange">Helpfur</span>
            </h1>
            <p className="quicksand-regular text-main-brown font-medium lg:text-[21px] sm:text-[18px] xs:text-[16px] text-[16px] lg:leading-[40px]">
              WE FIND FOREVER HOMES
            </p>
          </div>
          <p className="quicksand-regular text-secondary-brown font-medium sm:text-[18px] xs:text-[16px] text-[16px] text-justify">
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:max-w-56 max-w-96 text-main-orange rounded-full py-3 px-8 bg-light-orange border-main-orange border	 quicksand-semi-bold sm:text-[21px] text-[16px] hover:bg-main-orange hover:text-light-orange duration-200 transition mt-4"
          >
            <Link
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
              to="/adoption"
            >
              Explore
            </Link>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default About;
