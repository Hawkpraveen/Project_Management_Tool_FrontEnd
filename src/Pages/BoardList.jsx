import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  setBoards,
  setError,
  clearBoards,
  updateBoard,
  addBoard,
  removeBoard,
  boardIdToAdd,
  clearToast,
} from "../Redux/Slice/boardSlice";
import { Card, Button } from "flowbite-react";
import { AiFillEdit, AiFillPlusSquare, AiFillDelete } from "react-icons/ai";

import BoardModal from "../Components/BoardModal";
import { useNavigate } from "react-router-dom";

const BoardList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.boards.boards);
  const error = useSelector((state) => state.boards.error);
  const [showModal, setShowModal] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [hoveredBoard, setHoveredBoard] = useState(null);

  const toastMessage = useSelector((state) => state.boards.toastMessage);

  useEffect(() => {
    if (toastMessage === "Board updated successfully") {
      window.setTimeout(() => {
        window.location.reload();
      }, 1000);
      dispatch(clearToast());
    }
    if (handleDeleteBoard) {
      toast.success(toastMessage);
      dispatch(clearToast());
    }
  }, [toastMessage, dispatch]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(
          "https://project-management-tool-backend-gayc.onrender.com/api/board/get-boards",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch boards");
        }

        const data = await response.json();
        dispatch(setBoards(data.boards));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };

    const token = localStorage.getItem("Token");
    if (token) {
      fetchBoards();
    } else {
      dispatch(clearBoards());
    }
  }, [dispatch]);

  if (!localStorage.getItem("Token")) {
    return <p className="text-red-600">Please sign in to view boards.</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  const handleCreateBoard = () => {
    setCurrentBoard(null);
    setShowModal(true);
  };

  const handleEditBoard = (board) => {
    setCurrentBoard(board);
    setShowModal(true);
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      const response = await fetch(
        `https://project-management-tool-backend-gayc.onrender.com/api/board/delete-board/${boardId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete board");
      }
      dispatch(removeBoard(boardId));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  const handleSaveBoard = async (formData) => {
    try {
      let response;
      if (currentBoard && currentBoard._id) {
        response = await fetch(
          `https://project-management-tool-backend-gayc.onrender.com/api/board/edit-board/${currentBoard._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        response = await fetch("https://project-management-tool-backend-gayc.onrender.com/api/board/create-board", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to save board");
      }
      const data = await response.json();

      if (currentBoard) {
        dispatch(updateBoard(data.board));
        toast.success("Board updated successfully") 
      } else {
        dispatch(addBoard(data.board));
        toast.success("Board created successfully")
      }
      setShowModal(false);
      setCurrentBoard(null);
    } catch (error) {
      console.log(error);

      dispatch(setError(error.message));
    }
  };

  const handleMouseEnter = (board) => {
    setHoveredBoard(board);
  };

  const handleMouseLeave = () => {
    setHoveredBoard(null);
  };

  const handleNavigate = (boardId) => {
    dispatch(boardIdToAdd(boardId));

    navigate(`/dashboard?tab=boarddetails`);
  };

  return (
    <div className="max-w-lg mx-auto p-2 w-full flex-wrap fade-in-text">
      <div className="bg-slate-800">
        <Card className="text-2xl items-center font-bold rounded-2xl dark:shadow-neutral-700 shadow-2xl justify-center flex ms-auto me-auto mt-3 bg-slate-700 text-white">
          <h1>LIST OF BOARDS</h1>
        </Card>
      </div>
      <div className="block mt-5 flex-wrap justify-evenly fade-in-text-home">
        {boards.length === 0 ? (
          <p className="text-2xl items-center font-bold flex-1 text-center mb-5">
            No boards found.
          </p>
        ) : (
          <ul>
            {boards.map((board) => (
              <Card
                key={board._id}
                className="relative min-w-72 shadow-2xl rounded-2xl dark:shadow-neutral-700 min-h-32 items-center text-center mb-2 hover:bg-slate-600 hover:text-white dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:hover:border-slate-600 hover:cursor-pointer border-neutral-300 border-4 hover:border-slate-800"
                onMouseEnter={() => handleMouseEnter(board)}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={() => handleNavigate(board._id)}
              >
                <li>
                  <h3 className=" font-semibold  mb-3 text-xl ">
                    {board.title}
                  </h3>
                  <p className="text-lg ">{board.description}</p>
                  <Button
                    className="mt-2  xl:hidden"
                    onClick={() => handleNavigate(board._id)}
                  >
                    View Board
                  </Button>
                </li>
                {hoveredBoard === board && (
                  <div className="absolute top-2 right-2 flex">
                    <AiFillEdit
                      className="text-xl cursor-pointer mr-2"
                      onClick={() => handleEditBoard(board)}
                    />
                    <AiFillDelete
                      className="text-xl cursor-pointer"
                      onClick={() => handleDeleteBoard(board._id)}
                    />
                  </div>
                )}
              </Card>
            ))}
          </ul>
        )}

        <Card
          className="items-center min-w-72 max-h-32 mt-2 rounded-2xl shadow-2xl dark:shadow-neutral-700 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 mb-5 border-4 border-neutral-300"
          onClick={handleCreateBoard}
        >
          <span className="me-auto ms-auto text-3xl">
            <AiFillPlusSquare />
          </span>
          <h3>Click here to add new board</h3>
        </Card>
      </div>

      <BoardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBoard}
        boardData={currentBoard}
      />
    </div>
  );
};

export default BoardList;
