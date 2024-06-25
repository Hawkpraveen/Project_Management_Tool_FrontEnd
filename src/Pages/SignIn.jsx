import { Alert, Button, Card, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signinFailure,
  signinStart,
  signinSuccess,
} from "../Redux/Slice/authSlice";
import OAuth from "../Components/oAuth";  


const Signin = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signinFailure("Please fill out the fields"));
    }
    try {
      dispatch(signinStart());
      const response = await fetch(
        "https://project-management-tool-backend-gayc.onrender.com/api/auth/login-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success === false) {
        return dispatch(signinFailure(data.message));
      }
      if (response.ok) {
        localStorage.setItem("Token", data.token);
        const user = { ...data.rest, token: data.token };
        dispatch(signinSuccess(user));
        navigate("/");
      }
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-36">
      <div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-10">
        <div className="flex-1 fade-in-text w-full h-full">
          <div className="font-bold dark:text-white text-4xl mt-9 ">
            <Card className=" shadow-2xl dark:shadow-neutral-700 bg-gradient-to-r from-cyan-800 via-teal-600 to-blue-700 rounded-lg text-white text-center ">
              Project Management Tool
              
            </Card>
            <p className="mt-5 text-xl p-1">
            You can sign in with your Email and password or you can use the <span><img src="https://cdn.usbrandcolors.com/images/logos/google-logo.svg" alt="Google" className="w-28 h-10 inline"/></span>
          </p>
          </div>
          
        </div>
        <Card className="flex-1 fade-in-text-1 shadow-2xl dark:shadow-neutral-700">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Enter Your Password"
                id="password"
                onChange={handleChange}
                required
              />
            </div>
            <Button gradientDuoTone="cyanToBlue" type="submit" pill className='hover:scale-105'>
              {loading ? (
                <>
                  <Spinner
                    color="purple"
                    aria-label="Purple spinner example"
                    size="sm"
                  />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-4 text-lg">
            <span>Don't Have An Account ?</span>
            <Link to="/signup" className="text-blue-500 hover:scale-125">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-5">
              <span className="font-medium me-2">🥴OOPS!</span>
              {errorMessage}
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Signin;
