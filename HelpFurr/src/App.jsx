import { useState } from "react";
import "./App.css";
import { Navigate, Outlet, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./pages/homepage/Home.jsx";
import Navbar from "./components/Navbar";
import RefreshHandler from "./RefreshHandler";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };
  return (
    <div className="mt-32">
      <Navbar />
      {/* <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />


        
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes> */}
      <Outlet/>
    </div>
  );
}

export default App;
