import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Dropdown } from "flowbite-react";
import { setSections, setError, taskIdToAdd } from "../Redux/Slice/boardSlice";
import {
  AiFillEdit,
  AiFillDelete,
  AiFillPlusCircle,
  AiOutlineFolderOpen,
  AiOutlineDelete,
} from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskModal from "./TaskModal";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const KanbanBoard = ({ boardId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sections = useSelector((state) => state.boards.sections);
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);

  const handleAddSections = async () => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/section/create-section/${boardId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create section");
      }

      const data = await response.json();
      dispatch(setSections([...sections, data.section]));
      toast.success("Section Added successfully");
    } catch (error) {
      console.error("Error creating section:", error);
      dispatch(setError(error.message));
    }
  };

  const handleEditSection = async (sectionId, newTitle) => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/section/edit-section/${sectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update section");
      }

      const updatedSection = await response.json();
      dispatch(
        setSections(
          sections.map((section) =>
            section._id === sectionId ? updatedSection.section : section
          )
        )
      );
      setEditSectionId(null);
      setEditSectionTitle("");
      toast.success("Section Updated successfully ");
      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating section:", error);
      dispatch(setError(error.message));
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/section/delete-section/${sectionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete section");
      }

      dispatch(
        setSections(sections.filter((section) => section._id !== sectionId))
      );
      toast.success("Section Deleted successfully ");
    } catch (error) {
      console.error("Error deleting section:", error);
      dispatch(setError(error.message));
    }
  };

  const handleAddTask = (sectionId) => {
    setCurrentSectionId(sectionId);
    setShowTaskModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/task/delete-task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }
      dispatch(taskIdToAdd(taskId));
      toast.success("Task Deleted successfully ");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting task:", error);
      dispatch(setError(error.message));
    }
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/task/create-task/${currentSectionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      const createdTask = await response.json();
      const updatedSections = sections.map((section) => {
        if (section._id === currentSectionId) {
          return {
            ...section,
            tasks: [...section.tasks, createdTask.task],
          };
        }
        return section;
      });
      dispatch(setSections(updatedSections));
      handleCloseTaskModal();
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      dispatch(setError(error.message));
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceSectionId = source.droppableId;
    const destinationSectionId = destination.droppableId;

    const updatedSections = [...sections];

    if (sourceSectionId === destinationSectionId) {
      const sectionIndex = updatedSections.findIndex(
        (section) => section._id === sourceSectionId
      );
      if (sectionIndex === -1) return;

      const tasks = [...updatedSections[sectionIndex].tasks];
      const [movedTask] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, movedTask);

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        tasks,
      };
    } else {
      const sourceSectionIndex = updatedSections.findIndex(
        (section) => section._id === sourceSectionId
      );
      const destinationSectionIndex = updatedSections.findIndex(
        (section) => section._id === destinationSectionId
      );

      if (sourceSectionIndex === -1 || destinationSectionIndex === -1) return;

      const sourceTasks = [...updatedSections[sourceSectionIndex].tasks];
      const destinationTasks = [
        ...updatedSections[destinationSectionIndex].tasks,
      ];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      updatedSections[sourceSectionIndex] = {
        ...updatedSections[sourceSectionIndex],
        tasks: sourceTasks,
      };
      updatedSections[destinationSectionIndex] = {
        ...updatedSections[destinationSectionIndex],
        tasks: destinationTasks,
      };
    }

    dispatch(setSections(updatedSections));

    try {
      await fetch(`https://project-management-tool-backend-gayc.onrender.com/api/task/update-position/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: JSON.stringify({
          resourceList:
            updatedSections.find((section) => section._id === sourceSectionId)
              ?.tasks || [],
          destinationList:
            updatedSections.find(
              (section) => section._id === destinationSectionId
            )?.tasks || [],
          resourceSectionId: sourceSectionId,
          destinationSectionId: destinationSectionId,
        }),
      });
    } catch (error) {
      console.error("Error updating task positions:", error);
      dispatch(setError(error.message));
    }
  };

  const handleTaskNavigation = (taskId) => {
    dispatch(taskIdToAdd(taskId));
    navigate("/dashboard?tab=task");
  };

  return (
    <div className="w-full mt-4 flex flex-wrap justify-between">
      <Button
        gradientDuoTone="cyanToBlue"
        pill
        outline
        className="ml-10 hover:scale-110"
        onClick={handleAddSections}
      >
        Add section
      </Button>
      <div className=" px-7 py-1 text-xl mt-1 rounded-2xl border-4  dark:shadow-neutral-700 font-medium shadow-2xl">
        {sections.length} sections
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full mt-4 flex flex-wrap items-start">
          {sections.map((section) => (
            <Droppable key={section._id} droppableId={section._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="m-2 p-4 w-[400px] text-center sm:w-[400px] relative"
                >
                  <Card className=" shadow-2xl dark:shadow-neutral-700 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      {editSectionId === section._id ? (
                        <input
                          type="text"
                          value={editSectionTitle}
                          onChange={(e) => setEditSectionTitle(e.target.value)}
                          className="border-2 border-gray-300 rounded-md p-2 mb-2 mt-4 w-3/4 hover:scale-105 dark:text-black dark:font-semibold"
                        />
                      ) : (
                        <h3 className="text-lg font-bold text-wrap overflow-hidden hover:scale-125">
                          {section.title}
                        </h3>
                      )}
                      <div className="flex gap-2">
                        {!editSectionId ? (
                          <Button
                            className="mr-2 hover:scale-125 my-auto mt-1 py-1"
                            gradientDuoTone="cyanToBlue"
                            onClick={() => {
                              setEditSectionId(section._id);
                              setEditSectionTitle(section.title);
                            }}
                          >
                            <AiFillEdit />
                          </Button>
                        ) : (
                          <Button
                            className="mr-1 hover:scale-110 ml-3 my-auto"
                            gradientDuoTone="cyanToBlue"
                            onClick={() =>
                              handleEditSection(section._id, editSectionTitle)
                            }
                          >
                            Save
                          </Button>
                        )}
                        <Button
                          className="mr-1 hover:scale-110 mt-1 py-1"
                          gradientDuoTone="pinkToOrange"
                          onClick={() => handleDeleteSection(section._id)}
                        >
                          <AiFillDelete className="my-auto" />
                        </Button>
                      </div>
                    </div>

                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className=" relative z-50 mt-4 p-3 border border-gray-300 rounded-xl flex justify-between shadow-xl dark:shadow-neutral-900 hover:scale-105"
                          >
                            <div className="text-md font-semibold ms-2">
                              {task.taskName}
                            </div>

                            <div>
                              <Dropdown
                                className="w-fit  hover:cursor-default relative z-50"
                                arrowIcon={false}
                                inline
                                label={<IoEllipsisVerticalSharp />}
                              >
                                <Dropdown.Item
                                  onClick={() => handleTaskNavigation(task._id)}
                                >
                                  <span>
                                    <AiOutlineFolderOpen className="w-7 h-6 mr-1" />
                                  </span>
                                  Open Task
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleDeleteTask(task._id)}
                                >
                                  <span>
                                    <AiOutlineDelete className="w-7 h-6 mr-1" />
                                  </span>
                                  Delete
                                </Dropdown.Item>
                              </Dropdown>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    <Button
                      className="ms-auto me-auto cursor-pointer w-40 h-12 p-0 mt-5 hover:scale-105 border-2 border-neutral-700 dark:border-neutral-300"
                      onClick={() => handleAddTask(section._id)}
                      gradientDuoTone="cyanToBlue"
                      pill
                    >
                      <span className="py-1 px-2">Create Task</span>
                      <AiFillPlusCircle className="plus-button" />
                    </Button>
                    {provided.placeholder}
                  </Card>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          show={handleAddTask}
          onClose={handleCloseTaskModal}
          onSave={handleCreateTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
