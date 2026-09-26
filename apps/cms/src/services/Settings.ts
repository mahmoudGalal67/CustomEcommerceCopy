// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
            query: () => ({ url: "/settings", method: "GET" }),
            providesTags: ["settings"],
        }),

        updateSettings: builder.mutation({
            query: (data) => ({
                url: "/settings",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["settings"],
        }),

    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,

} = settingsApi;
