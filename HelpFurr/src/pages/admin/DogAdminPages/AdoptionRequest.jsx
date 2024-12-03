import React, { useState, useEffect } from "react";
import FormCard from "./FormCards";
import { useAuthStore } from "../../../store/authStore";

const AdoptionRequests = () => {
  const [forms, setForms] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState("");
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const [totalUsers, setTotalUsers] = useState(0); // State to hold the total users
  const [totalRequests, setTotalRequests] = useState(0); // State to hold the total requests count

  // Fetching the forms data (adoption requests)
  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:8080/form/getForms");
      if (!response.ok) {
        throw new Error("An error occurred while fetching forms.");
      }
      const data = await response.json();
      setForms(data);
      setTotalRequests(data.length); // Update total requests count
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching the dogs data
  const fetchDogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/dogs/approvedPets");
      if (!response.ok) {
        throw new Error("An error occurred while fetching dogs.");
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`); 
      if (!response.ok) {
        throw new Error("An error occurred while fetching users.");
      }
      const data = await response.json();
      setTotalUsers(data.length); 
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchForms();
    fetchDogs();
    fetchUsers();
  }, []);

  // Filtering dogs with existing adoption requests
  const dogsWithRequests = dogs.filter((dog) =>
    forms.some((form) => form.dogId === dog._id)
  );

  const displayPetDetails = (dog) => {
    setSelectedPet(dog);
    setPetDetailsPopup(true);
  };

  const closePetDetailsPopup = () => {
    setPetDetailsPopup(false);
    setSelectedPet(null);
  };

  const handlePetChange = (event) => {
    setSelectedPetId(event.target.value);
  };

  const filteredPets = selectedPetId
    ? dogsWithRequests.filter((dog) => dog._id === selectedPetId)
    : dogsWithRequests;

  // Check authentication status
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:px-16 p-8">
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md border border-secondary-orange">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of <span className="text-main-orange">Adoption Requests</span>
          </h5>
          <h5 className="quicksand-regular">
            Total Adoption Requests: {totalRequests}
          </h5>{" "}
          {/* Display the total requests */}
        </div>

        <div className="basis-1/3 py-8 rounded-lg border border-secondary-orange quicksand-regular shadow-md">
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

      <div
        className="dropdown-container"
        style={{ textAlign: "right", marginBottom: "20px" }}
      >
        <select
          className="req-filter-selection"
          onChange={handlePetChange}
          value={selectedPetId}
        >
          <option value="">All Requests</option>
          {dogsWithRequests.map((dog) => (
            <option key={dog._id} value={dog._id}>
              {dog.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPets.length > 0 ? (
        filteredPets.map((dog) => {
          const petForms = forms.filter((form) => form.dogId === dog._id);
          return (
            <div key={dog._id} className="border">
              <div className="px-4 pt-4">
                <h2
                  className="cursor-pointer fredoka-bold tracking-wider text-main-orange text-2xl"
                  onClick={() => displayPetDetails(dog)}
                >
                  {dog.name}
                </h2>
              </div>
              <div className="form-child-container">
                {petForms.map((form) => (
                  <FormCard
                    key={form._id}
                    form={form}
                    dog={dog}
                    updateCards={fetchForms}
                    deleteBtnText={"Reject"}
                    approveBtn={true}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div>No adoption requests available for any pet.</div>
      )}

      {petDetailsPopup && selectedPet && (
        <div className="popup">
          <div className="popup-content">
            <div className="pet-view-card">
              <div className="w-40">
                <img
                  src={selectedPet.image[0]}
                  alt={selectedPet.name}
                />
              </div>
              <div>
                <h2>{selectedPet.name}</h2>
                <p>
                  <b>Type:</b> {selectedPet.type}
                </p>
                <p>
                  <b>Age:</b> {selectedPet.age}
                </p>
                <p>
                  <b>Location:</b> {selectedPet.shelter}
                </p>
                <p>
                  <b>Owner Email:</b> {selectedPet.email}
                </p>
                <p>
                  <b>Owner Phone:</b> {selectedPet.phone}
                </p>
                <p>
                  <b>Condition:</b> {selectedPet.condition}
                </p>
              </div>
            </div>
            <button onClick={closePetDetailsPopup} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionRequests;
