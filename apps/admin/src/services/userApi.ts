// src/services/orderApi.ts
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<any, { search?: string; role?: string }>({
            query: ({ search, role }) => ({
                url: "/users",
                params: { search, role },
            }),
            providesTags: ["Users"],
        }),

        getUserById: builder.query<any, number>({
            query: (id) => `/users/${id}`,
        }),
        createUser: builder.mutation<any, any>({
            query: (data) => ({
                url: `/users`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),
        updateUser: builder.mutation<any, any>({
            query: (data) => ({
                url: `/users/${data.id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // 🔹 UPDATE ORDER STATUS WITH OPTIMISTIC UPDATE
        updateUserRole: builder.mutation<
            { message: string },
            { id: number; role: string }
        >({
            query: ({ id, role }) => ({
                url: `/users/update-role/${id}`,
                method: "POST",
                body: { role },
            }),

            async onQueryStarted(
                { id, role },
                { dispatch, getState, queryFulfilled }
            ) {
                // 1️⃣ Optimistic patch (visible data)
                const cachedQueries = userApi.util.selectInvalidatedBy(
                    getState(),
                    [{ type: "Users" }]
                );

                const patches = cachedQueries.map(({ endpointName, originalArgs }) => {
                    if (endpointName !== "getUsers") return null;

                    return dispatch(
                        userApi.util.updateQueryData(
                            "getUsers",
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
                            }
                        )
                    );
                });

                try {
                    await queryFulfilled;
                } catch {
                    patches.forEach((p) => p?.undo());
                    return;
                }

                // 🔥 2️⃣ FORCE SERVER TRUTH
                dispatch(userApi.util.invalidateTags(["Users"]));
            },
        }),


        // 🔴 DELETE MULTI ROWS 
        deleteUsers: builder.mutation<
            { message: string },
            {
                ids: string[];
                search?: string;
                role?: string;
            }
        >({
            query: ({ ids }) => ({
                url: "/users",
                method: "DELETE",
                body: { ids },
            }),
            invalidatesTags: ["Users"],
        }),
    }),

});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useUpdateUserRoleMutation,
    useDeleteUsersMutation,
    useCreateUserMutation,
    useUpdateUserMutation,
} = userApi;
