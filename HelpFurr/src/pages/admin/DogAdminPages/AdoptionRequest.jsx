import React, { useState, useEffect, Fragment } from "react";
import FormCard from "./FormCards";
import { useAuthStore } from "../../../store/authStore";
import { Dialog, Transition } from "@headlessui/react";

const AdoptionRequests = () => {
  const [forms, setForms] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState("");
  const { user, isCheckingAuth, checkAuth } = useAuthStore();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);

  // Fetching data functions
  const fetchForms = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/form/getForms`
      );
      if (!response.ok)
        throw new Error("An error occurred while fetching forms.");
      const data = await response.json();
      setForms(data);
      setTotalRequests(data.length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDogs = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/dogs/approvedPets`
      );
      if (!response.ok)
        throw new Error("An error occurred while fetching dogs.");
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
      if (!response.ok)
        throw new Error("An error occurred while fetching users.");
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
    checkAuth();
  }, [checkAuth]);

  // Filtering logic
  const dogsWithRequests = dogs.filter((dog) =>
    forms.some((form) => form.dogId === dog._id)
  );

  const handlePetChange = (event) => {
    setSelectedPetId(event.target.value);
  };

  const filteredPets = selectedPetId
    ? dogsWithRequests.filter((dog) => dog._id === selectedPetId)
    : dogsWithRequests;

  const openModal = (dog) => {
    setSelectedPet(dog);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPet(null);
    setIsOpen(false);
  };

  if (isCheckingAuth) return <div>Loading...</div>;

  return (
    <div className="md:px-16 p-8">
      <div className="flex w-full gap-8 sm:flex-row flex-col">
        <div className="w-full px-16 py-8 rounded-lg shadow-md shadow-gray-200">
          <h5 className="fredoka-bold tracking-wider text-main-brown sm:text-4xl text-xl">
            List of <span className="text-main-orange">Adoption Requests</span>
          </h5>
          <h5 className="quicksand-regular">
            Total Adoption Requests: {totalRequests}
          </h5>
        </div>
        <div className="basis-1/3 py-8 rounded-lg quicksand-regular shadow-md shadow-gray-200">
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
        className="mt-6"
        style={{ textAlign: "right", marginBottom: "20px" }}
      >
        <select
          className="quicksand-regular border rounded-md p-3 border-main-orange"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : filteredPets.length > 0 ? (
          filteredPets.map((dog) => {
            const petForms = forms.filter((form) => form.dogId === dog._id);
            return (
              <div
                key={dog._id}
                className="border rounded-md quicksand-regular"
              >
                <div className="px-4 pt-4">
                  <h2
                    className="cursor-pointer fredoka-bold tracking-wider text-main-orange text-2xl"
                    onClick={() => openModal(dog)}
                  >
                    {dog.name}
                  </h2>
                </div>
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
            );
          })
        ) : (
          <div>No adoption requests available for any pet.</div>
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {selectedPet && (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 quicksand-bold"
                      >
                        {selectedPet.name}
                      </Dialog.Title>
                      <div className="mt-2">
                        <img
                          src={selectedPet.image[0]}
                          alt={selectedPet.name}
                          className="w-full h-auto rounded-md mb-4 "
                        />
                        <p className="quicksand-regular">
                          <b>Gender</b> {selectedPet.gender}
                        </p>
                        <p className="quicksand-regular">
                          <b>Age:</b> {selectedPet.age}
                        </p>
                        <p className="quicksand-regular">
                          <b>Color:</b> {selectedPet.color}
                        </p>
                        <p className="quicksand-regular">
                          <b>Location:</b> {selectedPet.shelter}
                        </p>
                        <p className="quicksand-regular">
                          <b>Owner Email:</b> {selectedPet.clientEmail}
                        </p>
                        <p className="quicksand-regular">
                          <b>Owner Phone:</b> {selectedPet.phone}
                        </p>
                        <p className="quicksand-regular">
                          <b>Condition:</b> {selectedPet.condition}
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-main-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none"
                          onClick={closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdoptionRequests;
