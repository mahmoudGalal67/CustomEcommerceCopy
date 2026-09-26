// src/services/orderApi.ts
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 SELLER ORDERS WITH SEARCH & FILTERS
    getOrders: builder.query<any, { search?: string; status?: string }>({
      query: ({ search, status }) => ({
        url: "/orders/all",
        params: { search, status },
      }),
      providesTags: ["Orders"],
    }),
    getSellerOrders: builder.query<any, { search?: string; status?: string }>({
      query: ({ search, status }) => ({
        url: "/orders/seller",
        params: { search, status },
      }),
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query<any, number>({
      query: (id) => `/orders/order/${id}`,
    }),

    // 🔹 UPDATE ORDER STATUS WITH OPTIMISTIC UPDATE
    updateOrderStatus: builder.mutation<
      { message: string },
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/update-status/${id}`,
        method: "POST",
        body: { status },
      }),

      async onQueryStarted(
        { id, status },
        { dispatch, getState, queryFulfilled },
      ) {
        // 1️⃣ Optimistic patch (visible data)
        const cachedQueries = orderApi.util.selectInvalidatedBy(getState(), [
          { type: "Orders" },
        ]);

        const patches = cachedQueries.map(({ endpointName, originalArgs }) => {
          if (endpointName !== "getOrders") return null;

          return dispatch(
            orderApi.util.updateQueryData(
              "getOrders",
              originalArgs as any,
              (draft: any) => {
                const order = draft.data.find((o: any) => o.id === id);
                if (!order) return;

                order.status = status;

                // remove if filter no longer matches
                // if (
                //     originalArgs?.status &&
                //     originalArgs.status !== "undefined" &&
                //     originalArgs.status !== status
                // ) {
                //     draft.data = draft.data.filter((o: any) => o.id !== id);
                // }
              },
            ),
          );
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p?.undo());
          return;
        }

        // 🔥 2️⃣ FORCE SERVER TRUTH
        dispatch(orderApi.util.invalidateTags(["Orders"]));
      },
    }),

    // 🔴 DELETE MULTI ROWS
    deleteOrders: builder.mutation<
      { message: string },
      {
        ids: string[];
        search?: string;
        status?: string;
      }
    >({
      query: ({ ids }) => ({
        url: "/orders/cancel-seller",
        method: "POST",
        body: { ids },
      }),

      async onQueryStarted(
        { ids, search = "", status = "undefined" },
        { dispatch, queryFulfilled },
      ) {
        const numericIds = ids.map(Number);

        const patchResult = dispatch(
          orderApi.util.updateQueryData(
            "getOrders",
            { search, status },
            (draft: any) => {
              draft.data = draft.data.filter(
                (order: any) => !numericIds.includes(order.id),
              );
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // 🔄 rollback on failure
        }
      },
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetSellerOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrdersMutation,
} = orderApi;
