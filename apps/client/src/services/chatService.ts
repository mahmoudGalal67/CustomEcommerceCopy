
// src/services/cartApi.ts
import { baseApi } from "./baseApi";

export const ChatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.mutation({
            query: (data: any) => ({
                url: '/chat/messages',
                body: data,
                method: "POST",
            }),
            invalidatesTags: ["Chat"],

        }),
        sendMssage: builder.mutation({
            query: (data: any) => ({
                url: "/chat/send",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        markMessageIsread: builder.mutation({
            query: (data: any) => ({
                url: "/chat/markMessageIsread",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        markALLMessagesIsreadForUser: builder.mutation({
            query: (data: any) => ({
                url: "/chat/markALLMessagesIsreadForUser",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        mergeChat: builder.mutation({
            query: (data: any) => ({
                url: "/chat/merge",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
    }),
});

export const {
    useGetMessagesMutation,
    useSendMssageMutation,
    useMarkALLMessagesIsreadForUserMutation,
    useMarkMessageIsreadMutation,
    useMergeChatMutation,
} = ChatApi;
