import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshAccessToken } from "@/utilis/api";
import { logout, updateToken } from "@/context/authSlice";

export const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  credentials: "include", // send refresh cookie

  prepareHeaders: (headers, { getState }: any) => {
    const auth = getState()?.auth;
    if (auth) {
      headers.set("Authorization", `Bearer ${auth.token}`);
    }

    return headers;
  },
});

// wrapper to auto-refresh when 401 happens
const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  // first attempt
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      // refresh access token
      const newAccess = await refreshAccessToken();
      api.dispatch(updateToken(newAccess));

      // prepare retry args safely
      const retryArgs =
        typeof args === "string"
          ? { url: args, headers: { Authorization: `Bearer ${newAccess}` } }
          : {
              ...args,
              headers: {
                ...(args.headers || {}),
                Authorization: `Bearer ${newAccess}`,
              },
            };

      // retry original request
      result = await baseQuery(retryArgs, api, extraOptions);
    } catch (err) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Products",
    "Orders",
    "Categories",
    "UserInfo",
    "Users",
    "Colors",
    "Sizes",
    "settings",
    "Chats",
    "Events",
    "Features",
    "ContactMessages",
    "NewsletterSubscribers",
  ],
  endpoints: () => ({}),
});
