import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  role: localStorage.getItem("role") || "", // Persist role
};

// Create the slice
const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload); // Store in localStorage
    },
    clearRole: (state) => {
      state.role = "";
      localStorage.removeItem("role"); // Remove from storage on logout
    },
  },
});

// Export actions
export const { setRole, clearRole } = roleSlice.actions;

// Export reducer
export default roleSlice.reducer;
