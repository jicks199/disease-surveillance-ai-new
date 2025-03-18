import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false, // User is not authenticated by default
  email: null,   // User email
  role: null,    // User role
  district: null // Add district to state, null by default
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuth = true;
      state.email = action.payload.email;
      state.role = action.payload.role;
      // Check if district exists in payload, set it if present, otherwise null
      state.district = action.payload.district || null;
    },
    logout: (state) => {
      state.isAuth = false;
      state.email = null;
      state.role = null;
      state.district = null; // Reset district on logout
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;