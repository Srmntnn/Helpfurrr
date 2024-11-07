import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Main from "../layout/Main";
import DashboardLayout from "../layout/dashboardLayout";
import Home from "../pages/homepage/Home";
import PrivateRoute from "../PrivateRouter/PrivateRoute";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Adoptionpage from "../pages/Adoption/AdoptionPage";
import PostForAdoption from "../pages/PostForAdoptionPage/PostForAdoption";
import PostingDogs from "../pages/admin/PostingDogs";
import ApprovedDogs from "../pages/admin/ApprovedDogs";
import AdoptionRequest from "../pages/admin/AdoptionRequest";
import AdoptedHistory from "../pages/admin/AdoptedHistory";
import EmailVerificationPage from "../pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import AdoptForm from '../components/AdoptForm'
import DogDetails from "../pages/Adoption/DogDetails";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdoptionFormPage from "../pages/AdoptionFormPage.jsx/AdoptionFormPage";


// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/email-verification' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.emailVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>,
      },
      {
        path: "/signup",
        element: <RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>,
      },
      {
        path: "/adoption",
        element: <Adoptionpage />,
      },
      {
        path: "/postadoption",
        element: <PostForAdoption />,
      },
      {
        path: "/donation",
      },
      {
        path: "/location",
      },
      {
        path: "/educresources",
      },
      {
        path: '/email-verification',
        element: <EmailVerificationPage/>
      },
      {
        path: '/adoption-form/:dogId',
        element: <AdoptionFormPage/>
      },
      {
        path: '/dogdetails/:dogId',
        element: <DogDetails/>
      },
      {
        path: '/reset-password/:token',
        element: <ResetPasswordPage/>
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage/>
      },
    ],
  },

  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "postingdogs",
        element: <PostingDogs />,
      },
      {
        path: "approvedDogs",
        element: <ApprovedDogs />,
      },
      {
        path: "adoptionrequest",
        element: <AdoptionRequest />,
      },
      {
        path: "adoptedhistory",
        element: <AdoptedHistory />,
      },
    ],
  },
]);

export default router;
