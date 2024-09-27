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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/adoption",
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
    ],
  },

  {
    path: 'dashboard',
    element: <DashboardLayout/>,
    children: [
      {
        path: '',
        element: <Dashboard/>,
      },
      {
        path: 'users',
        element: <Users/>
      }
    ]
  }
]);



export default router;
