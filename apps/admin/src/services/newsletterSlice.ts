import { baseApi } from "./baseApi";

export type NewsletterSubscriberStatus = "subscribed" | "unsubscribed";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  status: NewsletterSubscriberStatus;
  subscribed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscribersResponse {
  current_page: number;
  data: NewsletterSubscriber[];

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

export interface GetNewsletterSubscribersParams {
  search?: string;
  status?: NewsletterSubscriberStatus;
  page?: number;
  per_page?: number;
}

export const NewsletterSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsletterSubscribers: builder.query<
      NewsletterSubscribersResponse,
      GetNewsletterSubscribersParams
    >({
      query: ({ search = "", status, page = 1, per_page = 15 }) => ({
        url: "/admin/newsletter/subscribers",
        params: {
          search: search || undefined,
          status: status || undefined,
          page,
          per_page,
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.data.map((subscriber) => ({
                type: "NewsletterSubscribers" as const,
                id: subscriber.id,
              })),
              {
                type: "NewsletterSubscribers" as const,
                id: "LIST",
              },
            ]
          : [
              {
                type: "NewsletterSubscribers" as const,
                id: "LIST",
              },
            ],
    }),

    getNewsletterSubscriber: builder.query<NewsletterSubscriber, number>({
      query: (id) => `/admin/newsletter/subscribers/${id}`,

      providesTags: (_result, _error, id) => [
        {
          type: "NewsletterSubscribers",
          id,
        },
      ],
    }),

    updateNewsletterSubscriber: builder.mutation<
      {
        message: string;
        data: NewsletterSubscriber;
      },
      {
        id: number;
        status: NewsletterSubscriberStatus;
      }
    >({
      query: ({ id, status }) => ({
        url: `/admin/newsletter/subscribers/${id}`,
        method: "PATCH",
        body: {
          status,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: "NewsletterSubscribers",
          id,
        },
        {
          type: "NewsletterSubscribers",
          id: "LIST",
        },
      ],
    }),

    deleteNewsletterSubscriber: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/newsletter/subscribers/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: "NewsletterSubscribers",
          id,
        },
        {
          type: "NewsletterSubscribers",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetNewsletterSubscribersQuery,
  useGetNewsletterSubscriberQuery,
  useUpdateNewsletterSubscriberMutation,
  useDeleteNewsletterSubscriberMutation,
} = NewsletterSlice;
