// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const PopupCampaignpi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        showPopupCampaign: builder.query({
            query: () => ({ url: `/popup-campaigns`, method: "GET" }),
            providesTags: ["PopupCampaign"],
        }),

        updatePopupCampaign: builder.mutation({
            query: (formData) => ({
                url: `/popup-campaigns`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["PopupCampaign"],
        }),

    }),
});

export const {
    useShowPopupCampaignQuery,
    useUpdatePopupCampaignMutation,
} = PopupCampaignpi;
