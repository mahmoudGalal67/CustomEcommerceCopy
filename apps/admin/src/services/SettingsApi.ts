// services/colorApi.ts
import { baseApi } from "./baseApi";
import { colorType } from "../types/types";

export const SettingsSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Settings
        getSettings: builder.query<any, any>({
            query: () => "/settings",
            providesTags: ["settings"],
        }),



        // 🔹 UPDATE Settings 
        updateSettings: builder.mutation<any, any>({
            query: (data) => ({
                url: '/settings',
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
} = SettingsSlice;
