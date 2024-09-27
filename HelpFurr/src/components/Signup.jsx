import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../Utils/utils";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/features/auth/authSlice";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await registerUser({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Signup Successfully')
        navigate("/login");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <section className="container mt-32">
      <div>
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
            <button type="submit">Signup</button>
            <span>
              Already have an account ?<Link to="/login">Login</Link>
            </span>
          </form>
          <ToastContainer />
        </div>

        <div>
          <img src="" alt="" />
        </div>
      </div>
    </section>
  );
}

export default Signup;
