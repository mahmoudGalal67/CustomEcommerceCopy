// services/colorApi.ts
import { baseApi } from "./baseApi";

export const AnalyticSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformRevenue: builder.query({
      query: (period = "30d") =>
        `/admin/analytics?period=${period}`,
    }),

    getSellerRevenue: builder.query({
      query: (period = "30d") =>
        `/seller/analytics/revenue?period=${period}`,
    }),

    getRevenueBySeller: builder.query({
      query: () =>
        "/admin/analytics/revenue/sellers",
    }),
  }),
});

export const {
  useGetPlatformRevenueQuery,
  useGetSellerRevenueQuery,
  useGetRevenueBySellerQuery,
} = AnalyticSlice;
