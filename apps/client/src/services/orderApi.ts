import { baseApi } from "./baseApi";

export const OrderSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET Order
    getOrder: builder.query<any, any>({
      query: (id) => `/orders/order/${id}`,
    }),
  }),
});

export const { useGetOrderQuery } = OrderSlice;
