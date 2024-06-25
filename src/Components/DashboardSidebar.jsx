import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiOutlineTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../Redux/Slice/authSlice";
import { AiFillCalendar, AiOutlineDashboard } from "react-icons/ai";

const DashboardSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab"); //tab = profile
    if (tabUrl) {
      setTab(tabUrl); //profile
    }
  }, [location.search]);

  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };

  return (
    <Sidebar className="w-full md:w-58">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2 ">
          <Link to="/dashboard?tab=dashboardhome">
            <Sidebar.Item
              active={tab === "dashboardhome"}
              icon={AiOutlineDashboard}
              as="div"
              className="hover:bg-neutral-200 transition duration-300 ease-in-out"
            >
              DashBoard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=calender">
            <Sidebar.Item
              active={tab === "calender"}
              icon={AiFillCalendar}
              as="div"
              className="hover:bg-neutral-200 transition duration-300 ease-in-out"
            >
              Calender
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=boardslist">
            <Sidebar.Item
              active={tab === "boardslist"}
              icon={HiViewBoards}
              labelColor="dark"
              as="div"
              className="hover:bg-neutral-200 transition duration-300 ease-in-out"
            >
              Boards
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=tasklists">
            <Sidebar.Item
              active={tab === "tasklists"}
              icon={HiOutlineTable}
              labelColor="dark"
              as="div"
              className="hover:bg-neutral-200 transition duration-300 ease-in-out"
            >
              Task Lists
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
              className="hover:bg-neutral-200 transition duration-300 ease-in-out"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer hover:bg-neutral-200 transition duration-300 ease-in-out"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
