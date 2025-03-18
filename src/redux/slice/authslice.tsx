import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false, // User is not authenticated by default
  email: null, // User email
  role: null, // User role
  hospitalId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
      // if (action.payload.role === "hospital") {
      state.hospitalId = action.payload.id;
      // }
    },

    logout: (state) => {
      state.isAuth = false;
      state.email = null;
      state.role = null;
      state.hospitalId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
