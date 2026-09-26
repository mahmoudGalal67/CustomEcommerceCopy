import { baseApi } from "./baseApi";

export interface NewsletterResponse {
  message: string;
  data?: {
    id: number;
    email: string;
    status: "subscribed" | "unsubscribed";
    subscribed_at: string | null;
    unsubscribed_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export const NewsletterSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<
      NewsletterResponse,
      { email: string }
    >({
      query: (data) => ({
        url: "/newsletter/subscribe",
        method: "POST",
        body: data,
      }),
    }),

    unsubscribeNewsletter: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "/newsletter/unsubscribe",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useUnsubscribeNewsletterMutation,
} = NewsletterSlice;
