import { configureStore } from "@reduxjs/toolkit";
 import authReducer from "./new/authslice.tsx";
 
 const store = configureStore({
   reducer: {
     auth: authReducer,
   },
 });
 
 export default store;