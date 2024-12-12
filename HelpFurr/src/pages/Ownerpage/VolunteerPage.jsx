import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Helmet } from "react-helmet";
import axios from "axios"; // Import Axios
import { SlOptionsVertical } from "react-icons/sl";
import { Button } from "../../components/button";
import { styles } from "../../styles";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { format } from "date-fns"; // Import the date formatting function
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserRequestedDogs = () => {
  const { user } = useAuthStore();
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVolunteers = async () => {
    if (!user?.email) {
      setError("User email not available.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/volunteers/visit-request/${user.email}`
      );
      setVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching Volunteer Request:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchVolunteers();
    }
  }, [user]); // Dependency only on user

  return (
    <section>
      <motion.div
        className=" w-full max-w-screen-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-md border my-12 text-center p-5 quicksand-semi-bold">
          {isLoading ? (
            <Loader className="mx-auto p-6">Loading volunteers...</Loader>
          ) : error ? (
            <p>Error: {error}</p>
          ) : volunteers.length === 0 ? (
            <p>No volunteer request found for this user.</p>
          ) : (
            <div>
              <div className="relative w-full overflow-auto">
                <table className="table">
                  <thead className="[&_tr]:border-b">
                    <tr className="">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        #
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Volunteer Profile
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Type of Visit
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Visit Date
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Visit Time
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Total Visitors
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Questions
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {volunteers.map((volunteers, index) => (
                    <tbody
                      key={volunteers.id}
                      className="[&_tr:last-child]:border-0"
                    >
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted quicksand-regular">
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {index + 1} {/* Display index + 1 */}
                        </td>

                        <td className="">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-bold flex gap-1">
                                <p>{volunteers.visitorName}</p>{" "}
                                <p>{volunteers.visitorLastName}</p>
                              </div>
                              <div className="text-sm opacity-50">
                                {volunteers.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {volunteers.typeOfVisit}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {format(new Date(volunteers.visitDate), "PPP")}{" "}
                          {/* Format date */}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {volunteers.visitTime}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {volunteers.status}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <p>{volunteers.totalVisitors}</p>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <p>{volunteers.questions}</p>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <SlOptionsVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel className="quicksand-regular">
                                Action
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <button
                                  className=" text-main-brown px-4 py-2 rounded-lg  quicksand-regular"
                                  onClick={() =>
                                    window.confirm(
                                      "Are you sure you want to delete this form?"
                                    ) && handleDelete(form._id)
                                  }
                                >
                                  Delete
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default UserRequestedDogs;
