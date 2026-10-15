// src/services/cartApi.ts
import { baseApi } from "./baseApi";
import { ChatMessage } from "@/types/types";

export const ChatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.mutation<ChatMessage[], { guest_token: string }>({
      query: (data) => ({
        url: "/chat/messages",
        body: data,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    sendMssage: builder.mutation<
      unknown,
      { message: string; guest_token: string }
    >({
      query: (data) => ({
        url: "/chat/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    markMessageIsread: builder.mutation<unknown, { message_id: number }>({
      query: (data) => ({
        url: "/chat/markMessageIsread",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    markALLMessagesIsreadForUser: builder.mutation<
      unknown,
      { chat_id: number | null }
    >({
      query: (data) => ({
        url: "/chat/markALLMessagesIsreadForUser",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    mergeChat: builder.mutation<unknown, { guest_token: string }>({
      query: (data) => ({
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
