import { Button } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { currentuser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (currentuser) {
      navigate("/dashboard?tab=dashboardhome");
    } else {
      navigate("/signin");
    }
  };
  return (  
    <div className="screen-height items-center mt-40">
      <div className="text-center  dark:text-cyan-400  justify-center fade-in-text-home  ">
        <p className="px-2 py-1 rounded-lg text-3xl sm:text-7xl font-bold mb-5">
          Welcome To
        </p>
        <span className="px-2 py-1 rounded-lg text-2xl sm:text-5xl font-semibold fade-in-text-home">
          Project management Tool
        </span>
      </div>
      <div className="flex justify-center items-center">
        <Button
          className="mt-10 fade-in-text-button "
          gradientDuoTone="cyanToBlue"
          onClick={handleSubmit}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;
