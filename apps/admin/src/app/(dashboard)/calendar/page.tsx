"use client";

import { useEffect, useRef, useState } from "react";

import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
} from "@/services/calendarApi";

import EventModal from "@/components/EventModal";

export default function CalendarClient() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<Calendar | null>(null);

  const { data = [] } = useGetEventsQuery(undefined);

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const [selected, setSelected] = useState<any>(null);
  const [open, setOpen] = useState(false);

  // Initialize FullCalendar
  useEffect(() => {
    if (!calendarRef.current) return;

    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

      initialView: "dayGridMonth",

      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },

      editable: true,
      selectable: true,
      height: "auto",

      dateClick: (arg) => {
        setSelected({
          start: `${arg.dateStr}T09:00`,
          end: `${arg.dateStr}T10:00`,
          color: "#3B82F6",
        });

        setOpen(true);
      },

      eventClick: (arg) => {
        setSelected({
          id: arg.event.id,
          title: arg.event.title,
          start: arg.event.start,
          end: arg.event.end,
          ...arg.event.extendedProps,
        });

        setOpen(true);
      },

      eventDrop: (info) => {
        updateEvent({
          id: info.event.id,
          start: info.event.start,
          end: info.event.end,
        });
      },

      eventResize: (info) => {
        updateEvent({
          id: info.event.id,
          start: info.event.start,
          end: info.event.end,
        });
      },
    });

    calendarInstance.current = calendar;

    calendar.render();

    return () => {
      calendar.destroy();
      calendarInstance.current = null;
    };
  }, [updateEvent]);

  // Update calendar events when API data changes
  useEffect(() => {
    const calendar = calendarInstance.current;

    if (!calendar) return;

    calendar.removeAllEvents();

    calendar.addEventSource(
      data.map((event: any) => ({
        ...event,
        id: String(event.id),
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.color,
        borderColor: event.color,
        textColor: "#fff",
      })),
    );
  }, [data]);

  return (
    <div className="p-6">
      <div ref={calendarRef} />

      {open && (
        <EventModal
          open={open}
          event={selected}
          onClose={() => setOpen(false)}
          isLoading={isCreating || isUpdating}
          onSave={async (values: any) => {
            if (values.id) {
              await updateEvent(values);
            } else {
              await createEvent(values);
            }

            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
