import React from "react";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center dark:text-white dark:bg-black">
      <div className="w-4/5 mt-2 bg-white mb-3 mx-auto rounded-lg p-8 dark:text-white dark:bg-neutral-900 dark:shadow-2xl dark:shadow-neutral-400 shadow-2xl ">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 dark:text-white">
          About
        </h1>
        <p className="text-lg text-gray-700 mb-8 dark:text-gray-300">
          Welcome to{" "}
          <span className="font-semibold text-cyan-400">
            Project Management Tool
          </span>
          , a management tool developed by me using the MERN stack (MongoDB,
          Express.js, React, and Node.js). This tool is designed to help
          individuals manage their projects more efficiently and effectively.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b-2 border-purple-500 pb-2">
            Features
          </h2>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Secure Access
            </h3>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-neutral-200">
              <li className="mb-1">
                Only authorized users can access the web app.
              </li>
              <li className="mb-1">
                Secure Google login integration for easy and safe sign-in.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Task Details
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              View comprehensive task details including project name,
              description, technologies used, and deadlines. Handle your
              projects with a clear view of all essential information.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Task Organization
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Filter and organize tasks by categories, deadlines, descriptions,
              status, and priority. Easily find and manage tasks based on your
              specific needs and preferences.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Project Management
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Create, update, delete, and view projects. Access detailed project
              information including title, description, category, deadlines, and
              available actions.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              CRUD Operations
            </h3>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-neutral-200">
              <li className="mb-1">
                <strong>Boards:</strong> Create new project boards, view
                existing boards, update board details, and delete boards that
                are no longer needed.
              </li>
              <li className="mb-1">
                <strong>Sections:</strong> Organize tasks within boards by
                creating sections. Update section details and
                delete them as required.
              </li>
              <li className="mb-1">
                <strong>Tasks:</strong> Add new tasks to sections, view task
                details, update task information, and delete tasks to keep your
                project board clean and relevant.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Progress Monitoring
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Monitor project progress with intuitive dashboards and detailed
              reports. Receive alerts for approaching deadlines, including
              today's deadlines and tasks due within one week.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Dashboard Features
            </h3>
            <ul className="list-disc list-inside ml-4 text-gray-700 dark:text-neutral-200">
              <li className="mb-1">
                Contains tables to download individual reports of projects if
                the task status is closed.
              </li>
              <li className="mb-1">
                Includes a calendar to view and manage deadlines and important
                dates.
              </li>
              <li className="mb-1">
                Update user profile information such as username, password, and
                profile picture.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Reporting and Documentation
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Generate comprehensive reports at the end of a project if the
              status is closed. Convert reports into documentation and download
              them for future reference. Download overall tasks for complete
              project documentation.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Kanban Board Style
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Utilize a Kanban board style interface for visual project
              management. Drag and drop tasks between sections to streamline
              your workflow.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              Theme Toggle
            </h3>
            <p className="text-gray-700 dark:text-neutral-200">
              Switch between light and dark themes to suit your preference and
              working environment.
            </p>
          </div>
        </div>

        <hr className="border-gray-200 my-6" />

        <p className="text-center text-gray-700 mr-3">   
          Feel free to contact me at{" "}
          <a
            href="mailto:praveen.pk200109@gmail.com"
            className="text-purple-600 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            praveen.pk200109@gmail.com
          </a> 
       <span className="ml-1">with any questions or feedback.</span>   
        </p>
      </div>
    </div>
  );
};

export default About;
