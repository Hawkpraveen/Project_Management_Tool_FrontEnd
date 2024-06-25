import React, { useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from "../Redux/Slice/authSlice";
import OAuth from "../Components/oAuth";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signupStart());
      const response = await fetch(
        "https://project-management-tool-backend-gayc.onrender.com/api/auth/register-user",
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
        return dispatch(signupFailure(data.message));
      }
      if (response.ok) {
        dispatch(signupSuccess(data));
        navigate("/signin");
      }
    } catch (error) {
      dispatch(signupFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-5xl mx-auto flex-col md:flex-row md:items-center gap-10">
      <div className="flex-1 fade-in-text w-full h-full">
          <div className="font-bold dark:text-white text-4xl mt-9 ">
            <Card className=" shadow-2xl dark:shadow-neutral-700 bg-gradient-to-r from-cyan-800 via-teal-600 to-blue-700 rounded-lg text-white text-center ">
              Project Management Tool
              
            </Card>
            <p className="mt-5 text-xl p-1">
            You can sign up with your Email and password or you can use the <span><img src="https://cdn.usbrandcolors.com/images/logos/google-logo.svg" alt="Google" className="w-28 h-10 inline"/></span>
          </p>
          </div>
          
        </div>
        <Card className="flex-1 fade-in-text-1 shadow-2xl dark:shadow-neutral-700">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Username" />
              <TextInput
                type="text"
                placeholder="Enter your User Name"
                id="username"
                onChange={handleChange}
                required
              />
            </div>
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
              Sign Up
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-lg">
            <span>Already Have An Account ?</span>
            <Link to="/signin" className="text-blue-500 text-lg hover:scale-125 mb-0">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
