import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Main from "../layout/Main";
import DashboardLayout from "../layout/DashboardPageLayout";
import Home from "../pages/homepage/Home";
import PrivateRoute from "../PrivateRouter/PrivateRoute";
import Login from "../components/Login";
import Signup from "../components/Signup";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Adoptionpage from "../pages/Adoption/AdoptionPage";
import PostForAdoption from "../pages/PostForAdoptionPage/PostForAdoption";
import PostingDogs from "../pages/admin/DogAdminPages/PostingDogs";
import ApprovedDogs from "../pages/admin/DogAdminPages/ApprovedDogs";
import AdoptionRequest from "../pages/admin/DogAdminPages/AdoptionRequest";
import AdoptedHistory from "../pages/admin/DogAdminPages/AdoptedHistory";
import EmailVerificationPage from "../pages/EmailVerificationPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";
import AdoptForm from "../components/AdoptForm";
import DogDetails from "../pages/Adoption/DogDetails";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdoptionFormPage from "../pages/AdoptionFormPage.jsx/AdoptionFormPage";
import UserRequestedDogs from "../pages/Ownerpage/UserRequestedDogs";
import DonationCampaign from "../pages/Donation/DonationCampaign";
import DonationPage from "../pages/Donation/CampaignPage";
import CampaignRequest from "../pages/admin/CampaingsPages/CampaignRequest";
import ApprovedCampaign from "../pages/admin/CampaingsPages/ApprovedCampaign";
import RequestPage from "../pages/Ownerpage/RequestPage";
import NotificationPage from "../pages/Notification/NotificationPage";
import Volunteer from "../pages/Volunteer/Volunteer";
import VolunteerRequest from "../pages/admin/VolunteerPages/VolunteerRequest";
import MapLocation from "../pages/Map/MapLocation";
import AllDogs from "../pages/admin/DogAdminPages/AllDogs";
import ApprovedVolunteeers from "../pages/admin/VolunteerPages/ApprovedVolunteeers";
import RejectedVolunteers from "../pages/admin/VolunteerPages/RejectedVolunteers";
import AllVolunteers from "../pages/admin/VolunteerPages/AllVolunteers";
import CampaignDetails from "../pages/Donation/CampaignDetails";
import AllCampaigns from "../pages/admin/CampaingsPages/AllCampaigns";
import AdminLogin from "../pages/admin/AdminLogin";
import EditDogForm from "@/pages/Ownerpage/EditDogForm";
import ScannedDogData from "@/pages/Ownerpage/ScannedData";
import AdminAddDogs from "@/pages/admin/DogAdminPages/AdminAddDogs";
import SetTotalDonation from "@/pages/admin/Donations/SetTotalDonation";
import Liquidation from "@/pages/Donation/Liquidation";
import AdoptedDogs from "@/pages/Ownerpage/AdoptedDogs";
import AdoptionPolicies from "@/pages/FAQ/AdoptionPolicies";
import AdoptedDetails from "@/pages/Ownerpage/AdoptedDetails";

// protect routes that require authentication
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

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.emailVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
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
        element: (
          <RedirectAuthenticatedUser>
            <Login />
          </RedirectAuthenticatedUser>
        ),
      },
      {
        path: "/signup",
        element: (
          <RedirectAuthenticatedUser>
            <Signup />
          </RedirectAuthenticatedUser>
        ),
      },
      {
        path: "/adoption",
        element: <Adoptionpage />,
      },
      {
        path: "/postadoption",
        element: (
          <ProtectedRoute>
            <PostForAdoption />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaigns",
        element: <DonationPage />,
      },
      {
        path: "/donations",
        element: <Liquidation />,
      },
      {
        path: "/location",
        element: <MapLocation />,
      },
      {
        path: "/educresources",
      },
      {
        path: "/email-verification",
        element: <EmailVerificationPage />,
      },
      {
        path: "/adoption-form/:dogId",
        element: <AdoptionFormPage />,
      },
      {
        path: "/volunteer",
        element: <Volunteer />,
      },
      {
        path: "/notification",
        element: <NotificationPage />,
      },
      {
        path: "/edit-dog/:id",
        element: <EditDogForm />,
      },
      {
        path: "/dogdetails/:dogId",
        element: (
          <ProtectedRoute>
            <DogDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/adopted-details/:dogId",
        element: (
          <ProtectedRoute>
            <AdoptedDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/campaigndetails/:campaignId",
        element: <CampaignDetails />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/myrequest",
        element: (
          <ProtectedRoute>
            <RequestPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/adopted-dogs",
        element: (
          <ProtectedRoute>
            <AdoptedDogs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/adoption-policy",
        element: <AdoptionPolicies />,
      },
    ],
  },

  {
    path: "admin-login",
    element: <AdminLogin />,
  },

  { path: "/scanned-data", element: <ScannedDogData /> },
  {
    path: "dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
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
      {
        path: "all-dogs",
        element: <AllDogs />,
      },
      {
        path: "create-campaign",
        element: <DonationCampaign />,
      },
      {
        path: "all-campaigns",
        element: <AllCampaigns />,
      },
      {
        path: "all-volunteers",
        element: <AllVolunteers />,
      },
      {
        path: "volunteer-request",
        element: <VolunteerRequest />,
      },
      {
        path: "approved-volunteer-request",
        element: <ApprovedVolunteeers />,
      },
      {
        path: "rejected-volunteer-request",
        element: <RejectedVolunteers />,
      },
      {
        path: "add-dog",
        element: <AdminAddDogs />,
      },
      {
        path: "all-donations",
        element: <SetTotalDonation />,
      },
    ],
  },
]);

export default router;
