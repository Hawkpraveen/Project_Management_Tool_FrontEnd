import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./Components/Home";
import Header from "./Components/Header";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";
import FooterComp from "./Components/FooterComp";
import PageNotFound from "./Pages/PageNotFound";

const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>

      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <FooterComp />
      </BrowserRouter>
    </div>
  );
};

export default App;
