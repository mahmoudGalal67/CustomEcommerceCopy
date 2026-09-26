// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const AnnouncementBarpi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    showAnnouncementBar: builder.query({
      query: () => ({ url: `/announcement-bar`, method: "GET" }),
      providesTags: [" AnnouncementBar"],
    }),

    updateAnnouncementBar: builder.mutation({
      query: ({ data }) => ({
        url: `/announcement-bar`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [" AnnouncementBar"],
    }),
  }),
});

export const { useShowAnnouncementBarQuery, useUpdateAnnouncementBarMutation } =
  AnnouncementBarpi;
