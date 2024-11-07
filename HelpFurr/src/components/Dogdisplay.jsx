import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import Dogviewer from "../pages/Adoption/Dogviewer";

function Dogdisplay() {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div
        className={`${styles.paddingX} flex flex-wrap mx-auto justify-center md:gap-6 gap-9 items-center mt-40`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-secondary-orange opacity-20 blur-[100px]"></div>
        </div>
        {loading ? (
          <p>Loading</p>
        ) : dogsData.length > 0 ? (
          dogsData
            .slice(0, 4)
            .map((dogDetail, index) => (
              <Dogviewer dog={dogDetail} key={index} />
            ))
        ) : (
          <p className="oops-msg">Oops!... No Dogs available</p>
        )}
      </div>
    </>
  );
}

export default Dogdisplay;
