import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "@/schemas/loginSchema";
import { setAccessToken } from "@/utilis/axios";

interface AuthState {
    user: UserInfo | null;
    token: string | null;
    status: "checking" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: "checking",
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
            state.status = "authenticated";
            state.user = action.payload.userInfo;
            setAccessToken(action.payload.access_token);
        },
        updateToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.status = "authenticated";
            setAccessToken(action.payload);
        },
        setUser: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload;
            state.status = "authenticated";
        },
        logout: (state) => {
            state.token = null;
            state.status = "unauthenticated";
            state.user = null;
            setAccessToken(null);
        },

        authChecked: (state) => {
            state.status = "unauthenticated";
            setAccessToken(null);
        },
    },
});

export const { setCredentials, logout, updateToken, authChecked, setUser } =
    authSlice.actions;
export default authSlice.reducer;
