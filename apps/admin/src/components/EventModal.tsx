import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
];



export default function EventModal({
    open,
    onClose,
    event,
    onSave,
}: any) {
    const [title, setTitle] = useState(event?.title || "");
    const [description, setDescription] = useState(
        event?.description || ""
    );


    function formatDateTime(date: any) {
        if (!date) return "";

        const d = new Date(date);

        if (isNaN(d.getTime())) return "";

        return d.toISOString().slice(0, 16);
    }
    const [color, setColor] = useState(
        event?.color || "#3B82F6"
    );
    const [start, setStart] = useState(
        formatDateTime(event?.start)
    );

    const [end, setEnd] = useState(
        formatDateTime(event?.end)
    );

    useEffect(() => {
        setTitle(event?.title || "");
        setDescription(event?.description || "");
        setColor(event?.color || "#3B82F6");

        setStart(formatDateTime(event?.start));
        setEnd(formatDateTime(event?.end));
    }, [event]);

    return (
        <Dialog.Root
            defaultOpen
            onOpenChange={(v) => !v && onClose()}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-primary/50 backdrop-blur-sm z-50" />

                <Dialog.Content
                    className="
            fixed
            top-1/2
            left-1/2
            z-50
            w-[95vw]
            max-w-xl
            -translate-x-1/2
            -translate-y-1/2
            rounded-3xl
            bg-background
            p-6
            shadow-2xl
          "
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-2xl">
                            {event?.id
                                ? "Edit Event"
                                : "Create Event"}
                        </h2>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <input
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Event title"
                            className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
                        />

                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Description"
                            className="
                w-full
                border
                rounded-xl
                p-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
                        />

                        <div>
                            <label className="block mb-2 font-medium">
                                Start
                            </label>

                            <input
                                type="datetime-local"
                                value={start}
                                onChange={(e) =>
                                    setStart(e.target.value)
                                }
                                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                "
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                End
                            </label>

                            <input
                                type="datetime-local"
                                value={end}
                                onChange={(e) =>
                                    setEnd(e.target.value)
                                }
                                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                "
                            />
                        </div>

                        <div>
                            <label className="block mb-3 font-medium">
                                Color
                            </label>

                            <div className="flex gap-3">
                                {COLORS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`
                      w-8 h-8 rounded-full
                      border-4
                      ${color === c
                                                ? "border-black"
                                                : "border-transparent"
                                            }
                    `}
                                        style={{
                                            background: c,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="
                px-5 py-2
                rounded-xl
                border
              "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() =>
                                onSave({
                                    ...event,
                                    title,
                                    description,
                                    color,
                                    start,
                                    end,
                                })
                            }
                            className="
                px-5 py-2
                rounded-xl
                bg-blue-600
                text-white
              "
                        >
                            Save Event
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}