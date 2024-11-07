import React from "react";
import { styles } from "../styles";
import { Link, Navigate } from "react-router-dom";
import DummyHero from "../assets/dummy.png";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
function Hero() {
  const { isLoading } = useAuthStore();
  return (
    <section className="w-full max-w-screen-2xl flex sm:flex-row flex-col-reverse items-center justify-center gap-10 sm:my-28 my-20  ">
      <div className="flex flex-col gap-6 max-w-[468px] w-full">
        <div className="sm:text-start text-center">
          <p className="text-secondary-brown quicksand-regular font-medium lg:text-[21px] sm:text-[18px] xs:text-[16px] text-[16px] lg:leading-[40px]">
            Bring a
          </p>
          <h1 className="fredoka-bold text-secondary-orange lg:text-[64px] sm:text-[48px] xs:text-[40px] text-[32px] lg:leading-[64px]">
            <span className="text-main-orange">Little</span> Joy
          </h1>
          <p className="quicksand-regular text-secondary-brown font-medium lg:text-[21px] sm:text-[18px] xs:text-[16px] text-[16px] lg:leading-[40px]">
            Home Today <span className="text-main-orange">.</span>
          </p>
        </div>
        <div className="flex gap-4 flex-wrap items-center justify-center sm:justify-start">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:max-w-56 max-w-96 py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-full shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-semi-bold tracking-wider sm:text-[21px] text-[16px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              <Link
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                to="/adoption"
              >
                Explore
              </Link>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
            className="w-full lg:max-w-56 max-w-96 text-main-brown rounded-full py-3 px-8 bg-light-orange border-main-brown border	 quicksand-semi-bold sm:text-[21px] text-[16px] hover:bg-main-brown hover:text-light-orange duration-200 transition "
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              <Link
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                to="/donation"
              >
                Donation
              </Link>
            )}
          </motion.button>
        </div>
      </div>
      <div>
        <img src={DummyHero} alt="" />
      </div>
    </section>
  );
}

export default Hero;
