import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: string | null;
}

const initialState: AuthState = {
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      localStorage.setItem('role', action.payload); // Persist role in storage
    },
    logout: (state) => {
      state.role = null;
      localStorage.removeItem('role');
      sessionStorage.removeItem('role');
    },
  },
});

export const { setRole, logout } = authSlice.actions;
export default authSlice.reducer;
