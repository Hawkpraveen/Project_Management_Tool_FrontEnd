import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const [events, setEvents] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://project-management-tool-backend-gayc.onrender.com/api/task/get-all-tasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const upcomingTasks = data.tasks.filter(
        (task) => task.taskStatus !== "Closed"
      );

      const formattedEvents = upcomingTasks.map((task) => ({
        title: task.taskName,
        start: moment(task.taskDueDate).startOf("day").toDate(), // Start of the day (12:00 AM)
        end: moment(task.taskDueDate).endOf("day").toDate(),     // End of the day (11:59 PM)
        task: task,
      }));

      const completedTasks = data.tasks.filter(
        (task) => task.taskStatus === "Closed"
      );

      setEvents(formattedEvents);
      setCompletedTasks(completedTasks);

      scheduleNotifications(upcomingTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const scheduleNotifications = (tasks) => {
    tasks.forEach((task) => {
      const taskDate = new Date(task.taskDueDate);
      const oneWeekBefore = new Date(taskDate);
      oneWeekBefore.setDate(taskDate.getDate() - 7);
      const oneDayBefore = new Date(taskDate);
      oneDayBefore.setDate(taskDate.getDate() - 1);
      const today = new Date(); // Current date and time

      if (oneWeekBefore > today) {
        setTimeout(() => {
          toast.info(`Reminder: Task "${task.taskName}" is due in one week.`);
        }, oneWeekBefore - today);
      }

      if (oneDayBefore > today) {
        setTimeout(() => {
          toast.warning(`Reminder: Task "${task.taskName}" is due tomorrow.`);
        }, oneDayBefore - today);
      }

      if (taskDate > today) {
        setTimeout(() => {
          toast.success(`Today is the due date for Task "${task.taskName}".`);
        }, taskDate - today);
      }
    });
  };

  return (  
    <div className="w-full shadow-xl rounded-2xl mt-4 mb-4">
      <div className="w-full mt-2">
        <h1 className="text-3xl font-bold mb-4 mx-auto shadow-xl p-2 px-5 w-fit dark:shadow-neutral-700">Task Calendar</h1>
        <div className="w-11/12 mx-auto rounded-xl p-3 border-2 flex-wrap shadow-xl dark:shadow-neutral-600">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start" 
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
        <hr className="border-6 m-5 border-neutral-800 dark:border-neutral-200"/>
        <div className="w-full mt-2 mb-3 mx-auto md:w-5/6 flex-wrap shadow-2xl dark:shadow-neutral-600">
          {completedTasks.length > 0 && (
            <div className="bg-neutral-200 rounded-2xl p-4 dark:bg-neutral-800 flex-wrap flex justify-center">
              <h2 className="text-xl font-bold mb-2 ">Closed Tasks</h2>
             
              <table className="min-w-full bg-white dark:bg-neutral-700 rounded-2xl mb-2">
                <thead className="overflow-hidden text-wrap">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-800 dark:border-gray-300">Task Name</th>
                    <th className="py-2 px-4 border-b border-gray-800 dark:border-gray-300">Created Date</th>
                    <th className="py-2 px-4 border-b border-gray-800 dark:border-gray-300">Due Date</th>
                  </tr>
                </thead>
                <tbody className="overflow-hidden text-wrap mb-2  ">
                  {completedTasks.map((task) => (
                    <tr key={task._id}>
                      <td className="py-2 px-4 border-b border-gray-700 dark:border-gray-200 text-center">{task.taskName}</td>
                      <td className="py-2 px-4 border-b border-gray-700 dark:border-gray-200 text-center">{new Date(task.taskCreatedDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b border-gray-700 dark:border-gray-200 text-center">{new Date(task.taskDueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TaskCalendar;
