import React, { useState, useEffect } from "react";
import FormCard from "./FormCards";


const AdoptionRequests = () => {
  const [forms, setForms] = useState([]);
  const [Dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState("");

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:8080/form/getForms");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDogs = async () => {
    try {
      const response = await fetch("http://localhost:8080/dogs/approvedPets");
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      const data = await response.json();
      setDogs(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchForms();
    fetchDogs();
  }, []);

  const dogsWithRequests = Dogs.filter((dog) =>
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

  return (
    <div>
      <div
        className="dropdown-container"
        style={{ textAlign: "right", marginBottom: "20px" }}
      >
        <select
          className="req-filter-selection"
          onChange={handlePetChange}
          value={selectedPetId}
        >
          <option value="">All Requets</option>
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
            <div key={dog._id} className="form-container">
              <div>
                <h2
                  className="clickable-pet-name"
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
        <div>
          <div>
            <button onClick={() => runEvent()}>
              Click for real time events
            </button>
            <button onClick={() => runLocalEvent()}>
              Click for local events
            </button>
          </div>
          No adoption requests available for any pet.
        </div>
      )}

      {petDetailsPopup && selectedPet && (
        <div className="popup">
          <div className="popup-content">
            <div className="pet-view-card">
              <div className="pet-card-pic">
                <img
                  src={`http://localhost:8080/images/${selectedPet.filename}`}
                  alt={selectedPet.name}
                />
              </div>
              <div className="pet-card-details">
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
                  <b>condition:</b> {selectedPet.condition}
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
