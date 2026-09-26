import { baseApi } from "./baseApi";

export type ContactMessageStatus = "new" | "read" | "replied" | "closed";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  admin_notes: string | null;
  read_at: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessagesResponse {
  current_page: number;
  data: ContactMessage[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface GetContactMessagesParams {
  search?: string;
  status?: ContactMessageStatus;
  page?: number;
  per_page?: number;
}

export const ContactSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all contact messages
    getContactMessages: builder.query<
      ContactMessagesResponse,
      GetContactMessagesParams | void
    >({
      query: (params) => ({
        url: "/admin/contact-messages",
        method: "GET",
        params,
      }),
      providesTags: ["ContactMessages"],
    }),

    // Get single message
    getContactMessage: builder.query<ContactMessage, number>({
      query: (id) => `/admin/contact-messages/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ContactMessages", id }],
    }),

    // Update message
    updateContactMessage: builder.mutation<
      {
        message: string;
        data: ContactMessage;
      },
      {
        id: number;
        status?: ContactMessageStatus;
        admin_notes?: string | null;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/admin/contact-messages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ContactMessages"],
    }),

    // Delete message
    deleteContactMessage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/contact-messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ContactMessages"],
    }),
    sendContactReply: builder.mutation<
      {
        message: string;
        data: ContactMessage;
      },
      {
        id: number;
        message: string;
      }
    >({
      query: ({ id, message }) => ({
        url: `/admin/contact-messages/${id}/reply`,
        method: "POST",
        body: {
          message,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        "ContactMessages",
        {
          type: "ContactMessages",
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useGetContactMessageQuery,
  useUpdateContactMessageMutation,
  useDeleteContactMessageMutation,
  useSendContactReplyMutation,
} = ContactSlice;
