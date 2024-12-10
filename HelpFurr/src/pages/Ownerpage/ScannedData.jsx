import React from "react";
import { useLocation } from "react-router-dom";

const ScannedData = () => {
  const location = useLocation();

  // Parse the query string to extract the "data" parameter
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get("data");

  // Decode the data and parse it into a JSON object
  const parsedData = data ? JSON.parse(decodeURIComponent(data)) : null;

  return (
    <div className="container mx-auto mt-5 px-6">
      <h1 className="text-2xl font-bold mb-4 fredoka-bold text-center lg:text-4xl md:text-lg text-main-orange">
        Scanned Dog Data
      </h1>
      {parsedData ? (
        <div className="p-4 rounded-md quicksand-regular flex gap-6 md:flex-row flex-col">
          <div className="mb-4">
            {/* Display the dog image */}
            {parsedData.imageUrl && (
              <img
                src={parsedData.imageUrl}
                alt={parsedData.name}
                className="w-full rounded-xl"
              />
            )}
          </div>
          <div>
            <div>
              <h1 className="fredoka-bold tracking-wider text-2xl mb-1 text-main-brown">
                Dog Information
              </h1>
              <div>
                <p>
                  <strong>Dog Name:</strong> {parsedData.name}
                </p>
                <p>
                  <strong>Dog Age:</strong> {parsedData.age}
                </p>
                <p>
                  <strong>Dog Gender:</strong> {parsedData.gender}
                </p>
                <p>
                  <strong>Dog Condition:</strong> {parsedData.condition}
                </p>
                <p>
                  <strong>Location:</strong> {parsedData.shelter}
                </p>
              </div>
            </div>
            <p>
              <strong>Vaccinated:</strong> {parsedData.vaccinated}
            </p>
            <p>
              <strong>Neutered:</strong> {parsedData.neutered}
            </p>
            <p>
              <strong>Urgency:</strong> {parsedData.urgent}
            </p>
            <div>
              <h1 className="fredoka-bold tracking-wider text-2xl mb-1 mt-4 text-main-brown">
                Owner Information & History
              </h1>
              <p>
                <strong>Previous Owner:</strong> {parsedData.owner}
              </p>
              <p>
                <strong>Current Owner:</strong> {parsedData.currentOwner}
              </p>
              <p>
                <strong>Owner Contact Number:</strong> {parsedData.phone}
              </p>
              <p>
                <strong>Current Owner Email:</strong> {parsedData.email}
              </p>
              <p>
                <strong>Previous Owner Email:</strong>{" "}
                <a href={parsedData.prevOwnerEmail}>{parsedData.prevOwnerEmail}</a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-red-500">
          No data found. Please scan a valid QR code.
        </p>
      )}
    </div>
  );
};

export default ScannedData;
