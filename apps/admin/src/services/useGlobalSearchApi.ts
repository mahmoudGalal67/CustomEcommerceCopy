// services/colorApi.ts
import { baseApi } from "./baseApi";

export const GlobalSearch = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Features
        globalSearch: builder.query<any, any>({
            query: (q: string) => ({
                url: "/globalSearch",
                method: "GET",
                params: {
                    q,
                },
            }),
        }),
    }),
});

export const {
    useGlobalSearchQuery,
} = GlobalSearch;
