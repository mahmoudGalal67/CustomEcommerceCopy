import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string | null;
    status: "checking" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
    token: null,
    status: "checking",
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ access_token: string; }>
        ) => {
            state.token = action.payload.access_token;
            state.status = "authenticated";
        },
        updateToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.status = "authenticated";
        },

        logout: (state) => {
            state.token = null;
            state.status = "unauthenticated";
        },

        authChecked: (state) => {
            state.status = "unauthenticated";
        },
    },
});

export const { setCredentials, logout, updateToken, authChecked } =
    authSlice.actions;
export default authSlice.reducer;
