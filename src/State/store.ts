import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./slices/roleSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    role: roleReducer,
    auth: authReducer,
  },
});
