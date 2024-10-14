import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/homepage/Home.jsx";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/authStore.jsx";
import { toast } from "react-hot-toast";
import Dashboard from "./pages/admin/Dashboard.jsx";


// protect routes that require authentication
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!user.isVerified) {
//     return <Navigate to="/email-verification" replace />;
//   }

//   return children;
// };

// // redirect authenticated users to the home page
// const RedirectAuthenticatedUser = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (isAuthenticated && user.isVerified) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated, user, logout } =
    useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("TAE", isAuthenticated);
  console.log("user", user);
  return (
    <div className="mt-32">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
