import React from "react";
import { Outlet, Link } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { GiSittingDog } from "react-icons/gi";
import { ImUsers } from "react-icons/im";
import { FaDog } from "react-icons/fa";
import { SiGoogleforms } from "react-icons/si";
import { Disclosure } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

function dashboardLayout() {
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <div>
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <RiDashboardFill />
            </label>
            <button className="btn rounded-full, px-6 sm:hidden">Logout</button>
          </div>
          <Outlet />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}

            <li className="">
              <Link to="/dashboard">
                <RiDashboardFill />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/users">
                <ImUsers />
                All Users
              </Link>
            </li>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Dogs</span>
                    <IoIosArrowDown
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4">
                    <li>
                      <Link to="/dashboard/postingdogs">
                        <FaDog />
                        Requests
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/approvedDogs">
                        <GiSittingDog />
                        Approved Dogs
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/adoptionrequest">
                        <SiGoogleforms />
                        Adoption Request
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/adoptedhistory">
                        <SiGoogleforms />
                        Adoption History
                      </Link>
                    </li>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Campaigns</span>
                    <IoIosArrowDown
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4">
                    <li>
                      <Link to="/dashboard/campaignrequest">
                        <FaDog />
                        Campaign Requests
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/approvedcampaign">
                        <GiSittingDog />
                        Approved Campaigns
                      </Link>
                    </li>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                    <span>Volunteers</span>
                    <IoIosArrowDown
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pb-2 pt-4">
                    <li>
                      <Link to="/dashboard/volunteer-request">
                        <FaDog />
                        Volunteer Requests
                      </Link>
                    </li>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default dashboardLayout;
