import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { styles } from "../styles";
import AppLogo from "../assets/Helpfurrlogo.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <section
      className={`${styles.paddingX} flex justify-center items-center h-svh`}
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div class="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-secondary-orange opacity-20 blur-[100px]"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" w-full max-w-md  sm:bg-white rounded-md md:shadow-md shadow-none  overflow-hidden"
      >
        <div className="sm:px-8 px-0 py-8 w-full">
          <div className="flex flex-col items-center ">
            <img className="mb-6" src={AppLogo} alt="" />

            <h2 className="text-3xl font-bold fredoka-bold mb-3 text-center bg-gradient-to-r from-main-orange to-secondary-orange text-transparent bg-clip-text">
              Forgot Password
            </h2>
            <p className="text-center text-main-brown mb-6 quicksand-regular">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex justify-center">
                <label htmlFor="password" className="relative w-full">
                  <input
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    name="email"
                    placeholder="Confirm Password"
                    value={email}
                    className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                  />
                  <span className="text-secondary-brown quicksand-regular  text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email">
                    Email
                  </span>
                </label>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold tracking-wider"
                type="submit"
              >
                {isLoading ? (
                  <Loader className="size-6 animate-spin mx-auto" />
                ) : (
                  "Continue"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-main-orange rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-gray-300 mb-6">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 bg-light-orange flex justify-center">
          <Link
            to={"/login"}
            className="text-sm text-main-orange hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
export default ForgotPasswordPage;
