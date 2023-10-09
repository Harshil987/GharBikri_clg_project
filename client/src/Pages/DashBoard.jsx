import React, { useState, useEffect } from "react";
import axios from "axios";

import PropertyCard from "../components/Card/propertyCard";
import { SERVER_URL } from "../Config/index.js";

import MiniNav from "../components/MiniNav/MiniNav";

function Dashboard() {
 
  const [properties, setProperties] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  // load properties of user who is logged in
  const loadProperties = async () => {
    const result = await axios.get(
      `${SERVER_URL}/api/dashboard/get-user-properties`,
      {
        headers: { token: localStorage.token },
      }
    );
    // console.log(result.data);
    setProperties(result.data);
    setIsLoading(false)
  };

  // const [rentProperties, setRentProperties] = useState([]);

  return (
    <>
      <main className="max-w-[1280px] mx-auto lg:p-6 w-[90%]">
        <MiniNav />
        <h1 className="text-3xl font-semibold text-center lg:text-left my-8 lg:text-5xl">
          Properties Listed
        </h1>
        {IsLoading ? (
            // Display a loader while data is loading
            <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500"></div>
        </div>
        ) :(
        <div className="lg:p-20 lg:rounded-3xl bg-gray-100 py-16">
          {properties ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:mx-0 mx-8">
                {properties.map((property) => (
                  <PropertyCard key={property.p_id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-2xl font-bold text-gray-400 mb-10">
              No properties found
            </div>
          )}
        </div>
        )}
      </main>
    </>
  );
}

export default Dashboard;
