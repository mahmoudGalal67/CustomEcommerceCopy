// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const pageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPage: builder.query({
            query: () => ({ url: "/pages", method: "GET" }),
            providesTags: ["pages"],
        }),
        showPage: builder.query({
            query: ({ id }) => ({ url: `/pages${id}`, method: "GET" }),
            providesTags: ["pages"],
        }),

        getPageLinks: builder.query({
            query: () => ({ url: "/pages/pagesLinks", method: "GET" }),
            providesTags: ["pagesLinks"],
        }),
    }),
});

export const {
    useGetPageQuery,
    useGetPageLinksQuery,
    useShowPageQuery,
} = pageApi;
