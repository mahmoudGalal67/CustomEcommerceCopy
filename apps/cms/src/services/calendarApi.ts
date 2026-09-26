// services/calendarApi.ts

import { baseApi } from "./baseApi";


export const calendarApi = baseApi.injectEndpoints({
    endpoints: (builder: any) => ({
        getEvents: builder.query({
            query: () => "/events",
            providesTags: ["Events"],
        }),

        createEvent: builder.mutation({
            query: (body: any) => ({
                url: "/events",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Events"],
        }),
        updateEvent: builder.mutation({
            query: ({ id, ...body }: any) => ({
                url: `/events/${id}`,
                method: "PUT",
                body,
            }),

            async onQueryStarted(
                { id, ...patch }: any,
                { dispatch, queryFulfilled }: any
            ) {
                const patchResult = dispatch(
                    calendarApi.util.updateQueryData(
                        "getEvents",
                        undefined,
                        (draft: any) => {
                            const event = draft.find(
                                (e: any) => e.id == id
                            );

                            if (event) {
                                Object.assign(event, patch);
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),

        deleteEvent: builder.mutation({
            query: (id: any) => ({
                url: `/events/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Events"],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = calendarApi;