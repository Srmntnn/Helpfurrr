import React, { useEffect, useState } from "react";
import Dogviewer from "./Dogviewer";
import { styles } from "../../styles";

const AdoptionPage = () => {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8080/dogs/approvedPets')
        if (!response.ok) {
          throw new Error('An error occurred')
        }
        const data = await response.json()
        setDogsData(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests();
  }, [])

  // const filteredDogs = dogsData.filter((dog) => {
  //   if (filter === "all") {
  //     return true;
  //   }
  //   return dog.type === filter;
  // });

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
      <div className={`${styles.paddingX} flex flex-wrap mx-auto justify-center gap-4 items-center mt-40`}>
        {loading ?
          <p>Loading</p> : ((dogsData.length > 0 ) ? (
            dogsData.map((dogDetail, index) => (
              <Dogviewer dog={dogDetail} key={index} />
            ))
          ) : (
            <p className="oops-msg">Oops!... No Dogs available</p>
          )
          )
        }
      </div>
    </>
  );
};

export default AdoptionPage;