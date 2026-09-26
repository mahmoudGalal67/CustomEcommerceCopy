// src/services/PagesApi.ts
import { baseApi } from "./baseApi";

export const PopupCampaignpi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        showPopupCampaign: builder.query({
            query: () => ({ url: `/popup-campaigns`, method: "GET" }),
            providesTags: ["PopupCampaign"],
        }),
    }),
});

export const {
    useShowPopupCampaignQuery,
} = PopupCampaignpi;
