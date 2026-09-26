import { refreshAccessToken } from "./api";
import api from "./axios";

export function setupInterceptors(store: any) {
    // REQUEST INTERCEPTOR
    api.interceptors.request.use(
        (config) => {
            const token = store.getState().auth.token; // SAFE

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshAccessToken();

                    store.dispatch({
                        type: "auth/updateToken",
                        payload: newToken,
                    });

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return api(originalRequest);
                } catch (e) {
                    console.log("Refresh failed", e);
                }
            }

            return Promise.reject(error);
        }
    );
}
