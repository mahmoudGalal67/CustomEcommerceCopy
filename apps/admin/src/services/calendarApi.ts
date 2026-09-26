// services/calendarApi.ts

import { baseApi } from "./baseApi";

export interface CalendarEvent {
  id: number | string;
  title: string;
  start: string;
  end: string;
  color?: string;
  [key: string]: any;
}

export interface CreateEventData {
  title: string;
  start: string | Date;
  end: string | Date;
  color?: string;
  [key: string]: any;
}

export interface UpdateEventData {
  id: number | string;
  start?: string | Date | null;
  end?: string | Date | null;
  title?: string;
  color?: string;
  [key: string]: any;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<CalendarEvent[], void>({
      query: () => "/events",
      providesTags: ["Events"],
    }),

    createEvent: builder.mutation<CalendarEvent, CreateEventData>({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Events"],
    }),

    updateEvent: builder.mutation<CalendarEvent, UpdateEventData>({
      query: ({ id, ...body }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body,
      }),

      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          calendarApi.util.updateQueryData("getEvents", undefined, (draft) => {
            const event = draft.find((e) => e.id == id);

            if (event) {
              Object.assign(event, patch);
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteEvent: builder.mutation<void, number | string>({
      query: (id) => ({
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
