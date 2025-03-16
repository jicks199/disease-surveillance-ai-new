import { createSlice } from "@reduxjs/toolkit";
 
 const initialState = {
   isAuth: false, // User is not authenticated by default
   email: null, // User email
   role: null, // User role
 };
 
 const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
     login: (state, action) => {
       state.isAuth = true;
       state.email = action.payload.email;
       state.role = action.payload.role;
     },
     logout: (state) => {
       state.isAuth = false;
       state.email = null;
       state.role = null;
     },
   },
 });
 
 export const { login, logout } = authSlice.actions;
 export default authSlice.reducer;