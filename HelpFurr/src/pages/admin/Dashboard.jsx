import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { IoPeopleOutline } from "react-icons/io5";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { LuDog } from "react-icons/lu";
import { MdCampaign } from "react-icons/md";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import axios from "axios"; // Don't forget to import axios if not already imported
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  // const { refetch, data: userss = [] } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => {
  //     const res = await axios.get("/users");
  //     return res.data;
  //   },
  // });

  // Fetch requests when component mounts
  const fetchDogs = async () => {
    try {
      const dogs = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/dogs/all-dogs`
      );
      setDogs(dogs.data);
      setError(null); // Clear any previous errors on success
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const campaigns = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/campaigns/get-all-campaigns`
      );
      setCampaigns(campaigns.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(
        error.campaigns?.data?.message ||
          error.message ||
          "An error occurred fetching requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const forms = await fetch("http://localhost:8080/form/getForms");
      if (!forms.ok) {
        throw new Error("An error occurred while fetching forms.");
      }
      const data = await forms.json();
      setForms(data);
      setTotalRequests(data.length); // Update total requests count
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const volunteers = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/volunteers/all-volunteer`
      );
      setVolunteers(volunteers.data);
      setTotalRequests(volunteers.data.length); // Update total requests count
    } catch (error) {
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/users`
      );
      setUsers(users.data);
      setError(null); // Clear any previous errors on success
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError(error.message || "An error occurred fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication status
    fetchDogs();
    fetchForms();
    fetchCampaigns();
    fetchVolunteers();
    fetchUsers(); // Fetch requests after mounting
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Render loading state if auth is being checked
  }

  return (
    <section className="p-6">
      <div className="flex w-full gap-8 sm:flex-row flex-col flex-wrap justify-between">
        <div className="w-full px-16 py-10 rounded-lg flex items-center shadow-md shadow-gray-100 justify-between">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            Welcome Back{" "}
            <span className="text-main-orange capitalize">{user.name}</span>
          </h5>
          <div className=" quicksand-regular flex gap-6 ">
            <div className="h-16 w-0.5 rounded bg-gray-300"></div>
            {user ? (
              <div className="flex flex-col text-center w-full">
                <p className="text-main-orange font-bold capitalize text-lg">
                  {user.name}
                </p>
                <p>{user.email}</p>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6 w-full">
        {/* Users Section */}
        <div className="px-3 py-3 rounded-md w-full relative shadow-md shadow-gray-100 overflow-hidden">
          <div className=" ">
            <h1 className="text-lg quicksand-bold text-secondary-brown">
              Users
            </h1>

            <div className="flex items-center justify-center gap-3 text-main-orange mb-10">
              <p className="text-6xl fredoka-bold font-semibold text-main-brown">
                {users.length}
              </p>
              <IoPeopleOutline className="text-8xl" />
            </div>
          </div>
          <div className="bg-main-orange absolute bottom-0 left-0 w-full py-2 px-4">
            <Link
              className="text-light-orange quicksand-regular flex items-center justify-between "
              to="/dashboard/users"
            >
              See more
              <span>
                <HiOutlineArrowNarrowRight className="text-2xl" />
              </span>
            </Link>
          </div>
        </div>

        {/* Dogs Section */}
        <div className="px-3 py-3 rounded-md w-full relative shadow-md shadow-gray-100 overflow-hidden">
          <div className=" ">
            <h1 className="text-lg quicksand-bold text-secondary-brown">
              Dogs
            </h1>

            <div className="flex items-center justify-center gap-3 text-main-orange mb-10">
              <p className="text-6xl fredoka-bold font-semibold text-main-brown">
                {dogs.length}
              </p>
              <LuDog className="text-8xl" />
            </div>
          </div>
          <div className="bg-main-orange absolute bottom-0 left-0 w-full py-2 px-4">
            <Link
              className="text-light-orange quicksand-regular flex items-center justify-between "
              to="/dashboard/all-dogs"
            >
              See more
              <span>
                <HiOutlineArrowNarrowRight className="text-2xl" />
              </span>
            </Link>
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="px-3 py-3 rounded-md w-full relative shadow-md shadow-gray-100 overflow-hidden">
          <div className=" ">
            <h1 className="text-lg quicksand-bold text-secondary-brown">
              Campaigns
            </h1>

            <div className="flex items-center justify-center gap-3 text-main-orange mb-10">
              <p className="text-6xl fredoka-bold font-semibold text-main-brown">
                {campaigns.length}{" "}
                {/* Assuming you want to show number of dogs in campaigns */}
              </p>
              <MdCampaign className="text-8xl" />
            </div>
          </div>
          <div className="bg-main-orange absolute bottom-0 left-0 w-full py-2 px-4">
            <Link
              className="text-light-orange quicksand-regular flex items-center justify-between "
              to="/dashboard/all-campaigns"
            >
              See more
              <span>
                <HiOutlineArrowNarrowRight className="text-2xl" />
              </span>
            </Link>
          </div>
        </div>

        {/* Adoption Forms Section */}
        <div className="px-3 py-3 rounded-md w-full relative shadow-md shadow-gray-100 overflow-hidden">
          <div className=" ">
            <h1 className="text-lg quicksand-bold text-secondary-brown">
              Adoption Forms
            </h1>

            <div className="flex items-center justify-center gap-3 text-main-orange mb-10">
              <p className="text-6xl fredoka-bold font-semibold text-main-brown">
                {forms.length} {/* Same as above for adoption forms */}
              </p>
              <FaWpforms className="text-8xl" />
            </div>
          </div>
          <div className="bg-main-orange absolute bottom-0 left-0 w-full py-2 px-4">
            <Link
              className="text-light-orange quicksand-regular flex items-center justify-between "
              to="/dashboard/adoptionrequest"
            >
              See more
              <span>
                <HiOutlineArrowNarrowRight className="text-2xl" />
              </span>
            </Link>
          </div>
        </div>

        {/* Visits/Volunteers Section */}
        <div className="px-3 py-3 rounded-md w-full relative shadow-md shadow-gray-100 overflow-hidden">
          <div className=" ">
            <h1 className="text-lg quicksand-bold text-secondary-brown">
              Visits/Volunteers
            </h1>

            <div className="flex items-center justify-center gap-3 text-main-orange mb-10">
              <p className="text-6xl fredoka-bold font-semibold text-main-brown">
                {volunteers.length} {/* Number of dogs as default */}
              </p>
              <MdOutlineVolunteerActivism className="text-8xl" />
            </div>
          </div>
          <div className="bg-main-orange absolute bottom-0 left-0 w-full py-2 px-4">
            <Link
              className="text-light-orange quicksand-regular flex items-center justify-between "
              to="/dashboard/all-volunteers"
            >
              See more
              <span>
                <HiOutlineArrowNarrowRight className="text-2xl" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="max-w-[634px] w-full   mt-12 ">
          <div className="flex justify-between items-center mr-6">
            <h1 className="text-lg px-7 py-2 quicksand-bold text-main-orange pt-3 rounded-t-md border-b-0 border">
              Visit Requests
            </h1>
            <Link to="/dashboard/all-volunteers">
              <span>
                <HiOutlineArrowNarrowRight className="text-3xl text-main-orange" />
              </span>
            </Link>
          </div>
          <ScrollArea className=" whitespace-nowrap rounded-md border rounded-t-none">
            {loading || isCheckingAuth ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : volunteers.length > 0 ? (
              <div className="w-full rounded-md">
                <Table className="divide-y divide-gray-200 quicksand-regular rounded-lg">
                  <TableHeader className="quicksand-bold">
                    <TableRow className="text-main-orange">
                      <TableHead>#</TableHead>
                      <TableHead>Type of Visit</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Visit Time</TableHead>
                      <TableHead>Total Visitors</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.slice(0, 4).map((volunteer, index) => (
                      <TableRow key={volunteer._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{volunteer.typeOfVisit}</TableCell>
                        <TableCell>
                          {new Date(volunteer.visitDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{volunteer.visitTime}</TableCell>
                        <TableCell>{volunteer.totalVisitors}</TableCell>
                        <TableCell>{volunteer.questions}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="font-bold">
                              {`${volunteer.visitorName} ${volunteer.visitorLastName}`}
                            </div>
                            <p>{volunteer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{volunteer.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No requests available</p>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className=" max-w-[634px] w-full  mt-12">
          <div className="flex justify-between items-center mr-6">
            <h1 className="text-lg px-7 py-2 quicksand-bold text-main-orange pt-3 rounded-t-md border-b-0 border">
              Adoption Requests
            </h1>
            <Link to="/dashboard/all-volunteers">
              <span>
                <HiOutlineArrowNarrowRight className="text-3xl text-main-orange" />
              </span>
            </Link>
          </div>
          <ScrollArea className="whitespace-nowrap rounded-md border rounded-t-none">
            {loading || isCheckingAuth ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : forms.length > 0 ? (
              <div className="w-full rounded-md">
                <Table className="divide-y divide-gray-200 quicksand-regular rounded-lg">
                  <TableHeader className="quicksand-bold">
                    <TableRow className="text-main-orange">
                      <TableHead>#</TableHead>
                      <TableHead>Dog Name</TableHead>
                      <TableHead>Contact Reference</TableHead>
                      <TableHead>Adopter Info</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forms.slice(0, 3).map((form, index) => {
                      // Find the dog's name using dogId
                      const dog = dogs.find((d) => d._id === form.dogId);
                      const dogName = dog ? dog.name : "Unknown Dog";

                      return (
                        <TableRow key={form._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{dogName}</TableCell>
                          <TableCell>{form.contactReference}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="font-bold">
                                {form.adopterName}
                              </div>
                              <p>{form.email}</p>
                              <p>{form.phoneNo}</p>
                            </div>
                          </TableCell>
                          <TableCell>{form.status}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p>No requests available</p>
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="border basis-1/5 mt-12 rounded-md relative overflow-hidden">
          <h1 className="text-2xl px-6 py-3 quicksand-bold text-main-orange">
            Newest Dog
          </h1>
          <ScrollArea className=" whitespace-nowrap rounded-md h-80 rounded-t-none">
            {loading || isCheckingAuth ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error-message">Error: {error}</p>
            ) : dogs.length > 0 ? (
              <div className="w-full">
                <div className="p-5 flex flex-col gap-2">
                  {dogs.map((dogs, index) => (
                    <div className="flex items-center  gap-2 ">
                      <img
                        src={dogs.image[0]}
                        alt=""
                        className="w-11 object-cover aspect-square rounded-full"
                      />
                      <p className="quicksand-bold text-secondary-brown">
                        {dogs.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No requests available</p>
            )}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <Link className="bg-main-orange absolute bottom-0 left-0 w-full px-4 py-2 flex items-center justify-between text-light-orange quicksand-regular text-sm">
            See more
            <span>
              <HiOutlineArrowNarrowRight className="text-2xl" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
