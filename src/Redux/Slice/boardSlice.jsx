// boardSlice.js

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  boards: [],
  sections: [],
  tasks: [],
  boardIdToAdd: null,
  taskIdToAdd:null,
  error: null,
  loading: false,
  toastMessage: null,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
      state.error = null;
      state.loading = false;
    },
    addBoard: (state, action) => {
      state.boards.push(action.payload);
      state.toastMessage = "Board added successfully";
      state.error = null;
    },
    updateBoard: (state, action) => {
      const updatedBoard = action.payload;
      state.boards = state.boards.map((board) =>
        board._id === updatedBoard? updatedBoard : board
      );
      state.toastMessage = "Board updated successfully";
      state.error = null;
    },
    removeBoard: (state, action) => {
      const boardIdToRemove = action.payload;
      state.boards = state.boards.filter(
        (board) => board._id !== boardIdToRemove
      );
      state.toastMessage = "Board deleted successfully";
      state.error = null;
    },
    boardIdToAdd: (state, action) => {
      state.boardIdToAdd = action.payload;
    },
    setSections: (state, action) => {
      state.sections = action.payload;
      state.error = null;
      state.loading = false;
    },
    addSection: (state, action) => {
      state.sections.push(action.payload);
      state.toastMessage = "Section added successfully";
      state.error = null;
    },
    addTask: (state, action) => {
      const { sectionId, task } = action.payload;
      const section = state.sections.find(section => section._id === sectionId);
      if (section) {
        section.tasks.push(task);
      }
    },
    taskIdToAdd: (state, action) => {
      state.taskIdToAdd = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearBoards: (state) => {
      state.boards = [];
      state.error = null;
      state.toastMessage = null;
    },
    clearToast: (state) => {
      state.toastMessage = null;
    },
  },
});

export const {
  setBoards,
  addBoard,
  updateBoard,
  removeBoard,
  boardIdToAdd,
  setSections,
  addTask,
  taskIdToAdd,
  setLoading,
  setError,
  clearBoards,
  clearToast,
  reloadPage,
} = boardSlice.actions;

export default boardSlice.reducer;
