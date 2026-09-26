// services/apiSlice.js
import { categoryType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const categorySlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getCategories: builder.query<any, { search?: string }>({
      query: ({ search }) => `/categories?search=${search}`,
    }),

    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
    }),
    getCategoryById: builder.query<any, number>({
      query: (id) => `/categories/${id}`,
    }),
    me: builder.query({
      query: () => "/user",
    }),
    updateCategory: builder.mutation({
      query: ({ id, formData }: { id: number; formData: FormData }) => ({
        url: `/categories/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategories: builder.mutation<
      { message: string },
      {
        ids: string[];
        search?: string;
      }
    >({
      query: ({ ids }) => ({
        url: "/categories",
        method: "DELETE",
        body: { ids },
      }),

      async onQueryStarted(
        { ids, search = "" },
        { dispatch, queryFulfilled }
      ) {
        const numericIds = ids.map(Number);

        const patchResult = dispatch(
          categorySlice.util.updateQueryData(
            "getCategories",
            { search },
            (draft: any) => {
              draft.data = draft.data.filter(
                (user: any) => !numericIds.includes(user.id)
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
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoriesMutation,
  useMeQuery,
  useGetCategoryByIdQuery,
} = categorySlice;
