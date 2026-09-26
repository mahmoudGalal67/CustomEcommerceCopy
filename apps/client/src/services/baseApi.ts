import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { refreshAccessToken } from "@/utilis/api";
import { logout, updateToken } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  credentials: "include", // send refresh cookie
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// wrapper to auto-refresh when 401 happens
const baseQueryWithRefresh = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    try {
      const newAccess = await refreshAccessToken();

      api.dispatch(updateToken(newAccess));

      result = await baseQuery(
        { ...args, headers: { Authorization: `Bearer ${newAccess}` } },
        api,
        extraOptions,
      );
    } catch (err) {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    "Cart",
    "Wishlist",
    "pages",
    "Products",
    "Chat",
    "pagesLinks",
    "AnnouncementBar",
    "PopupCampaign",
    "User",
    "Features",
  ],
  endpoints: () => ({}),
});
