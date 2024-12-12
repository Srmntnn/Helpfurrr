import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Helmet } from "react-helmet";
import axios from "axios"; // Import Axios
import { SlOptionsVertical } from "react-icons/sl";
import { Button } from "../../components/button";
import { styles } from "../../styles";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/LoadingSpinner";

function AdoptedDogs() {
  const { user } = useAuthStore();
  const [dogs, setDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDogs = async () => {
    if (!user?.email) {
      setError("User email not available.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/dogs/adopted-email/${user.email}`
      );
      setDogs(response.data);
    } catch (error) {
      console.error("Error fetching dogs:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchDogs();
    }
  }, [user]); // Dependency only on user

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "dog_qr_code.png"; // Specify the desired file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <section className={`${styles.paddingX}  `}>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto max-h-[310px] h-full w-full max-w-[310px] rounded-full bg-main-orange opacity-30 blur-[100px]"></div>
      </div>
      <motion.div
        className=" w-full min-h-[400px] max-w-screen-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-[128px]">
          <h1 className="text-center sm:text-4xl fredoka-bold tracking-wider text-main-orange">
            Adopted Dogs
          </h1>
        </div>
        <div className="rounded-md border my-12 text-center p-5 quicksand-semi-bold ">
          {isLoading ? (
            <Loader className="mx-auto"></Loader>
          ) : error ? (
            <p>Error: {error}</p>
          ) : dogs.length === 0 ? (
            <p>No dogs found for this user.</p>
          ) : (
            <div>
              <div className="relative w-full overflow-auto quicksand-regular">
                <table className="table">
                  <thead className="[&_tr]:border-b ">
                    <tr className="quicksand-bold">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        #
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Dog Profile
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Dog Age
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Dog Gender
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Dog Condition
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Other Information
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Owner Information
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Dog QR
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {dogs.map((dog, index) => (
                    <tbody
                      key={dog.id}
                      className="[&_tr:last-child]:border-1 hover:[&_tr:last-child]:bg-light-orange cursor-pointer hover:[&_tr:last-child]:text-main-orange transition duration-300"
                    >
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover: ">
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 ">
                          {index + 1} {/* Display index + 1 */}
                        </td>

                        <td className="">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src={dog.image[0]} alt={dog.name} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{dog.name}</div>
                              <div className="text-sm opacity-50">
                                {dog.shelter}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {dog.age}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {dog.gender}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {dog.condition}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          {dog.status}
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <div className="flex flex-col capitalize">
                            <p>Vaccinated: {dog.vaccinated}</p>
                            <p>Adoption Urgency: {dog.urgent}</p>
                            <p>Neutered: {dog.neutered}</p>
                          </div>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <div className="flex flex-col">
                            <p>{dog.postedBy}</p>
                            <p>{dog.clientEmail}</p>
                            <p> {dog.phone}</p>
                          </div>
                        </td>
                        <td>
                          <AlertDialog>
                            <AlertDialogTrigger className="underline text-secondary-orange">
                              View QR
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  <h1 className="quicksand-bold">
                                    {dog.name} QR Code
                                  </h1>
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  <img
                                    className="w-full"
                                    src={dog.qrCodeUrl}
                                    alt="wait for the admin to post the Qr code"
                                  />
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => downloadImage(dog.qrCodeUrl)}
                                  className="bg-main-orange hover:bg-secondary-orange quicksand-regular"
                                >
                                  Download
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <SlOptionsVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel>Action</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Link to={`/edit-dog/${dog._id}`}>
                                  <button>Edit</button>
                                </Link>

                                {/* <button
                                  disabled={isApproving || isRejecting}
                                  onClick={() => handleApprove(request)}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 w-full"
                                >
                                  {isApproving ? "Approving..." : "Approve"}
                                </button>{" "} */}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link to={`/adopted-details/${dog._id}`}>
                                  View Details
                                </Link>
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
}

export default AdoptedDogs;
