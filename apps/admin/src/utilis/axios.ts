// services/axiosUpload.ts
import axios from "axios";
import { refreshAccessToken } from "@/utilis/api";

let accessToken: string | null = null;

const isServer = typeof window === "undefined";

const baseURL = isServer
  ? process.env.API_INTERNAL_URL
  : process.env.NEXT_PUBLIC_API_URL;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const axiosBaseApi = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

// Request interceptor for adding token
axiosBaseApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});

// Response interceptor for handling 401
axiosBaseApi.interceptors.response.use(
  (res) => res, // pass success
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh token
        const newAccess = await refreshAccessToken();
        setAccessToken(newAccess);

        // update Authorization header
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // retry original request
        return axiosBaseApi(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
