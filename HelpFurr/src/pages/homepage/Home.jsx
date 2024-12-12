import React from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../Utils/utils";
import { ToastContainer } from "react-toastify";
import { styles } from "../../styles";
import Hero from "../../components/Hero";
import About from "../../components/About";
import HelpSection from "../../components/HelpSection";
import Dogdisplay from "../../components/Dogdisplay";
import VelocityText from "../../components/VelocityText";
import { FeaturedSection } from "../../components/FeaturedSection";
import CarouselCustomNavigation from "@/components/CarouselCustomNavigation";

function Home() {
  return (
    <section>
      <div className="sm:mt-[75px] mt-[66px] w-full">
        <CarouselCustomNavigation />
      </div>
      <div
        className={`${styles.paddingX} flex justify-center flex-col items-center w-full pt-[73px]`}
      >
        <About />
        <FeaturedSection />
      </div>
      {/* <Hero /> */}

      <div className="flex w-full justify-center relative sm:mt-0 mt-16">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
        </div>
        <HelpSection />
      </div>
      <div
        className={`${styles.paddingX} flex justify-center flex-col items-center w-full pt-[73px]`}
      >
        <Dogdisplay />
      </div>
    </section>
  );
}

export default Home;
