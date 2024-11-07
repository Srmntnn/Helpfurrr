import AdoptForm from "../../components/AdoptForm";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function AdoptionFormPage(props) {
  const { dogId } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);
  console.log(dog)
  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/dogs/getdogbyId/${dogId}`
        );
        setDog(response.data);
      } catch (error) {
        setError(error);
      }
    };

    if (dogId) {
      fetchDog();
    }
  }, [dogId]);
  return <AdoptForm />;
}

export default AdoptionFormPage;
