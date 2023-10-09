import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toastSuccess, toastError } from "../components/Toast";
import { loginValidate } from "../Middleware/loginValidation";
import { SERVER_URL } from "../Config";

function LoginPage({ setAuth }) {

    useEffect(() => {
        document.title = "Login";
        window.scrollTo(0, 0);
    }, []);
    
    // inputs state
    const [inputs, setInputs] = useState({
        user_email: "",
        password: "",
    });

    // error state
    const [error, setError] = useState({});

    // Destructure the inputs object
    const { user_email, password } = inputs;

    // e is the event object
    const onChange = (e) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        const error = loginValidate(inputs);

        if (error) {
            setError(error);
        }

        if (Object.keys(error).length === 0) {
            try {
                const body = { user_email, password };
                const response = await axios.post(`${SERVER_URL}/api/auth/login`, body);
                const parseRes = response.data;

                if (parseRes.token && parseRes.user_id) {
                    console.log(parseRes);
                    localStorage.setItem("token", parseRes.token); // localStorage is a browser API that stores data with no expiration
                    localStorage.setItem("user_id", parseRes.user_id);
                    
                    setAuth(true);
                    toastSuccess("Logged in successfully!");
                     
                     
                } else {
                    setAuth(false);
                }
            } catch (err) {
                console.error(err.message);
                if (err.response.status === 422) {
                    let errors = (err.response.data.errors[0].msg)
                    console.log(errors)
                    toastError(errors);
                } else {
                    toastError("Server error!");

                }
            }
        } else {
            const errorMessages = Object.values(error).filter(errors => errors !== null && errors !== undefined);
            errorMessages.forEach(error => toastError(error));
        }
    };

    return (
        <main className="w-full flex">
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')"
                }}
            />
            <div className="relative flex-1 hidden items-center justify-center bg-white lg:flex h-screen lg:-mt-16 max-h-[2000px]">
                <div className="relative z-10 w-full max-w-md">
                    <div className=" mt-16 space-y-3">
                        <h3 className="text-5xl font-bold text-teal-500">Welcome Back!</h3>
                        <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-100">
                            Login to your account to continue your house hunt.
                        </p>
                        <div className="flex items-center -space-x-2 overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" className="w-10 h-10 rounded-full border-2 border-white" />
                            <p className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-200  to-blue-100 translate-x-5">
                                Welcome, one of our 5.000+ users
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="absolute inset-0 my-auto"
                    style={{
                        backgroundImage: `url(${loginImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter: "brightness(0.5) contrast(1)",
                    }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center bg-white  rounded-lg">
                <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
                    <div className="mt-5 space-y-2">
                        <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Login to your account</h3>
                        <p>
                            Don&apos;t have an account?
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500"> Sign Up</Link>
                        </p>
                    </div>

                    {/* main form */}
                    <form
                        onSubmit={onSubmitForm}
                        className="space-y-5"
                    >
                        {/* email */}
                        <div>
                            <label className="font-medium">
                                Email
                            </label>
                            <div className="flex">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center pt-2"><i className="mdi mdi-email-outline text-gray-400 text-lg"></i></div>
                                <input
                                    name="user_email"
                                    type="email"
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-indigo-600 shadow-sm -ml-10 pl-10 pr-3 rounded-lg border-2 border-gray-200"
                                    placeholder="sammy12@gmail.com"
                                    value={user_email}
                                    onChange={(e) => onChange(e)}
                                />
                            </div>
                            {/* text that shows up when validation error */}
                            {error.user_email
                                && (
                                    <p className="text-red-500 text-xs italic">
                                        {error.user_email}
                                    </p>
                                )}
                        </div>

                        {/* password */}
                        <div>
                            <label className="font-medium">
                                Password
                            </label>
                            <div className="flex">
                                <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center pt-2"><i className="mdi mdi-lock-outline text-gray-400 text-lg"></i></div>
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none focus:border-indigo-600 shadow-sm -ml-10 pl-10 pr-3 rounded-lg border-2 border-gray-200"
                                    placeholder="************"
                                    value={password}
                                    onChange={(e) => onChange(e)}
                                />
                            </div>
                            {/* text that shows up when validation error */}
                            {error.password && (
                                <p className=" text-red-500 text-xs italic">
                                    {error.password}
                                </p>
                            )}
                        </div>

                        {/* submit the form */}
                        <button
                            className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                            type="submit"
                        >
                            Login
                        </button>
                        <ToastContainer />

                        

                    </form>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;
