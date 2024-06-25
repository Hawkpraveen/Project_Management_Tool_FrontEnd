import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "../Components/DashboardSidebar";
import DashboardProfile from "../Components/DashboardProfile";
import TaskDetails from "./TaskDetails";
import BoardList from "./BoardList";
import BoardDetails from "../Components/BoardDetails";
import { useSelector } from "react-redux";
import TaskList from "./TasksList";
import DashBoardHome from "./DashBoardHome";
import TaskCalendar from "../Components/TaskCalendar";

const Dashboard = () => {
  const location = useLocation();
  const boardId = useSelector((state) => state.boards.boardIdToAdd);
   //console.log(boardId);
  const taskId= useSelector((state)=>state.boards.taskIdToAdd)
  //console.log(taskId);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabUrl = urlParams.get("tab"); //tab = profile
    if (tabUrl) {
      setTab(tabUrl); //profile
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-58 bg-black">
        <DashboardSidebar />
      </div>
      {tab === "profile" && <DashboardProfile />}
      {tab === "boardslist" && <BoardList />}
      {tab === "task" && <TaskDetails taskId={taskId}/>}
      {tab === `boarddetails` && <BoardDetails boardId={boardId}/>}
      {tab==='tasklists' && <TaskList />}
      {tab === 'dashboardhome' && <DashBoardHome />}
      {tab==='calender' && <TaskCalendar />}
    </div>
  );
};

export default Dashboard;
