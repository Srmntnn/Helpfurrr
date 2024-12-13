import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/email-verification" replace />;
  }

  return children;
};

export default ProtectedRoute;
