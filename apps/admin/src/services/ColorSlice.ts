// services/colorApi.ts
import { baseApi } from "./baseApi";
import { colorType } from "../types/types";

export const ColorSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 GET COLORS
    getColors: builder.query<any, void>({
      query: () => "/colors",
      providesTags: ["Colors"],
    }),

    // 🔹 ADD COLOR (OPTIMISTIC)
    addColor: builder.mutation<any, any>({
      query: (newColor) => ({
        url: "/colors",
        method: "POST",
        body: newColor,
      }),

      async onQueryStarted(newColor, { dispatch, queryFulfilled }) {
        const tempId = Date.now();

        // 1️⃣ Optimistic update
        const patchResult = dispatch(
          ColorSlice.util.updateQueryData("getColors", undefined, (draft) => {
            draft.unshift({
              ...newColor,
              id: tempId,
            });
          })
        );

        try {
          const { data } = await queryFulfilled;
          // 2️⃣ Replace temp item with real one
          dispatch(
            ColorSlice.util.updateQueryData("getColors", undefined, (draft) => {
              const index = draft.findIndex((c: any) => c.id === tempId);
              if (index !== -1) {
                draft[index] = { ...data.Color };
              }
            })
          );
        } catch {
          patchResult.undo(); // rollback if API fails
        }
      }
    }),

    // 🔹 UPDATE COLOR (OPTIMISTIC)
    updateColor: builder.mutation<colorType, colorType>({
      query: ({ id, ...rest }) => ({
        url: `/colors/${id}`,
        method: "PUT",
        body: rest,
      }),

      async onQueryStarted(updatedColor, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ColorSlice.util.updateQueryData("getColors", undefined, (draft) => {
            const color = draft.find((c: any) => c.id === updatedColor.id);
            if (color) {
              color.name = updatedColor.name;
              color.hex = updatedColor.hex;
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

    // 🔹 DELETE COLOR (OPTIMISTIC)
    deleteColor: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/colors/${id}`,
        method: "DELETE",
      }),

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          ColorSlice.util.updateQueryData("getColors", undefined, (draft) => {
            return draft.filter((color: any) => color.id !== id);
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

export const {
  useGetColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = ColorSlice;
