import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import menuIcon from "../assets/menu.png";
import closeIcon from "../assets/close (1).png";
import appLogo from "../assets/Helpfurrlogo.png";
import { motion } from "framer-motion";
import { handleError, handleSuccess } from "../Utils/utils";
import { ToastContainer } from "react-toastify";
import { IoIosNotifications } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { useAuthStore } from "../store/authStore";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { TbDog } from "react-icons/tb";
import { IoMdHeartHalf } from "react-icons/io";
import { BiLogOutCircle } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { LuDog } from "react-icons/lu";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import "../index.css";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchNotifications } from "../Services/NotificationService";
import toast from "react-hot-toast";
import { Toast, ToastProvider } from "./ui/toast";
function Navbar(props) {
  const { user, logout } = useAuthStore();
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userId = user?._id;

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on userId change
  useEffect(() => {
    const getNotifications = async () => {
      if (userId) {
        const data = await fetchNotifications(userId);
        setNotifications(data);
      }
    };

    // Initial fetch
    getNotifications();

    // Set up polling to fetch notifications every 30 seconds
    const interval = setInterval(getNotifications, 500000);

    // Clean up interval when component unmounts or userId changes
    return () => clearInterval(interval);
  }, [userId]);

  // Get the notification count
  const notificationCount = notifications.length;

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

  const logoutHandler = () => {
    try {
      logout();
      Toast("Logged Out Succesfull");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      Toast("Logout Unsuccessful");
    }
  };

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-3 fixed top-0 z-20 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
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
          <img className="sm:w-14 w-12" src={appLogo} alt="" />
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-8 items-center">
          <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Home
            </Link>
          </li>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="hover:text-[#F69946] quicksand-semi-bold text-main-brown transition-colors duration-200 text-[16px] font-[400] cursor-pointer flex gap-1 items-center"
            >
              Adoption
              <span>
                <IoIosArrowDown />
              </span>
            </div>
            <ul
              tabIndex={0}
              className="flex dropdown-content bg-base-100 rounded-[4px] z-[1] mt-8 gap-4  px-4 py-4 "
            >
              <div className="flex flex-col gap-4 ">
                <div className="hover:bg-light-orange hover:text-main-orange p-4 rounded-lg w-[300px]">
                  <li className="hover:text-[#F69946] text-main-brown bg-b hover:rounded-tr-btn hover:rounded-br-btn paragraphFont  text-[16px] font-[400] cursor-pointer transition duration-200">
                    <Link
                      to="/adoption"
                      onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                      }}
                      className=""
                    >
                      <div className="flex gap-2 items-center">
                        <TbDog className="text-[24px] text-main-brow" />
                        <h1 className="flex fredoka-medium text-pretty h-full w-full text-[18px] font-bold tracking-wider">
                          Dogs
                        </h1>
                      </div>
                      <p className="text-secondary-brown quicksand-regular">
                        Find your new best friend today! Every dog deserves a
                        loving home. Adopt, don’t shop, and make a difference in
                        a pup’s life.
                      </p>
                    </Link>
                  </li>
                </div>
                <div className="hover:bg-light-orange hover:text-main-orange p-4 rounded-lg w-[300px]">
                  <li className="hover:text-[#F69946] text-main-brown bg-b hover:rounded-tr-btn hover:rounded-br-btn paragraphFont  text-[16px] font-[400] cursor-pointer transition duration-200">
                    <Link
                      to="/postadoption"
                      onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                      }}
                      className=""
                    >
                      <div className="flex gap-2 items-center">
                        <TbDog className="text-[24px] text-main-brow" />
                        <h1 className="flex h-full w-full text-[18px] font-bold fredoka-medium tracking-wider">
                          Post for adoption
                        </h1>
                      </div>
                      <p className="text-secondary-brown quicksand-regular">
                        Have a dog that needs a home? Post here and help them
                        find their forever family!
                      </p>
                    </Link>
                  </li>
                </div>
              </div>
              <div>
                {/* <div className="hover:bg-light-orange hover:text-main-orange p-4 rounded-lg w-[300px]">
                  <li className="hover:text-[#F69946] text-main-brown bg-b hover:rounded-tr-btn hover:rounded-br-btn paragraphFont  text-[16px] font-[400] cursor-pointer transition duration-200">
                    <Link
                      to="/matchmaking"
                      onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                      }}
                      className=""
                    >
                      <div className="flex gap-2 items-center">
                        <IoMdHeartHalf className="text-[24px] text-main-brow" />
                        <h1 className="flex h-full w-full text-[18px] font-bold fredoka-medium tracking-wider">
                          Dog Finder
                        </h1>
                      </div>
                      <p className="text-secondary-brown quicksand-regular">
                        Looking for a loyal companion? This sweet dog is
                        ready to join your family! Adopt today and make a
                        difference.
                      </p>
                    </Link>
                  </li>
                </div> */}
              </div>
            </ul>
          </div>
          <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/campaigns"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Campaigns
            </Link>
          </li>
          {/* <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/location"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Location
            </Link>
          </li> */}
          {/* <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/educresources"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Educational
            </Link>
          </li> */}
          <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
            <Link
              to="/volunteer"
              onClick={() => {
                setActive("");
                window.scrollTo(0, 0);
              }}
            >
              Book a Visit
            </Link>
          </li>

          <div>
            <Link to="/notification" className="relative">
              <IoIosNotifications className="text-[24px] text-secondary-orange" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>
          </div>

          <div className="">
            {user ? (
              <>
                <div className="dropdown dropdown-end ">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS Navbar component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="border dropdown-content bg-base-100 rounded-md z-[1] mt-3 w-52 px-4 py-6 flex flex-col gap-3 quicksand-regular"
                  >
                    <li>
                      <Sheet>
                        <SheetTrigger asChild>
                          <button className="flex items-center gap-2">
                            <FaRegUser />
                            <div>
                              <p>Profile</p>
                            </div>
                          </button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Profile</SheetTitle>
                          </SheetHeader>
                          <div className="mt-10 flex flex-col gap-3">
                            <div>
                              <img
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                alt=""
                                className="rounded-full max-w-40 mx-auto"
                              />
                              <span className="text-center flex justify-center quicksand-regular">
                                <Label className="text-sm quicksand-regular">
                                  Profile Picture
                                </Label>
                              </span>
                            </div>
                            <div className="gap-2 flex flex-col">
                              <Label>Name</Label>
                              <Input value={user?.name} />
                            </div>
                            <div className="gap-2 flex flex-col">
                              <Label value={user?.email}>Email Address</Label>
                              <Input />
                            </div>
                          </div>
                          <SheetFooter className="mt-4">
                            <SheetClose asChild>
                              <Button
                                className="bg-main-orange hover:text-main-brown hover:bg-light-orange quicksand-regular hover:outline outline-1 outline-main-orange"
                                type="submit"
                              >
                                Close
                              </Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                    </li>
                    <li className="flex items-center gap-2">
                      <FaRegFileAlt />
                      <Link to="/myrequest">My Requests</Link>
                    </li>
                    <li className="flex items-center gap-2">
                      <LuDog  />
                      <Link to="/adopted-dogs">Adopted Dogs</Link>
                    </li>
                    <li className="flex items-center gap-2">
                      <BiLogOutCircle />

                      <button onClick={logoutHandler}>Logout</button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => {
                    setActive("");
                    window.scrollTo(0, 0);
                  }}
                  className=" text-main-orange rounded-full py-3 px-8 bg-light-orange border-main-orange border	 quicksand-semi-bold uppercase sm:text-[18px] text-[16px] hover:bg-main-orange hover:text-light-orange duration-200 transition "
                >
                  Sign-up
                </Link>
              </>
            )}
          </div>
        </ul>
        <div className="md:hidden flex items-center gap-3">
          <div>
            <Link to="/notification" className="relative">
              <IoIosNotifications className="text-[24px] text-secondary-orange" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button>
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="justify-start">
                  <div className="flex items-center justify-between w-full">
                    <Link
                      to="/"
                      className="flex items-center gap-2 "
                      onClick={() => {
                        setActive("");
                        window.scrollTo(0, 0);
                      }}
                    >
                      <img className="sm:w-14 w-12" src={appLogo} alt="" />
                    </Link>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4 quicksand-regular text-sm">
                <ul className="list-none h-[100vh] flex items-center justify-center flex-1  flex-col gap-4">
                  <div className="h-screen w-full">
                    <div className="mx-auto w-full max-w-lg divide-y divide-white/5">
                      <Disclosure as="div" className="" defaultOpen={false}>
                        <DisclosureButton className="group flex w-full items-center justify-between">
                          <span className="text-base/6 text-main-brown group-data-[hover]:text-white/80">
                            Adoption
                          </span>
                          <IoIosArrowDown className="size-5 text-main-brown group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                          <ul>
                            <li className=" text-main-brown  bg-b hover:rounded-tr-btn hover:rounded-br-btn paragraphFont hover:bg-light-orange pl-2 pr-4 py-2 border-l-2 hover:border-l-main-orange text-[16px] font-[400] cursor-pointer transition duration-200">
                              <Link
                                to="/adoption"
                                onClick={() => {
                                  setActive("");
                                  window.scrollTo(0, 0);
                                }}
                                className="flex h-full w-full"
                              >
                                Dogs
                              </Link>
                            </li>
                            <li className=" text-main-brown bg-b hover:rounded-tr-btn hover:rounded-br-btn paragraphFont hover:bg-light-orange pl-2 pr-4 py-2 border-l-2 hover:border-l-main-orange text-[16px] font-[400] cursor-pointer transition duration-200">
                              <Link
                                to="/postadoption"
                                onClick={() => {
                                  setActive("");
                                  window.scrollTo(0, 0);
                                }}
                                className="whitespace-nowrap"
                              >
                                Post for adoption
                              </Link>
                            </li>
                          </ul>
                        </DisclosurePanel>
                      </Disclosure>
                      <ul className="flex flex-col gap-3 mt-3">
                        <li className="hover:text-[#F69946]  quicksand-semi-bold text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
                          <Link
                            to="/campaigns"
                            onClick={() => {
                              setActive("");
                              window.scrollTo(0, 0);
                            }}
                          >
                            Campaigns
                          </Link>
                        </li>
                        <li className="text-main-brown transition-colors paragraphFont duration-300 text-[16px] font-[400] cursor-pointer">
                          <Link
                            to="/volunteer"
                            onClick={() => {
                              setActive("");
                              window.scrollTo(0, 0);
                            }}
                          >
                            Book a Visit
                          </Link>
                        </li>
                        <li>
                          <div className="w-full flex justify-end">
                            {user ? (
                              <>
                                <div className="dropdown dropdown-end  px-4 py-6 flex flex-col gap-2  quicksand-regular">
                                  <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-ghost btn-circle avatar"
                                  >
                                    <div className="w-10 rounded-full">
                                      <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                      />
                                    </div>
                                  </div>
                                  <ul
                                    tabIndex={0}
                                    className=" dropdown-content bg-base-100 rounded-box z-[1] mt-14 w-52 px-4 py-6 flex flex-col gap-2 quicksand-regular border"
                                  >
                                    <li>
                                      <Sheet>
                                        <SheetTrigger asChild>
                                          <button className="flex gap-2 items-center">
                                            <FaRegUser />
                                            <div>
                                              <p>Profile</p>
                                            </div>
                                          </button>
                                        </SheetTrigger>
                                        <SheetContent>
                                          <SheetHeader>
                                            <SheetTitle>Profile</SheetTitle>
                                          </SheetHeader>
                                          <div className="mt-10 flex flex-col gap-3">
                                            <div>
                                              <img
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                alt=""
                                                className="rounded-full max-w-40 mx-auto"
                                              />
                                              <span className="text-center flex justify-center quicksand-regular">
                                                <Label className="text-sm quicksand-regular">
                                                  Profile Picture
                                                </Label>
                                              </span>
                                            </div>
                                            <div className="gap-2 flex flex-col">
                                              <Label>Name</Label>
                                              <Input value={user?.name} />
                                            </div>
                                            <div className="gap-2 flex flex-col">
                                              <Label value={user?.email}>
                                                Email Address
                                              </Label>
                                              <Input />
                                            </div>
                                          </div>
                                          <SheetFooter className="mt-4">
                                            <SheetClose asChild>
                                              <Button
                                                className="bg-main-orange hover:text-main-brown hover:bg-light-orange quicksand-regular hover:outline outline-1 outline-main-orange"
                                                type="submit"
                                              >
                                                Save changes
                                              </Button>
                                            </SheetClose>
                                          </SheetFooter>
                                        </SheetContent>
                                      </Sheet>
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <FaRegFileAlt />
                                      <Link to="/myrequest">My Requests</Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <LuDog  />
                                      <Link to="/adopted-dogs">
                                        Adopted Dogs
                                      </Link>
                                    </li>
                                    <li className="flex items-center gap-2">
                                      <BiLogOutCircle />

                                      <button onClick={logoutHandler}>
                                        Logout
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              </>
                            ) : (
                              <>
                                <Link
                                  to="/signup"
                                  onClick={() => {
                                    setActive("");
                                    window.scrollTo(0, 0);
                                  }}
                                  className="flex justify-center text-light-orange rounded-lg py-3 px-5 bg-main-orange uppercase sm:text-[18px] text-[16px] hover:bg-main-brown duration-200 transition "
                                >
                                  Sign-up
                                </Link>
                              </>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <ToastProvider />
    </nav>
  );
}

export default Navbar;
