import axios from "axios";
import { Alert, Button, Card, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import ReportGenerator from "../Components/ReportGenerator";

const DashBoardHome = () => {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBoard();
    fetchTask();
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await axios.get(
        "https://project-management-tool-backend-gayc.onrender.com/api/board/get-boards",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      const data = await response.data.boards;
      setBoards(data);
    } catch (err) {
      setError("Error fetching boards");
    }
  };

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        "https://project-management-tool-backend-gayc.onrender.com/api/task/get-all-tasks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      const data = await response.data.tasks;
      setTasks(data);
      setTodayTasks(
        data.filter((task) => {
          const today = new Date().toDateString();
          const taskDueDate = new Date(task.taskDueDate).toDateString();
          return taskDueDate === today;
        })
      );
    } catch (err) {
      setError("Error fetching tasks");
    }
  };

  const getTaskPriorityCounts = () => {
    if (!Array.isArray(tasks)) return { low: 0, medium: 0, high: 0 };
    const low = tasks.filter((task) => task.taskPriority === "Low").length;
    const medium = tasks.filter(
      (task) => task.taskPriority === "Medium"
    ).length;
    const high = tasks.filter((task) => task.taskPriority === "High").length;
    return { low, medium, high };
  };

  const getTaskStatusCounts = () => {
    if (!Array.isArray(tasks)) return { active: 0, closed: 0 };
    const active = tasks.filter((task) => task.taskStatus === "Active").length;
    const closed = tasks.filter((task) => task.taskStatus === "Closed").length;
    return { active, closed };
  };

  const taskPriorityCounts = getTaskPriorityCounts();
  const taskStatusCounts = getTaskStatusCounts();

  const downloadTaskReport = async (task) => {
    const pdf = new jsPDF();

    const primaryColor = "#3498db";
    const secondaryColor = "#2ecc71";
    const linkColor = "#2980b9";

    pdf.setFont("helvetica");
    pdf.setFontSize(14);

    pdf.setTextColor(primaryColor);
    pdf.setFontSize(24);
    pdf.text(`${task.taskName} Report`, 20, 30);
    pdf.setFontSize(18);
    pdf.textWithLink("Download PDF", 160, 30, { url: "#" });

    pdf.setFontSize(16);
    pdf.text(`Description: ${task.taskDescription}`, 20, 50);
    pdf.setFontSize(14);
    pdf.text(`Status: ${task.taskStatus}`, 20, 70);
    pdf.text(`Priority: ${task.taskPriority}`, 20, 90);
    pdf.text(
      `Created Date: ${new Date(task.taskCreatedDate).toLocaleDateString()}`,
      20,
      110
    );
    pdf.text(
      `Due Date: ${new Date(task.taskDueDate).toLocaleDateString()}`,
      20,
      130
    );

    if (task.assets && task.assets.length > 0) {
      pdf.setFillColor(secondaryColor);
      pdf.setTextColor("white");
      pdf.setFontSize(18);
      pdf.rect(15, 150, 180, 10, "F");
      pdf.text("Assets", 20, 158);

      pdf.setFontSize(14);
      let y = 170;
      task.assets.forEach((asset, index) => {
        pdf.setTextColor(linkColor);

        pdf.textWithLink(
          `Asset ${index + 1}: ${
            asset.length > 35 ? asset.substring(0, 35) + "..." : asset
          }`,
          20,
          y,
          { url: asset }
        );
        y += 12;
      });
    }

    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor("#7f8c8d");
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pdf.internal.pageSize.width - 20,
        pdf.internal.pageSize.height - 10,
        "right"
      );
    }

    pdf.save(`${task.taskName}_report.pdf`);
  };

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  return (
    <div className="flex flex-wrap w-full h-full rounded-2xl">
      {/* notification button */}
      <div className="h-10 mx-auto  mr-10 mb-3 mt-2 flex flex-wrap shadow-2xl p-0 pb-1 rounded-2xl ">
        <ReportGenerator tasks={tasks} />
        <Button
          gradientDuoTone="purpleToPink"
          pill
          outline
          onClick={() => setIsModalOpen(true)}
          className=" transform transition-transform duration-300 hover:scale-110"
        >
          <AiFillBell className="w-5 h-6" />
          <span className="relative bottom-2 ">{todayTasks.length}</span>
        </Button>
      </div>

      {/* report cards*/}
      <div className="flex flex-wrap justify-evenly h-2/4 rounded-3xl mb-3 shadow-2xl py-2 dark:shadow-neutral-600 dark:bg-neutral-800">
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-blue-700 dark:border-blue-400">
            <p className="text-center text-blue-700 text-2xl font-semibold dark:text-white ">
              Total Boards
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {boards.length}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-green-700 dark:border-green-400">
            <p className="text-center text-green-700 text-2xl font-semibold dark:text-white">
              Total Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {tasks.length}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-yellow-300 dark:border-yellow-300">
            <p className="text-center text-yellow-500 text-2xl font-semibold dark:text-white">
              Active Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {taskStatusCounts.active}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-orange-500 dark:border-red-600">
            <p className="text-center text-orange-500 text-2xl font-semibold dark:text-white">
              Closed Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {taskStatusCounts.closed}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 mb-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-green-400 dark:border-teal-400">
            <p className="text-center text-green-400 text-2xl font-semibold dark:text-white">
              Low Priority Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {taskPriorityCounts.low}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 mb-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-yellow-500 dark:border-yellow-400">
            <p className="text-center text-yellow-500 text-2xl font-semibold dark:text-white mb-0">
              Medium Priority Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 mb-2 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {taskPriorityCounts.medium}
            </p>
          </Card>
        </div>
        <div className="mt-3">
          <Card className="w-72 h-36 mt-2 mb-2 ms-3 rounded-lg shadow-2xl dark:shadow-neutral-700 transform transition-transform duration-300 hover:scale-105 border-l-8 border-red-800 dark:border-red-600">
            <p className="text-center text-red-700 text-2xl font-semibold dark:text-white">
              High Priority Tasks
            </p>
            <p className="mx-auto text-xl text-sky-950 dark:text-white border-4 rounded-3xl p-2 border-neutral-400 bg-neutral-200 dark:bg-neutral-900">
              Count : {taskPriorityCounts.high}
            </p>
          </Card>
        </div>
      </div>

      {/* task table */}
      <div className="w-full p-4 mt-5 mb-6  rounded-3xl dark:bg-neutral-800 dark:shadow-neutral-600  shadow-2xl ">
        <div className="text-center font-bold text-2xl mb-3">
          Overview of Tasks
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-blue-700 text-white dark:bg-cyan-900">
              <tr>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Task Name
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Description
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Status
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Priority
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Created Date
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Due Date
                </th>
                <th className="py-2 px-4 border-b-2 border-blue-700 dark:border-blue-900">
                  Report
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-700 dark:text-neutral-200 ">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {task.taskName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {task.taskDescription}
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-gray-200 dark:border-gray-700 ${
                      task.taskStatus === "Active"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {task.taskStatus}
                  </td>
                  <td
                    className={`py-2 px-4 border-b border-gray-200 dark:border-gray-700 ${
                      task.taskPriority === "High"
                        ? "text-red-500"
                        : task.taskPriority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {task.taskPriority}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {new Date(task.taskCreatedDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {new Date(task.taskDueDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                    {task.taskStatus === "Closed" && (
                      <Button
                        gradientDuoTone="purpleToPink"
                        pill
                        outline
                        onClick={() => downloadTaskReport(task)}
                        className=" transform transition-transform duration-300 hover:scale-105 shadow-2xl dark:shadow-neutral-600"
                      >
                        Download Report
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for current day's Tasks */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header className="notification-model">
          <div className="text-white">Today's Tasks</div>
        </Modal.Header>
        <Modal.Body className="notification-model">
          {todayTasks.length > 0 ? (
            <ul className="list-disc pl-5">
              {todayTasks.map((task) => (
                <li key={task._id}>
                  <p className="text-xl font-semibold capitalize">
                    {task.taskName}
                  </p>
                  <p className="text-md">
                    Due Date : {new Date(task.taskDueDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks due today.</p>
          )}
        </Modal.Body>
        <Modal.Footer className="notification-model">
          <Button
            onClick={() => setIsModalOpen(false)}
            gradientDuoTone="pinkToOrange"
            pill
            className="ms-auto"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default DashBoardHome;
