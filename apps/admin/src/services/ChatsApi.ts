// services/colorApi.ts
import { baseApi } from "./baseApi";

export const ChatsAdminSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // 🔹 GET Chats
        getChats: builder.query<any, { search?: string; status?: string }>({
            query: ({ search, status }) =>
            ({
                url: "/admin/support/chats",
                params: { search, status }
            }),
            providesTags: ["Chats"],
        }),

        // 🔹 GET Chat (BY ID)
        getChat: builder.query<any, any>({
            query: ({ id }) => ({
                url: `/admin/support/messages/${id}`,
            }),
        }),
        getunreadStats: builder.query<any, any>({
            query: () => ({
                url: '/admin/support/unreadStats',
            }),
        }),
        // 🔹 ADD Chat (OPTIMISTIC)
        sendAdminMessage: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/support/send",
                method: "POST",
                body: data,
            }),
        }),
        markALLMessagesIsreadForAdmin: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/support/markALLMessagesIsreadForAdmin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chats"],

        }),
         markMessageIsread: builder.mutation({
            query: (data: any) => ({
                url: "/chat/markMessageIsread",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chats"],
        }),
        closeChatChat: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/support/closeChat",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chats"],

        }),
        openChat: builder.mutation<any, any>({
            query: (data) => ({
                url: "/admin/support/openChat",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chats"],

        }),

        // 🔹 DELETE Chat (OPTIMISTIC)
        deleteChat: builder.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/colors/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetunreadStatsQuery,
    useSendAdminMessageMutation,
    useMarkALLMessagesIsreadForAdminMutation,
    useMarkMessageIsreadMutation,
    useGetChatQuery,    
    useDeleteChatMutation,
    useCloseChatChatMutation,
    useOpenChatMutation
} = ChatsAdminSlice;
