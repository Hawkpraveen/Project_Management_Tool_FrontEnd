import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../Redux/Slice/authSlice";


const DashboardProfile = () => {
  const dispatch = useDispatch();
  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const filePickerRef = useRef();

  //onchange in the image uploading
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  
  //uploading process
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  //firbase image upload and storage part
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); //10.6794764
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload the image (File size must be less than 2MB"
        );
        setImageFileUrl(null);
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  //onchange in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //updating user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No Changes Made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait while the image is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/user/update/${currentuser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  //signout
  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };
  //delete user
  const handleDelete = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/user/delete/${currentuser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("Token"),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 w-full">
      <h1 className="my-7 text-center font-semibold text-4xl">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          ref={filePickerRef}
          onChange={handleImageChange}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,190,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentuser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">⚠️ OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="UserName"
          defaultValue={currentuser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentuser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="********"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="cyanToBlue"
          disabled={loading || imageFileUploading}
        >
          {loading ? "loading..." : "update"}
        </Button>
      </form>
      <div className="text-red-600 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">😊 Yaaa!</span>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">⚠️ OOPS!</span>
          {updateUserError}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg  text-gray-500 dark:text-gray-200">
              Are you sure you want to delete this Account
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes,I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No,Changed My Mind
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
