import axios from "axios";

const isServer = typeof window === "undefined";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
// const baseURL = isServer
//   ? process.env.API_INTERNAL_URL
//   : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

export default api;
