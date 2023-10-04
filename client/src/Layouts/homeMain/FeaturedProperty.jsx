import React, { useEffect,  useState } from "react";
import axios from "axios";
import PropertyCard from "../../components/Card/propertyCard";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../../Config";
export default function FeaturedProperty() {
    const [user, setUser] = useState({
        user_id: "",
    });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const result = await axios.get(`${SERVER_URL}/api/dashboard`, {
                headers: { token: localStorage.token }
            });

            // Check if user_id exists in the response data
            const { data } = result; // Destructure the data property

            // Check if user_id exists in the response data
            if (data && data.id) {
                setUser({ user_id: data.id });
                 // Log the user data
            } else {
                console.error('User data or user_id not found in response.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const [rentProperties, setRentProperties] = useState([]);
    const [buyProperties, setBuyProperties] = useState([]);

    const getRentProperties = async () => {
        try {
            const user_id = user.user_id;
            const res = await axios.get(`${SERVER_URL}/api/properties/home?user_id=${user_id}&listingtype=Rent`);
            setRentProperties(res.data.property);
            console.log(res.data.property)
        } catch (error) {
            console.error(error);
        }
    }

    const getBuyProperties = async () => {
        try {
            const user_id = user.user_id;
            const res = await axios.get(`${SERVER_URL}/api/properties/home?user_id=${user_id}&listingtype=Buy`);
            setBuyProperties(res.data.property);
            console.log(res.data.property)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user.user_id !== "") {
            getRentProperties();
            getBuyProperties();
        }
    }, [user]);

    return (
        <>
            <div className="max-w-[1440px] mx-auto lg:p-20">
                <div className="lg:p-20 lg:rounded-3xl bg-gray-100 py-16">
                    <h2 className="mb-3 font-semibold lg:text-[48px] text-3xl text-center lg:text-left">Featured Property</h2>
                    <p className="text-center lg:text-left text-gray-400 sm:mb-12 mb-10">Let&apos;s find you a comfortable place</p>

                    <h3 className="text-center lg:text-left text-3xl font-semibold mb-8">Rent</h3>
                    {rentProperties ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:mx-0 mx-8">
                                {
                                    rentProperties.map((property) => (
                                        <PropertyCard key={property.p_id} property={property} />
                                    ))
                                }
                            </div>

                            <div className="my-12 text-center outline-none block text-sm text-gray-600">
                                <Link className="h-10 rounded-3xl text-sm shadow-md bg-none p-4 hover:bg-black hover:text-white transition-all" to="/rent">
                                    View all
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-2xl font-bold text-gray-400 mb-10">No properties found</div>)
                    }

                    <h3 className="text-center lg:text-left text-3xl font-semibold mb-8">Buy</h3>
                    {buyProperties ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:mx-0 mx-8">
                                {
                                    buyProperties.map((property) => (
                                        <PropertyCard key={property.p_id} property={property} />
                                    ))
                                }
                            </div>

                            <div className="my-12 text-center outline-none block text-sm text-gray-600">
                                <Link className="h-10 rounded-3xl text-sm shadow-md bg-none p-4 hover:bg-black hover:text-white transition-all" to="/buy">
                                    View all
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-2xl font-bold text-gray-400">No properties found</div>)
                    }

                </div>
            </div>
        </>
    )
}
