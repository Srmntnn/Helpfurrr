import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/input";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [active, setActive] = useState("");
  
    const navigate = useNavigate();
    const { login, isLoading, error, user, isAuthenticated } = useAuthStore(); // Get user and isAuthenticated from store
  
    useEffect(() => {
      if (user && user.role === "admin") {
        navigate("/dashboard"); // Redirect admin to dashboard if logged in
      } else if (user && user.role !== "admin") {
        toast.error("Access restricted to administrators only.");
      }
    }, [navigate, user]);
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }
  
      try {
        await login(email, password); // Call the login function from the store
        if (user && user.role !== "admin") {
          throw new Error("Unauthorized: Admin access only.");
        }
      } catch (err) {
        toast.error(err?.message || "Login failed");
      }
    };
  
  return (
    <section className="flex justify-center h-screen items-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <div className="flex flex-col bg-white px-8 border py-6 max-w-96 w-full rounded-md">
        <div className="mb-4">
          <h1 className="quicksand-bold text-main-brown text-2xl ">
            Admin Login
          </h1>
          <p className="quicksand-regular">Enter credentials to login.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p>{error}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
            className="w-full py-3 mt-4 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200 quicksand-bold tracking-wider"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <ToastContainer/>
    </section>
  );
};

export default AdminLogin;
