import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.emailVerified) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default RedirectAuthenticatedUser;
