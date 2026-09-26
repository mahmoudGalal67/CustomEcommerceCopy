
// src/services/cartApi.ts
import { baseApi } from "./baseApi";

export const UserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
            getUser: builder.query({
            query: () => ({
                url: "/user",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ data}) => ({
                url: `/users/profileUpdate`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["User"],

        }),
    }),
});

    export const {
    useGetUserQuery,
    useUpdateUserMutation,

} = UserApi;
