import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();
  const location = useLocation();
  if (loading) {
    return <loadingSpinner />;
  }
  if (isAuthenticated && user.emailVerified) {
    return children
  }
  return (
     <Navigate to="/login" state={{ from: location }} replace></Navigate>
  )
};

export default RedirectAuthenticatedUser;
