import { sizeType } from "../types/types";
import { baseApi } from "./baseApi";

// Step 1: Create API slice
export const SizeSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Step 2: Define endpoints
    getSizes: builder.query<sizeType[], void>({
      query: () => "/sizes",
    }),

    addSize: builder.mutation({
      query: (newSize) => ({
        url: "/sizes",
        method: "POST",
        body: newSize,
      }),
      async onQueryStarted(newSize, { dispatch, queryFulfilled }) {
        const tempId = Date.now();

        // 1️⃣ Optimistic update
        const patchResult = dispatch(
          SizeSlice.util.updateQueryData("getSizes", undefined, (draft) => {
            draft.unshift({
              ...newSize,
              id: tempId,
            });
          })
        );

        try {
          const { data } = await queryFulfilled;
          // 2️⃣ Replace temp item with real one
          dispatch(
            SizeSlice.util.updateQueryData("getSizes", undefined, (draft) => {
              const index = draft.findIndex((S: any) => S.id === tempId);
              if (index !== -1) {
                draft[index] = { ...data.Size };
              }
            })
          );
        } catch {
          patchResult.undo(); // rollback if API fails
        }
      }
    }),
    updateSize: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/sizes/${id}`,
        method: "PUT",
        body: rest,
      }),
      async onQueryStarted(updatedSize, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          SizeSlice.util.updateQueryData("getSizes", undefined, (draft) => {
            const size = draft.find((c: any) => c.id === updatedSize.id);
            if (size) {
              size.name = updatedSize.name;
              size.code = updatedSize.code;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          SizeSlice.util.updateQueryData("getSizes", undefined, (draft) => {
            return draft.filter((size: any) => size.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// Step 3: Export hooks for components
export const {
  useGetSizesQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = SizeSlice;
