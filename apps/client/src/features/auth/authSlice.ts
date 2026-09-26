import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@/types/user";

interface AuthState {
  user: UserInfo | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ access_token: string; userInfo: UserInfo }>
    ) => {
      state.token = action.payload.access_token;
      state.user = action.payload.userInfo;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // keep user same
    },
    updateUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload; // keep user same
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout, updateToken, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
