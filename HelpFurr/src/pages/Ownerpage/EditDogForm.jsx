import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { styles } from "@/styles";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { useParams } from "react-router-dom";

const EditDogForm = () => {
  const { dogId } = useParams();
  const [dogData, setDogData] = useState({
    name: "",
    age: "",
    shelter: "",
    condition: "",
    email: "",
    phone: "",
    gender: "",
    vaccinated: false,
    neutered: false,
    urgent: false,
    color: "",
  });

  // Fetch dog data when the component mounts
  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/dogs/getdogbyId/${dogId}`
        );
        setDogData(response.data); // Populate state with fetched dog data
        console.log(response);
      } catch (error) {
        console.error("Error fetching dog data:", error);
      }
    };

    if (dogId) {
      fetchDogData(); // Fetch data only if dogId is available
    }
  }, [dogId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDogData({
      ...dogData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/dogs/${dogId}`, dogData);
      console.log("Updated Dog:", response.data);
      // Optionally redirect or show a success message
    } catch (error) {
      console.error("Error updating dog:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <section className={`${styles.paddingX}`}>
      <div className="md:mt-56 mt-20 w-full max-w-screen-md border p-4 mx-auto">
        <form onSubmit={handleSubmit}>
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={dogData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <Label>Age</Label>
            <Input
              type="number"
              name="age"
              value={dogData.age}
              onChange={handleChange}
              placeholder="Age"
              required
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              name="shelter"
              value={dogData.shelter}
              onChange={handleChange}
              placeholder="Shelter"
              required
            />
          </div>
          <div>
            <Label>Condition</Label>
            <Input
              type="text"
              name="condition"
              value={dogData.condition}
              onChange={handleChange}
              placeholder="Condition"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={dogData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={dogData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>

          <select name="gender" value={dogData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Checkbox inputs */}
          <label>
            Vaccinated:
            <input
              type="checkbox"
              name="vaccinated"
              checked={dogData.vaccinated}
              onChange={handleChange}
            />
          </label>

          <label>
            Neutered:
            <input
              type="checkbox"
              name="neutered"
              checked={dogData.neutered}
              onChange={handleChange}
            />
          </label>

          <label>
            Urgent:
            <input
              type="checkbox"
              name="urgent"
              checked={dogData.urgent}
              onChange={handleChange}
            />
          </label>

          <div>
            <Label>Color</Label>
            <Input
              type="text"
              name="color"
              value={dogData.color}
              onChange={handleChange}
              placeholder="Color"
            />
          </div>

          <button type="submit">Update Dog</button>
        </form>
      </div>
    </section>
  );
};

export default EditDogForm;
