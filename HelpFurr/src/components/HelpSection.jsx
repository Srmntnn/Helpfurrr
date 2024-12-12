import React from "react";
import { styles } from "../styles";
import { TbDog } from "react-icons/tb";
import { IoMdHeartHalf } from "react-icons/io";
import { motion } from "framer-motion";

function HelpSection() {
  return (
    <section
      className={`${styles.paddingX} max-w-screen-2xl w-full items-center justify-center gap-10 sm:py-40 py-10 flex `}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center">
          <h1 className="text-main-orange fredoka-bold lg:text-4xl sm:text-[48px] xs:text-[30px] text-[32px] lg:leading-[64px]">
            <span className="text-main-brown">Be a</span> Helpfurr.
          </h1>
          <p className="text-secondary-brown quicksand-regular lg:text-md sm:text-[18px] xs:text-base text-[16px]  text-center max-w-[900px] w-full">
            Every dog deserves a loving home. By adopting, volunteering, and
            donating you not only give a dog a better life, but you also enrich
            your own. Join us in making a difference.
          </p>
        </div>
        <div className="flex gap-10 item-center justify-center flex-wrap">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 bg-white py-10 px-8 rounded-xl shadow-sm  sm:max-w-[300px] max-w-[600px] w-full cursor-pointer"
          >
            <TbDog className="sm:text-[56px] text-[64px] text-main-orange" />
            <div className="flex flex-col items-center justify-center ">
              <h1
                className={`${styles.heroSubText} fredoka-bold text-main-orange`}
              >
                Volunteer
              </h1>
              <p className="text-center quicksand-regular text-secondary-brown">
                Help us care for animals in need by volunteering your time at
                local shelters.
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 bg-white py-10 px-8 rounded-xl shadow-sm sm:max-w-[300px] max-w-[600px] w-full cursor-pointer"
          >
            <IoMdHeartHalf className="sm:text-[56px] text-[64px] text-main-orange" />
            <div className="flex flex-col items-center justify-center">
              <h1
                className={`${styles.heroSubText} fredoka-bold text-main-orange`}
              >
                Donate
              </h1>
              <p className="text-center quicksand-regular text-secondary-brown">
                Your donation can make a real difference in rescuing and caring
                for animals at risk.{" "}
              </p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center gap-4 bg-white py-10 px-8 rounded-xl shadow-sm sm:max-w-[300px] max-w-[600px] w-full cursor-pointer"
          >
            <TbDog className="sm:text-[56px] text-[64px] text-main-orange" />
            <div className="flex flex-col items-center justify-center">
              <h1
                className={`${styles.heroSubText} fredoka-bold text-main-orange`}
              >
                Adopt
              </h1>
              <p className="text-center quicksand-regular text-secondary-brown">
                Give a rescued pet a forever home and make a lasting impact on
                their life.{" "}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HelpSection;
