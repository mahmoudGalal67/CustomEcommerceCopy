// services/colorApi.ts
import { baseApi } from "./baseApi";

export const FeaturesSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Features
        getFeatures: builder.query<any, any>({
            query: () => "/features",
            providesTags: ["Features"],
        }),



        // 🔹 UPDATE Features 
        updateFeatures: builder.mutation<any, any>({
            query: (data) => ({
                url: '/features',
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Features"],
        }),


    }),
});

export const {
    useGetFeaturesQuery,
    useUpdateFeaturesMutation,
} = FeaturesSlice;
