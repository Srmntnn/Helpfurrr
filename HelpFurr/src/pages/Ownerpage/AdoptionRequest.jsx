import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SlOptionsVertical } from "react-icons/sl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
function AdoptionRequest() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [forms, setForms] = useState([]);
  const [dogs, setDogs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch forms and associated dog data
  const fetchForms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/form/getForms/${user.email}`
      );
      setForms(response.data);

      const dogDataPromises = response.data.map(async (form) => {
        const dogResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/dogs/getdogbyId/${form.dogId}`
        );
        return { dogId: form.dogId, data: dogResponse.data };
      });

      const resolvedDogs = await Promise.all(dogDataPromises);
      const dogsMap = resolvedDogs.reduce((acc, { dogId, data }) => {
        acc[dogId] = data;
        return acc;
      }, {});

      setDogs(dogsMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a form
  const handleDelete = async (formId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/form/delete/${formId}`
      );
      setForms(forms.filter((form) => form._id !== formId)); // Remove deleted form from state
      alert("Form deleted successfully!");
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete the form.");
    }
  };

  // Edit a form
  const handleEdit = (formId) => {
    navigate(`/edit-form/${formId}`); // Redirect to edit form page
  };

  useEffect(() => {
    if (user?.email) {
      fetchForms();
    }
  }, [user]);

  return (
    <div>
      <section>
        <motion.div
          className="w-full h-screen max-w-screen-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-md border my-12 ">
            {isLoading ? (
              <Loader className="mx-auto">Loading...</Loader>
            ) : error ? (
              <p>Error: {error}</p>
            ) : forms.length === 0 ? (
              <p>No forms found for this user.</p>
            ) : (
              <div className="relative w-full overflow-auto quicksand-regular text-nowrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Form Information</th>
                      <th>Contact Reference</th>
                      <th>Occupation</th>
                      <th>Phone Number</th>
                      <th>Dog Information</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="quicksand-regular">
                    {forms.map((form, index) => (
                      <tr key={form._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div>
                            <p>
                              <strong>Adoptor Name:</strong> {form.adopterName}
                            </p>
                            <p>
                              <strong>Adoptor Email:</strong> {form.email}
                            </p>
                          </div>
                        </td>
                        <td>{form.contactReference}</td>
                        <td>{form.phoneNo}</td>
                        <td>{form.occupation}</td>
                        <td>
                          {dogs[form.dogId] ? (
                            <div className="flex items-center gap-4">
                              <div className="mask mask-squircle h-12 w-12">
                                <img src={dogs[form.dogId].image[0]} alt="" />
                              </div>
                              <div>
                                <p>
                                  <strong>Dog Name:</strong>{" "}
                                  {dogs[form.dogId].name}
                                </p>
                                <p>
                                  <strong>Color:</strong>{" "}
                                  {dogs[form.dogId].color}
                                </p>
                                <p>
                                  <strong>Age:</strong> {dogs[form.dogId].age}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p>Loading dog info...</p>
                          )}
                        </td>
                        <td>{form.status}</td>
                        <td>
                          <DropdownMenu >
                            <DropdownMenuTrigger>
                              <SlOptionsVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel className="quicksand-regular">Action</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <button
                                  className=" text-main-brown px-4 py-2 rounded-lg mr-2 quicksand-regular"
                                  onClick={() => handleEdit(form._id)}
                                >
                                  Edit
                                </button>
                              </DropdownMenuItem>

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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AdoptionRequest;
