import { baseApi } from "./baseApi";

export const ContactSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔹 Send Contact Message
    sendContactMessage: builder.mutation<any, any>({
      query: (data) => ({
        url: "/contactForm",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = ContactSlice;
