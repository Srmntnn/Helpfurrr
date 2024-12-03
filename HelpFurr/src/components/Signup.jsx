import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "./passwordStrenghtMeter";
import { styles } from "../styles";
import { FaFacebook } from "react-icons/fa";
import Gmail from "../assets/pngwing 1.png";
import dogVisual from "../assets/cover.png";
import "../index.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        await signup(email, password, name);
        navigate("/email-verification");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <section
      className={`${styles.paddingX} sm:px-16 px-6 flex justify-center items-center h-svh mt-16`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex shadow-sm rounded-lg w-full max-w-[1183px]"
      >
        <div className="flex flex-col justify-between gap-8 w-full sm:max-w-[418px] max-w-[600px] p-6 sm:p-10 shadow-sm bg-white overflow-hidden rounded-lg">
          <div className="flex flex-col">
            <h1 className=" fredoka-bold text-main-brown md:text-[40px] sm:text-[28px] xs:text-[40px] text-[30px]">
              Sign up
            </h1>
            <p className="text-secondary-brown quicksand-regular">
              Enter your credentials to sign up.
            </p>
          </div>
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <div className="flex flex-col gap-4">
                <div
                  className="flex justify-center"
                >
                  <label htmlFor="name" className="relative w-full">
                    <input
                      required
                      type="text"
                      placeholder="Fullname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                    />
                    <span className="text-secondary-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-text quicksand-regular ">
                      Fullname
                    </span>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="email" className="relative w-full">
                    <input
                      required
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                    />
                    <span className="text-secondary-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email quicksand-regular ">
                      Email
                    </span>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="password" className="relative w-full">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                    />
                    <span className="text-secondary-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-password quicksand-regular ">
                      Password
                    </span>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="password" className="relative w-full">
                    <input
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                    />
                    <span className="text-secondary-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-password quicksand-regular ">
                      Confirm Password
                    </span>
                  </label>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}

              <motion.button
                className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-main-orange to-secondary-orange text-white 
						font-bold rounded-lg shadow-lg hover:from-main-orange
						hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2
						 focus:ring-offset-main-brown transition duration-200 quicksand-bold tracking-wider"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
              >
                {isLoading ? (
                  <Loader className=" animate-spin mx-auto" size={24} />
                ) : (
                  "Sign Up"
                )}
              </motion.button>
            </div>
            {/* <div className="flex flex-row justify-center items-center gap-2 px-6">
              <span className="h-[1px] w-full bg-gray-400 flex"></span>
              <p className="whitespace-nowrap text-gray-400 text-sm quicksand-regular">
                or signin with
              </p>
              <span className="h-[1px] w-full bg-gray-400 flex"></span>
            </div>

            <div className="flex gap-4 w-full justify-between">
              <div className="bg-[#1877F2] flex py-2 rounded-full w-full justify-center shadow-xl overflow-hidden">
                <FaFacebook className="text-white text-[24px]" />
              </div>
              <div className="flex w-full bg-white py-2 shadow-xl overflow-hidden rounded-full justify-center">
                <img src={Gmail} className="" alt="" />
              </div>
            </div> */}
          </form>
          <div className="flex flex-col items-center">
            <span className="flex gap-1 quicksand-regular">
              <p>Already have an account?</p>
              <Link
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                to="/login"
                className="text-main-orange hover:underline"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
        <div className="flex">
          <img
            className="hidden sm:flex object-cover w-full max-w-[765px] z-[-99px] rounded-r-lg"
            src={dogVisual}
            alt=""
          />
        </div>
      </motion.div>
      <ToastContainer />
    </section>
  );
}

export default Signup;
