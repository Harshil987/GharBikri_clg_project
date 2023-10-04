import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropertyCard from "../components/Card/propertyCard";
import { SERVER_URL } from "../Config";
import MiniNav from "../components/MiniNav/MiniNav";
import { useLocation } from "react-router-dom";

export default function Buy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      "Real Estate for Sale | Buy Property | Property Rent or Buy";
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const minPrice = searchParams.get("minprice");
  const maxPrice = searchParams.get("maxprice");
  const city = searchParams.get("city");
  const propertyType = searchParams.get("type");
  const [searchData, setSearchData] = useState([]);

  const [data, setData] = useState({
    city: city || "", // Set to the value from searchParams or an empty string if not found
    Type: propertyType || "House", // Set to the value from searchParams or "House" if not found
    listingType: "Buy",
    minPrice: minPrice || "", // Set to the value from searchParams or an empty string if not found
    maxPrice: maxPrice || "", // Set to the value from searchParams or an empty string if not found
  });

  const searchProperty = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/properties/buy/search`,
        { params: data }
      );
      setSearchData(response.data.property);
      // console.log(response);
      // console.log(data)
      // console.log(searchData);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(searchData);

  useEffect(() => {
    searchProperty();
  }, []);

  return (
    <>
      <div className="max-w-[1280px] mx-auto lg:p-6 w-[90%]">
        <MiniNav />
        <h1 className="text-3xl font-semibold text-center lg:text-left my-8 lg:text-5xl">
          Sale Listings
        </h1>
        <main className="w-full flex lg:mt-10">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full p-6 max-w-full space-y-8 bg-white text-gray-600 sm:p-0">
              {searchData && searchData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:mx-0 mx-8">
                  {searchData.map((property) => (
                    <PropertyCard key={property.p_id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-2xl font-bold text-gray-400 mb-10">
                  No properties found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
