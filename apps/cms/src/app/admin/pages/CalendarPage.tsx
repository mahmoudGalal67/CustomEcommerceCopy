"use client";

import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";

import interactionPlugin from "@fullcalendar/interaction";

import {
    useGetEventsQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
} from "@/services/calendarApi";

import { useState } from "react";

import EventModal from "@/components/EventModal";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarPage() {

    const { data = [] } = useGetEventsQuery(undefined);

    const [createEvent] = useCreateEventMutation();

    const [updateEvent] = useUpdateEventMutation();

    const [selected, setSelected] = useState<any>(null);

    const [open, setOpen] = useState(false);

    return (
        <div className="p-6">

            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                ]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right:
                        "dayGridMonth,timeGridWeek,timeGridDay",
                }}

                initialView="dayGridMonth"

                editable

                selectable

                events={data.map((event: any) => ({
                    id: event.id,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    backgroundColor: event.color,
                    borderColor: event.color,
                    color: "#fff",
                    ...event,
                }))}

                dateClick={(arg) => {
                    setSelected({
                        start: `${arg.dateStr}T09:00`,
                        end: `${arg.dateStr}T10:00`,
                        color: "#3B82F6",
                    });

                    setOpen(true);
                }}
                eventClick={(arg) => {
                    setSelected({
                        id: arg.event.id,
                        title: arg.event.title,
                        start: arg.event.start,
                        end: arg.event.end,
                        ...arg.event.extendedProps,
                    });

                    setOpen(true);
                }}

                eventDrop={(info) => {

                    updateEvent({
                        id: info.event.id,
                        start: info.event.start,
                        end: info.event.end,
                    });
                }}

                eventResize={(info) => {

                    updateEvent({
                        id: info.event.id,
                        start: info.event.start,
                        end: info.event.end,
                    });
                }}
            />

            {open && (
                <EventModal
                    open={open}
                    event={selected}
                    onClose={() => setOpen(false)}
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