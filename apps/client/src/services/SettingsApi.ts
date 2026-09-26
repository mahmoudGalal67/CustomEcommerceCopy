
import { baseApi } from "./baseApi";

export const SettingsSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Settings
        getSettings: builder.query<any, any>({
            query: () => "/settings",
        }),
    }),
});

export const {
    useGetSettingsQuery,
} = SettingsSlice;
