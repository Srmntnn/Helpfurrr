import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import Dogviewer from "../pages/Adoption/Dogviewer";

function Dogdisplay() {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/dogs/approvedPets`);
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
  return (
    <>
      {/* <div className="filter-selection">
      <select
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option value="all">All Pets</option>
        <option value="Dog">Dogs</option>
        <option value="Cat">Cats</option>
        <option value="Rabbit">Rabbits</option>
        <option value="Bird">Birds</option>
        <option value="Fish">Fishs</option>
        <option value="Other">Other</option>
      </select>
    </div> */}
      <div className=" flex-col items-center justify-center sm:mt-19 mt-16 sm:mb-14 mb-8">
        <h1
          className={`${styles.heroHeadText} text-5xl text-main-orange font-bold text-center fredoka-bold`}
        >
          Newest Dogs
        </h1>
        <p
          className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
        >
          Browse the list of newest dogs.
        </p>
      </div>
      <div
        className={`${styles.paddingX} flex flex-wrap mx-auto justify-center md:gap-6 gap-9 items-center `}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 w-full">
          {loading ? (
            <p>Loading</p>
          ) : dogsData.length > 0 ? (
            dogsData
              .slice(0, 3)
              .map((dogDetail, index) => (
                <Dogviewer dog={dogDetail} key={index} />
              ))
          ) : (
            <p className="oops-msg quicksand-semi-bold p-4">Oops!... No Dogs available</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dogdisplay;
