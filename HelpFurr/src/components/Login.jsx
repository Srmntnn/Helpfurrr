import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../Utils/utils";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import "../index.css";

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

    /////
    // if (!email || !password) {
    //     return handleError('Email and password are required')
    // }
    // try {
    //     const url = 'http://localhost:8080/auth/login';
    //     const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(loginInfo)
    //     });
    //     const result = await response.json();
    //     const { success, message, jwtToken, name, error } = result;
    //     if (success) {
    //         handleSuccess(message);
    //         localStorage.setItem('token', jwtToken);
    //         localStorage.setItem('loggedInUser', name);
    //         setTimeout(() => {
    //             navigate('/home')
    //         }, 1000)
    //     } else if (error) {
    //         const details = error?.details[0].message;
    //         handleError(details);
    //     } else if (!success) {
    //         handleError(message);
    //     }
    //     console.log(result);
    // } catch (err) {
    //     handleError(err);
    // }
  };

  return (
    <section className="flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=""
      >
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="flex justify-center ">
            <label htmlFor="email" className="relative w-full">
              <input
                required
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                placeholder="Email"
                className="h-12 max-w-[500px] w-full border-main-brown border-2 outline-none bg-white border-opacity-20 rounded-[4px] focus:border-main-orange transition duration-200 placeholder-gray-300 placeholder-opacity-0 px-4"
                value={email}
              />
              <span className="text-main-brown text-opacity-80 absolute left-0 top-3 px-1 mx-4 transition duration-200 input-email">
                Email
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={password}
            />
            <div className="flex items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-main-orange hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-secondary-orange to-main-orange text-white rounded-lg shadow-lg hover:from-main-orange hover:to-secondary-orange focus:outline-none focus:ring-2 focus:ring-main-orange focus:ring-offset-2 focus:ring-offset-main-brown transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin  mx-auto" />
            ) : (
              "LOGIN"
            )}
          </motion.button>
          <span>
            Does't have an account ?<Link to="/signup">Signup</Link>
          </span>
        </form>
      </motion.div>
      <ToastContainer />
    </section>
  );
}

export default Login;
