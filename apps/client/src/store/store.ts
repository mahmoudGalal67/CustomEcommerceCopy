import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/authApi";
import { cartApi } from "@/services/cartApi";

import authReducer from "@/features/auth/authSlice";

import { setupInterceptors } from "@/utilis/setupInterceptors";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, cartApi.middleware]),
});

// IMPORTANT: initialize axios interceptors AFTER store is created
setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
