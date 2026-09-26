// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const pageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPage: builder.query({
            query: () => ({ url: "/pages", method: "GET" }),
            providesTags: ["pages"],
        }),
        showPage: builder.query({
            query: ({ id }) => ({ url: `/pages/${id}`, method: "GET" }),
            providesTags: ["pages"],
        }),
        getPageLinks: builder.query({
            query: () => ({ url: "/pages/pagesLinks", method: "GET" }),
            providesTags: ["pagesLinks"],
        }),

        addToPage: builder.mutation({
            query: (data) => ({
                url: "/pages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["pages"],
        }),
        updatePage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/pages/${id}`,
                method: "PUT",
                body: data,
            }),
            // invalidatesTags: ["pages"],
        }),
        removeFromPage: builder.mutation({
            query: (id) => ({
                url: `/pages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["pages"],
        }),
        mergePage: builder.mutation({
            query: () => ({
                url: "/pages/merge",
                method: "pages",
            }),
            invalidatesTags: ["pages"],
        }),
    }),
});

export const {
    useGetPageQuery,
    useShowPageQuery,
    useGetPageLinksQuery,
    useAddToPageMutation,
    useUpdatePageMutation,
    useRemoveFromPageMutation,
    useMergePageMutation,
} = pageApi;
