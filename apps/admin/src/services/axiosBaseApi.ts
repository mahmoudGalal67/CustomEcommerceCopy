import axios from "axios";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const axiosBaseQuery =
    ({ baseUrl }: { baseUrl: string }): BaseQueryFn =>
        async ({ url, method, data, onUploadProgress }) => {
            try {
                const result = await axios({
                    url: baseUrl + url,
                    method,
                    data,
                    onUploadProgress, // 👈 THIS is the magic
                });

                return { data: result.data };
            } catch (error: any) {
                return {
                    error: {
                        status: error.response?.status,
                        data: error.response?.data,
                    },
                };
            }
        };


export const api = createApi({
    reducerPath: "axiosApi",
    baseQuery: axiosBaseQuery({
        baseUrl: "http://127.0.0.1:8000/api",
    }),
    tagTypes: ["Users"],
    endpoints: () => ({}),
});