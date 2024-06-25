import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Alert,
  Button,
  TextInput,
  Label,
  Select,
  Textarea,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowDown, AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { HiArrowLeft } from "react-icons/hi";
import { toast } from "react-toastify";

const TaskDetails = ({ taskId }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    taskName: "",
    taskDescription: "",
    taskPriority: "Low",
    taskDueDate: "",
    technologies: "MERN Stack",
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `https://project-management-tool-backend-gayc.onrender.com/api/task/get-task/${taskId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        setTask(response.data.task);
        setFormValues({
          taskName: response.data.task.taskName,
          taskDescription: response.data.task.taskDescription,
          taskPriority: response.data.task.taskPriority,
          taskDueDate: new Date(response.data.task.taskDueDate)
            .toISOString()
            .split("T")[0],
          technologies: response.data.task.technologies,
        });
        setImageUrls(response.data.task.assets);
      } catch (err) {
        setError("Error fetching task details");
      }
    };
    fetchTask();
  }, [taskId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      setImages(selectedImages);
    }
  };

  const handleUpload = () => {
    if (images.length === 0) return;

    const storage = getStorage(app);

    images.forEach((image) => {
      const fileName = new Date().getTime() + "-" + image.name;
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error("Error uploading image: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUrls((prevUrls) => [...prevUrls, downloadURL]);
          });
        }
      );
    });
  };

  const handleSaveTask = async () => {
    try {
      const updatedFormValues = {
        ...formValues,
        assets: imageUrls,
      };

      await axios.put(
        `https://project-management-tool-backend-gayc.onrender.com/api/task/edit-task/${taskId}`,
        updatedFormValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      setTask((prevTask) => ({
        ...prevTask,
        ...updatedFormValues,
      }));
      setIsEditing(false);
      toast.success(`Task updated successfully`);
    } catch (err) {
      setError("Error updating task");
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className=" w-full mt-20 ">
        <div className="flex justify-center mb-10">
          <Alert color="failure" className="text-3xl">
            {error}
          </Alert>
        </div>
        <div className="">
          <p className="flex justify-center mb-4">
            Click the below button to go to boards
          </p>
          <AiOutlineArrowDown className="mx-auto m-4 w-10 h-8" />
          <Button
            onClick={() => {
              navigate("/dashboard?tab=boardslist");
            }}
            gradientDuoTone="cyanToBlue"
            className="mx-auto"
          >
            Go
          </Button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center h-64 ">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-1 mt-2 ml-2">
        <Button
          className="flex hover:scale-110"
          pill
          gradientDuoTone="purpleToBlue"
          outline
          onClick={() => {
            navigate("?tab=boarddetails");
          }}
        >
          <HiArrowLeft className="w-6 h-5 " />
          <span className="text-md ml-1">Back</span>
        </Button>
      </div>
      <Card className="w-full h-full md:w-[800px] mx-auto mt-3 mb-10 rounded-2xl text-xl dark:shadow-neutral-700 shadow-2xl">
        <div className="flex ms-auto">
          <Button
            gradientDuoTone="cyanToBlue"
            onClick={() => setIsEditing(!isEditing)}
            className="hover:scale-110 mr-2"
            pill
            outline
          >
            <AiOutlineEdit className="w-4 h-5" />
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskName" value="Task Name" />
              <TextInput
                id="taskName"
                name="taskName"
                value={formValues.taskName}
                onChange={handleInputChange}
                className="hover:scale-x-105"
              />
            </div>
            <div>
              <Label htmlFor="taskDescription" value="Task Description" />
              <Textarea
                id="taskDescription"
                name="taskDescription"
                value={formValues.taskDescription}
                onChange={handleInputChange}
                className="hover:scale-x-105"
              />
            </div>
            <div>
              <Label htmlFor="taskPriority" value="Task Priority" />
              <Select
                id="taskPriority"
                name="taskPriority"
                value={formValues.taskPriority}
                onChange={handleInputChange}
                className="hover:scale-x-105"
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
                name="taskDueDate"
                value={formValues.taskDueDate}
                onChange={handleInputChange}
                className="hover:scale-x-105"
              />
            </div>
            <div>
              <Label htmlFor="technologies" value="Technologies" />
              <Select
                id="technologies"
                name="technologies"
                value={formValues.technologies}
                onChange={handleInputChange}
                className="hover:scale-x-105"
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
            <div className="py-5">
              <div className="flex justify-between">
                <Label
                  htmlFor="image"
                  value="Upload Images"
                  className="text-xl"
                />
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  multiple // Allow multiple file selection
                  accept="image/*"
                  className="ml-5 hover:scale-105"
                />
                <Button
                  onClick={handleUpload}
                  gradientDuoTone="cyanToBlue"
                  className="my-auto hover:scale-110"
                  pill
                  outline
                >
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex justify-around flex-wrap">
              {imageUrls.length > 0 &&
                imageUrls.map((url, index) => (
                  <div key={index}>
                    <Card className="w-60 h-52 mb-5">
                      <img
                        src={url}
                        alt={`Uploaded Image ${index}`}
                        className="w-50 h-48 p-3 hover:scale-105"
                        style={{ maxWidth: "100%" }}
                      />
                    </Card>
                  </div>
                ))}
            </div>

            <div className="flex justify-end">
              <Button
                gradientDuoTone="cyanToBlue"
                onClick={handleSaveTask}
                pill
                outline
                className="hover:scale-110 "
              >
                Save
              </Button>
              <Button
                color="gray"  
                onClick={() => setIsEditing(false)}
                pill
                outline
                className="hover:scale-110 ml-2"
                gradientDuoTone='pinkToOrange'
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mx-auto capitalize text-cyan-600">
              {task.taskName}
            </h1>
            <p className="mt-2 text-cyan-600 text-xl capitalize font-semibold">
              Task Description : {task.taskDescription}
            </p>
            <p className="mt-2 ">
              <span className="font-semibold">Status:</span>{" "}
              {task.taskStatus === "Active" ? (
                <span className=" text-emerald-600">Active</span>
              ) : (
                <span className=" text-dashed text-red-600">Closed</span>
              )}
            </p>
            <p className="mt-2 ">
              <span className="font-semibold">Priority : </span>{" "}
              {task.taskPriority}
            </p>
            <p className="mt-2 ">
              <span className="font-semibold">Role : </span> {task.role}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Created Date : </span>
              {new Date(task.taskCreatedDate).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <span className="font-semibold">Due Date : </span>{" "}
              {new Date(task.taskDueDate).toLocaleDateString()}
            </p>
            <p className="mt-2 text-xl">
              <span className="font-semibold">Technology : </span>{" "}
              {task.technologies}
            </p>
            {task.assets && (
              <div>
                <h3 className="text-xl font-semibold mt-1">Attachments</h3>
                <div className="flex-wrap flex justify-evenly mt-4">
                  {task.assets.map((asset, index) => (
                    <div key={index} className="m-2">
                      <Card className="w-72 h-full">
                        <div className="justify-center flex mt-1 mb-3">
                          <img
                            src={asset}
                            alt={`Attachment ${index}`}
                            className=" w-38 h-48 img-hover "
                          />
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default TaskDetails;
