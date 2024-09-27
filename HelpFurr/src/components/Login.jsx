import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { handleError, handleSuccess } from "../Utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";
import { useLoginUserMutation } from "../redux/features/auth/authApi";

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

  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return handleError("Email and password are required");
    }
    try {
      const res = await loginUser({  email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
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
    <div className="container mt-32">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={email}
          />
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
        </div>
        <button type="submit">Login</button>
        <span>
          Does't have an account ?<Link to="/signup">Signup</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
