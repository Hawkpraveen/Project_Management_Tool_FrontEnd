import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput, Label, Textarea, Select, Datepicker } from "flowbite-react";

const TaskModal = ({ task, onSave, onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("Active");
  const [taskPriority, setTaskPriority] = useState("Low");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [technologies, setTechnologies] = useState("MERN Stack");
  const [role, setRole] = useState("Developer");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTaskName(task.taskName || "");
      setTaskDescription(task.taskDescription || "");
      setTaskStatus(task.taskStatus || "Active");
      setTaskPriority(task.taskPriority || "Low");
      setTaskDueDate(
        task.taskDueDate
          ? new Date(task.taskDueDate).toISOString().split("T")[0]
          : ""
      );
      setTechnologies(task.technologies);
      setRole(task.role);
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    if (!taskName.trim()) {
      newErrors.taskName = "Task name is required";
    }
    if (!taskDescription.trim()) {
      newErrors.taskDescription = "Task description is required";
    }
    if (!taskDueDate) {
      newErrors.taskDueDate = "Task due date is required";
    } else {
      const today = new Date().toISOString().split("T")[0];
      if (taskDueDate < today) {
        newErrors.taskDueDate = "Task due date cannot be in the past";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("taskName", taskName);
    formData.append("taskDescription", taskDescription);
    formData.append("taskStatus", taskStatus);
    formData.append("taskPriority", taskPriority);
    formData.append("taskDueDate", taskDueDate);
    formData.append("technologies", technologies);
    formData.append("role", role);

    const data = {
      taskName,
      taskDescription,
      taskStatus,
      taskPriority,
      taskDueDate,
      role,
      technologies,
    };

    onSave(data);
  };

  return (
    <Modal show={true} onClose={onClose}>
      <Modal.Header className=" bg-slate-600"> Create Task</Modal.Header>
      <Modal.Body className=" bg-slate-600">
        <div className="space-y-6 ">
          <div>
            <Label htmlFor="taskName" value="Task Name" />
            <TextInput
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              color={errors.taskName ? "failure" : undefined}
              className="hover:scale-105"
            />
            {errors.taskName && (
              <p className="text-red-500">{errors.taskName}</p>
            )}
          </div>
          <div>
            <Label htmlFor="taskDescription" value="Task Description" />
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              color={errors.taskDescription ? "failure" : undefined}
              className="hover:scale-105"
            />
            {errors.taskDescription && (
              <p className="text-red-500">{errors.taskDescription}</p>
            )}
          </div>
          <div>
            <Label htmlFor="taskStatus" value="Task Status" />
            <Select
              id="taskStatus"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="hover:scale-105"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="taskPriority" value="Task Priority" />
            <Select
              id="taskPriority"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="hover:scale-105"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="taskDueDate" value="Task Due Date" />
            <TextInput
              type="date"
              id="taskDueDate"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
              color={errors.taskDueDate ? "failure" : undefined}
              
            />

            {errors.taskDueDate && (
              <p className="text-red-500">{errors.taskDueDate}</p>
            )}
          </div>
          <div>
            <Label htmlFor="technologies" value="Technologies" />
            <Select
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="hover:scale-105"
            >
              <option value="MERN Stack">MERN Stack</option>
              <option value="MEAN Stack">MEAN Stack</option>
              <option value="Python Full Stack">Python Full Stack</option>
              <option value="JAVA Full Stack">JAVA Full Stack</option>
              <option value="Mobile App Development">
                Mobile App Development
              </option>
            </Select>
          </div>
          <div>
            <Label htmlFor="role" value="Role" />
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="hover:scale-105"
            >
              <option value="Team Leader">Team Leader</option>
              <option value="Developer">Developer</option>
              <option value="Tester">Tester</option>
              <option value="Designer">Designer</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className=" bg-slate-600" >
        <Button onClick={handleSave} gradientDuoTone='cyanToBlue' className="hover:scale-105">Create</Button>
        <Button gradientDuoTone='pinkToOrange' onClick={onClose} className="hover:scale-105">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
