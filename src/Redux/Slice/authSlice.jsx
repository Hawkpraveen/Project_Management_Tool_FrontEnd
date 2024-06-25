import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = {
  currentuser: [],
  token: null,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signupStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    signupSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.error = null;
      state.loading = false;
      toast.success("User created successfully.");
    },
    signupFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.error(action.payload);
    },
    signinStart: (state) => {
      state.error = null;
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.token = action.payload.token;
      state.error = null;
      state.loading = false;
      toast.success("User logged in successfully");
    },
    signinFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      console.log("payload", action.payload);
      toast.error(action.payload);
    },
    signOutSuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentuser.rest = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentuser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signupStart,
  signupSuccess,
  signupFailure,
  signinStart,
  signinSuccess,
  signinFailure,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
} = authSlice.actions;

export default authSlice.reducer;
