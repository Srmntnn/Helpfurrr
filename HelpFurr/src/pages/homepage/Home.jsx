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

function Home() {
  return (
    <section
      className={`${styles.paddingX} flex justify-center flex-col items-center w-full pt-[73px]`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div class="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <Hero/>
      <HelpSection/>
      <About/>
      <Dogdisplay/>
    </section>
  );
}

export default Home;
