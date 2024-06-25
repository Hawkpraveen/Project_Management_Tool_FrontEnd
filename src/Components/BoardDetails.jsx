import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  setError,
  updateBoard,
  setBoards,
  clearToast,
  setSections,
} from "../Redux/Slice/boardSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KanbanBoard from "./KanbanBoard";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";

const BoardDetails = ({ boardId }) => {
  const dispatch = useDispatch();
  const board = useSelector((state) =>
    state.boards.boards.find((b) => b._id === boardId)
  );
  const [loading, setLoadingState] = useState(false);
  const [error, setErrorState] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const toastMessage = useSelector((state) => state.boards.toastMessage);
  const navigate = useNavigate();

  useEffect(() => {
    if (toastMessage) {
      toast.success(toastMessage);
      dispatch(clearToast());
      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, [toastMessage]);

  useEffect(() => {
    const fetchBoardDetails = async () => {
      setLoadingState(true);
      dispatch(setLoading());
      try {
        const response = await fetch(
          `https://project-management-tool-backend-gayc.onrender.com/api/board/get-board/${boardId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch board");
        }
        const data = await response.json();

        dispatch(setBoards([data.board]));
        dispatch(setSections(data.board.sections));
        setLoadingState(false);
      } catch (error) {
        setErrorState(error.message);
        dispatch(setError(error.message));
        setLoadingState(false);
      }
    };

    fetchBoardDetails();
  }, [dispatch, boardId]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(board?.title || "");
  };

  const handleDescriptionClick = () => {
    setIsEditingDescription(true);
    setEditedDescription(board?.description || "");
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (editedTitle !== board?.title) {
      await updateBoardDetails({ ...board, title: editedTitle });
    }
  };

  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false);
    if (editedDescription !== board?.description) {
      await updateBoardDetails({ ...board, description: editedDescription });
    }
  };

  const updateBoardDetails = async (updatedBoard) => {
    dispatch(updateBoard(updatedBoard));
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/board/edit-board/${boardId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify(updatedBoard),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update board");
      }
      const data = await response.json();
      dispatch(updateBoard(data.board));
    } catch (error) {
      console.log(error);
      setErrorState(error.message);
      dispatch(setError(error.message));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!board) {
    return <Alert color="failure">Board not found</Alert>;
  }

  return (
    <div className="w-full p-3 flex-wrap">
      <div className="mb-3 ml-1 w-fit">
        <Button
          className="flex hover:scale-105"
          pill
          gradientDuoTone="purpleToBlue"
          outline
          onClick={() => {
            navigate("?tab=boardslist");
          }}
          
        >
          <HiArrowLeft className="w-6 h-5 " />
          <span className="text-md ml-1 ">Back</span>
        </Button>
      </div>

      <div className="text-start text-3xl mb-3 mt-2 px-5 flex">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            autoFocus
            className="dark:focus:bg-slate-800  focus:border-4 dark:focus:border-sky-500 focus:border-sky-700 border-spacing-2 cursor-pointer rounded-xl"
          />
        ) : (
          <h2 onClick={handleTitleClick}>{board.title}</h2>
        )}
      </div>
      <div className="text-start text-xl px-14">
        {isEditingDescription ? (
          <textarea
            value={editedDescription}
            onChange={handleDescriptionChange}
            onBlur={handleDescriptionBlur}
            autoFocus
            className=" w-full h-32 text-wrap overflow-auto dark:focus:bg-slate-800  focus:border-4 dark:focus:border-sky-500 focus:border-sky-700 border-spacing-2 cursor-pointer rounded-xl"
          />
        ) : (
          <p onClick={handleDescriptionClick}>{board.description}</p>
        )}
      </div>
      <hr className="mt-2 border-neutral-900 border-2 dark:border-neutral-300" />
      <div>
        <KanbanBoard boardId={boardId} />
      </div>
    </div>
  );
};

export default BoardDetails;
