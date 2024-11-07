import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { styles } from "../styles";
import AppLogo from "../assets/Helpfurrlogo.png";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(token, password);

      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error resetting password");
    }
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
        className=" sm:p-8 p-6 w-full max-w-md  sm:bg-white rounded-md md:shadow-md shadow-none  overflow-hidden"
      >
        <div className="flex flex-col items-center ">
          <img className="mb-6" src={AppLogo} alt="" />

          <h2 className="text-3xl font-bold fredoka-bold mb-3 text-center bg-gradient-to-r from-main-orange to-secondary-orange text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <p className="text-center text-main-brown mb-6 quicksand-regular">
            Enter the 6-digit code sent to your email address.
          </p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <label htmlFor="password" className="relative w-full">
                <input
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="New Password"
                  value={password}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                />
                <span className="text-secondary-brown quicksand-regular  text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-password">
                  New Password
                </span>
              </label>
            </div>

            <div className="flex justify-center">
              <label htmlFor="password" className="relative w-full">
                <input
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  className="h-12 w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                />
                <span className="text-secondary-brown quicksand-regular  text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-password">
                  Confirm Password
                </span>
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold tracking-wider"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}

export default ResetPasswordPage;
