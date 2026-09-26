// services/apiSlice.js
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const ProductSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getProducts: builder.query<any, { search?: string; category?: string }>({
      query: ({ search, category }) => ({
        url: "/products/dashboard/adminSeller",
        params: { search, category },
      }),
      providesTags: ["Products"],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
      }),
      providesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    // 🔴 DELETE MULTI ROWS 
    deleteProducts: builder.mutation<
      { message: string },
      {
        ids: string[];
        search?: string;
        category?: string;
      }
    >({
      query: ({ ids }) => ({
        url: "/products/",
        method: "Delete",
        body: { ids },
      }),

      async onQueryStarted(
        { ids, search = "", category = "undefined" },
        { dispatch, queryFulfilled }
      ) {
        const numericIds = ids.map(Number);

        const patchResult = dispatch(
          ProductSlice.util.updateQueryData(
            "getProducts",
            { search, category },
            (draft: any) => {
              draft.data = draft.data.filter(
                (product: any) => !numericIds.includes(product.id)
              );
            }
          )
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

// Step 3: Export hooks for components
export const {
  useGetProductsQuery,
  useAddProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductsMutation,
} = ProductSlice;
