import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../context/authSlice";
import { authApi } from "../services/authApi";
import { baseApi } from "@/services/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      baseApi.middleware,
    ]),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


