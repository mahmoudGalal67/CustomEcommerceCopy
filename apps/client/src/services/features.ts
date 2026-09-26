// services/colorApi.ts
import { baseApi } from "./baseApi";

export const FeaturesSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET Features
    getFeatures: builder.query<any, any>({
      query: () => "/features",
      providesTags: ["Features"],
    }),
  }),
});

export const { useGetFeaturesQuery } = FeaturesSlice;
