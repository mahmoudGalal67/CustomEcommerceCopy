import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/authApi";

import authReducer from "@/context/authSlice";
import { pageApi } from "@/services/pagesApi";
import { setupInterceptors } from "@/utilis/setupInterceptors";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [pageApi.reducerPath]: pageApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([authApi.middleware, pageApi.middleware]),
});

// IMPORTANT: initialize axios interceptors AFTER store is created

setupInterceptors(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
