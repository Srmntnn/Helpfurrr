import React, { useEffect, useState } from "react";
import Dogviewer from "./Dogviewer";
import { styles } from "../../styles";
import { Helmet } from "react-helmet";
import { GrPowerReset } from "react-icons/gr";

const AdoptionPage = () => {
  const [dogsData, setDogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [initialDogsData, setInitialDogsData] = useState([]); // State for original data
  const [sortBy, setSortBy] = useState(""); // New state for sorting by age

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("http://localhost:8080/dogs/approvedPets");
        if (!response.ok) {
          throw new Error("An error occurred");
        }
        const data = await response.json();

        // Extract age as an integer from the string format
        const dogsWithAgeInt = data.map((dog) => ({
          ...dog,
          ageInt: parseInt(dog.age.split(" ")[0]),
        }));

        setDogsData(dogsWithAgeInt);
        setInitialDogsData(dogsWithAgeInt);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleReset = () => {
    setSearchTerm("");
    setDogsData(initialDogsData.slice());
    setSortBy(""); // Reset sorting when resetting search
  };

  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const filteredDogs = searchTerm
    ? dogsData.filter((dog) => dog.name.toLowerCase().includes(searchTerm))
    : dogsData;

  const sortedDogs = sortBy
    ? [...filteredDogs].sort((a, b) => {
        switch (sortBy) {
          case "age-asc":
            return a.ageInt - b.ageInt;
          case "age-desc":
            return b.ageInt - a.ageInt;
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      })
    : filteredDogs;
  return (
    <section className="w-full items-center justify-center gap-10 flex">
      <div className={`${styles.paddingX} max-w-screen-2xl justify-center`}>
        <Helmet>
          <title>HelpFur | All Dogs</title>
          <meta name="Helpfur-all dogs" content="Helmet application" />
        </Helmet>
        <div className="bg-light-orange h-96 flex absolute left-0 right-0 flex-col items-center justify-center">
          <h1
            className={`${styles.heroHeadText} text-5xl text-secondary-orange font-bold text-center fredoka-bold`}
          >
            Available Dogs
          </h1>
          <p
            className={`${styles.heroSubText} text-secondary-brown text-center quicksand-regular`}
          >
            Browse the list of available dogs
          </p>
        </div>
        <div className="pt-96">
          {/* New search container */}
          <div className="flex items-center justify-center my-16 sm:mx-16  h-12">
            <input
              type="text"
              placeholder="Search by name."
              value={searchTerm}
              onChange={handleSearch}
              className="quicksand-regular px-4 border max-w-96 w-full h-full"
            />

            <button
              className="btn bg-main-orange rounded-tl-none rounded-bl-none text-light-orange quicksand-regular h-full flex"
              onClick={handleReset}
            >
              <GrPowerReset size={24} />
              <p className="sm:flex hidden">Reset</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8 font-primary">
          <div className="basis-1/4 w-full">
            <div className="box rounded-lg border p-6 w-full flex flex-col gap-4">
              <h6 className="font-medium text-base leading-7 mb-5">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  class="inline-flex items-center gap-2 text-md"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
                </svg>{" "}
                Filter
              </h6>
              <div className="flex flex-col gap-2">
                <div className="quicksand-bold text-secondary-orange">
                  By age
                </div>
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="h-12 border border-gray-300  text-xs font-medium rounded-lg block w-full  py-2.5 px-4 appearance-none relative focus:outline-none"
                >
                  <option value="">Select one</option>
                  <option value="age-asc">Ascending</option>
                  <option value="age-desc">Descending</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="quicksand-bold text-secondary-orange">
                  By name
                </div>
                <div className="relative w-full mb-8">
                  <select
                    value={sortBy}
                    onChange={handleSort}
                    className="h-12 border border-gray-30 text-xs font-medium rounded-lg block w-full  py-2.5 px-4 relative appearance-none focus:outline-none"
                  >
                    <option value="">Select one</option>
                    <option value="name-asc">Ascending</option>
                    <option value="name-desc">Descending</option>
                  </select>
                  <svg
                    className="absolute top-1/2 -translate-y-1/2 right-4 z-50"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609"
                      stroke="#111827"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 w-full">
            {loading ? (
              <div>Loading</div>
            ) : sortedDogs.length > 0 ? (
              sortedDogs.map((dogDetail, index) => (
                <Dogviewer dog={dogDetail} key={index} />
              ))
            ) : (
              <p className="oops-msg">Oops!... No Dogs available</p>
            )}
          </div>  
        </div>
      </div>
    </section>
  );
};

export default AdoptionPage;
