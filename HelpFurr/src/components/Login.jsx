import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../Utils/utils";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import "../index.css";
import { FaFacebook } from "react-icons/fa";
import Gmail from "../assets/pngwing 1.png";
import dogVisual from "../assets/cover.png";
import { styles } from "../styles";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     console.log(name, value);
  //     const copyLoginInfo = { ...loginInfo };
  //     copyLoginInfo[name] = value;
  //     setLoginInfo(copyLoginInfo);
  // }

  const { login, isLoading, error, user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return handleError("Email and password are required");
    }
    try {
      e.preventDefault();
      await login(email, password);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section
      className={`${styles.paddingX} flex justify-center items-center h-svh`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div class="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex shadow-sm rounded-lg w-full max-w-[1183px] mt-20"
      >
        <div className="flex flex-col justify-between gap-8 w-full sm:max-w-[418px] max-w-[600px] p-6 sm:p-10 shadow-sm bg-white overflow-hidden  rounded-lg">
          <div className="flex flex-col">
            <h1 className=" fredoka-bold text-main-brown md:text-[40px] sm:text-[28px] xs:text-[40px] text-[30px]">
              Welcome Back!
            </h1>
            <p className="text-secondary-brown quicksand-regular">
              Enter your credentials to sign in.
            </p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-center ">
                  <label htmlFor="email" className="relative w-full">
                    <input
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4 "
                      value={email}
                    />
                    <span className="text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email text-secondary-brown quicksand-regular ">
                      Email
                    </span>
                  </label>
                </div>
                <div className="flex justify-center">
                  <label htmlFor="password" className="relative w-full">
                    <input
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                    />
                    <span className="text-secondary-brown quicksand-regular  text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-password">
                      Password
                    </span>
                  </label>
                </div>
              </div>
              {error && (
                <p className="text-red-500 font-semibold mb-2">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold tracking-wider"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin  mx-auto" />
                ) : (
                  "Login"
                )}
              </motion.button>
            </div>

            <div className="flex flex-row justify-center items-center gap-2 px-6">
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
            </div>
          </form>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <Link
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                to="/forgot-password"
                className="text-sm text-main-orange hover:underline quicksand-regular"
              >
                Forgot password?
              </Link>
            </div>
            <span className="flex gap-1 quicksand-regular">
              <p>Does't have an account?</p>
              <Link
                onClick={() => {
                  setActive("");
                  window.scrollTo(0, 0);
                }}
                to="/signup"
                className="text-main-orange hover:underline"
              >
                Signup
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

export default Login;
