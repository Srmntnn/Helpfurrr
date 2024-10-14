import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import PasswordStrengthMeter from "./passwordStrenghtMeter";

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
    <section className="flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray- p-6 shadow-xl 
			overflow-hidden"
      >
        <div>
          <div>
            <h1>Sign Up</h1>
            <p>Enter your credentials to sign up.</p>
          </div>
          <form onSubmit={handleSignup}>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password">Confirm password</label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
              />
            </div>
            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
            <PasswordStrengthMeter password={password} />

            <motion.button
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-main-orange to-secondary-orange text-white 
						font-bold rounded-lg shadow-lg hover:from-main-orange
						hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2
						 focus:ring-offset-main-brown transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className=" animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
            <span>
              Already have an account ?<Link to="/login">Login</Link>
            </span>
          </form>
          <ToastContainer />
        </div>

        <div>
          <img src="" alt="" />
        </div>
      </motion.div>
    </section>
  );
}

export default Signup;
