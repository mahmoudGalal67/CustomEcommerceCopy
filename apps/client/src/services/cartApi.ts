// src/services/cartApi.ts
import { baseApi } from "./baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToUserCart: builder.mutation({
      query: (data) => ({
        url: "/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // 1️⃣ Optimistically update cache
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = draft.items.filter(
              (item: any) => item.id !== id
            );
          })
        );

        try {
          // 2️⃣ Wait for server response
          await queryFulfilled;
        } catch {
          // 3️⃣ Rollback if request fails
          patchResult.undo();
        }
      },
    }),
    mergeCart: builder.mutation({
      query: () => ({
        url: "/cart/merge",
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToUserCartMutation,
  useRemoveFromCartMutation,
  useMergeCartMutation,
} = cartApi;
