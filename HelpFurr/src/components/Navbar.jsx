import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import menuIcon from "../assets/menu.svg";
import closeIcon from "../assets/close.svg";
import { handleError, handleSuccess } from "../Utils/utils";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";

function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);

  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      handleSuccess('Logged Out Succesfull');
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      handleError("Logout Unsuccessful");
    }
  };

  
  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-[#03000C]" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between max-w-screen-2xl mx-auto items-center">
        <Link
          to=""
          className="flex items-center gap-2 "
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <h1 className="font-bold text-[46px]">LOGO</h1>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-8 items-center">
          <li className="hover:text-[#F69946] text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/adoption"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Adoption
            </Link>
          </li>
          <li className="hover:text-[#F69946] text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/donation"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Donation
            </Link>
          </li>
          <li className="hover:text-[#F69946] text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/location"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Location
            </Link>
          </li>
          <li className="hover:text-[#F69946] text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/educresources"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Educational Resources
            </Link>
          </li>

          <div className="sm:ml-4 border-2 border-main-brown border-solid rounded-[8px] w-[165px] h-[64px] flex items-center justify-center drop-shadow-drop">
            {userInfo ? (
              <>
                <div onClick={logoutHandler}>Logout</div>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => {
                    setActive("");
                    window.scrollTo(0, 0);
                  }}
                  className=" text-[#F69946] uppercase sm:text-[21px] text-[18px] "
                >
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </ul>

        <div className="sm:hidden flex item-center">
          <img
            src={toggle ? closeIcon : menuIcon}
            alt="menu"
            className="w-7 h-7 object-contain"
            onClick={() => setToggle(!toggle)}
          />
        </div>

        <div
          className={`${
            styles.paddingX
          } absolute top-0 right-0 bg-[#03000C] sm:hidden py-5 min-w-[100%] z-10 ${
            !toggle ? "hidden" : "flex"
          }`}
        >
          <img
            src={closeIcon}
            alt=""
            onClick={() => setToggle(!toggle)}
            className="absolute right-6 top-9 w-7 h-7 object-contain"
          />
          <ul className="list-none h-[100vh] flex items-center justify-center flex-1  flex-col gap-4">
            <li
              className="hover:text-[#DF6BBE] paragraphFont transition-colors duration-300 text-[16px] font-[400] cursor-pointer"
              onClick={() => {
                setToggle(!toggle);
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              <Link to="">Aenon</Link>
            </li>
            <li
              className="hover:text-[#DF6BBE] paragraphFont transition-colors duration-300 text-[16px] font-[400] cursor-pointer"
              onClick={() => {
                setToggle(!toggle);
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              <Link to="">Gracien</Link>
            </li>
          </ul>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
}

export default Navbar;
