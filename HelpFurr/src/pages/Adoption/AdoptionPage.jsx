import React, { useEffect, useState } from "react";
import Dogviewer from "./Dogviewer";
import { styles } from "../../styles";
import { Helmet } from "react-helmet";

const AdoptionPage = () => {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/dogs/approvedPets");
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();
        setDogsData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Normalize search term
  };

  const filteredDogs = searchTerm
    ? dogsData.filter((dog) => dog.name.toLowerCase().includes(searchTerm))
    : dogsData; // Apply filter if searchTerm exists

  return (
    <section className="max-w-screen-2xl w-full items-center justify-center mx-auto gap-10flex">
      <div className={`${styles.paddingX}`}>
        <Helmet>
          <title>HelpFur | All Dogs</title>
          <meta name="Helpfur-all dogs" content="Helmet application" />
        </Helmet>
        <div className="bg-light-orange h-96 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1 className={`${styles.heroHeadText} text-5xl text-secondary-orange font-bold text-center fredoka-bold`}>
            Available Dogs
          </h1>
          <p className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}>
            Browse the list of available dogs
          </p>
        </div>
        <div className="pt-96">
          {" "}
          {/* New search container */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-secondary-orange opacity-20 blur-[100px]"></div>
        </div>
        <div className="flex gap-6 flex-wrap">
        {loading ? (
          <p>Loading</p>
        ) : filteredDogs.length > 0 ? (
          filteredDogs.map((dogDetail, index) => (
            <Dogviewer dog={dogDetail} key={index} />
          ))
        ) : searchTerm ? (
          <p className="oops-msg">No dogs found for "{searchTerm}"</p>
        ) : (
          <p className="oops-msg">Oops!... No Dogs available</p>
        )}
        </div>
        
      </div>
    </section>
  );
};

export default AdoptionPage;
