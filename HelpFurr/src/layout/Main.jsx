import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";
import LoadingSpinner from "../components/LoadingSpinner"


function Main() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
    useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="mt-32">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Main;
