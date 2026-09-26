'use client'

import { useEffect, useState } from "react";

export default function PopupCampaign({ data, apiUrl }: any) {
    const [open, setOpen] = useState(false);



    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, data.delay_seconds * 1000);

        return () => clearTimeout(timer);

    }, [data]);

    if (!data?.enabled || !open) return null;
    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
                className="
                    relative
                    w-[95%]
                    max-w-4xl
                    overflow-hidden
                    rounded-3xl
                    bg-white
                    shadow-2xl
                "
            >
                <button
                    onClick={() => setOpen(false)}
                    className="
                        absolute right-5 top-5
                        z-20
                        h-10 w-10
                        rounded-full
                        bg-black/10
                        text-lg
                        cursor-pointer
                    "
                >
                    ✕
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Image */}
                    <div className="h-[500px]">
                        <img
                            src={
                                data.image
                                    ? `${apiUrl}/storage/${data.image}`
                                    : "/offer.png"
                            }
                            alt={data.title}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-10">
                        <span
                            className="
                                mb-4
                                w-fit
                                rounded-full
                                bg-red-100
                                px-4
                                py-1
                                text-sm
                                font-medium
                                text-red-600
                            "
                        >
                            Limited Time Offer
                        </span>

                        <h2
                            className="
                                text-4xl
                                font-bold
                                leading-tight
                                text-zinc-900
                            "
                        >
                            {data.title}
                        </h2>

                        <p className="mt-5 text-zinc-600">
                            {data.description}
                        </p>


                        <a
                            href={data.button_link}
                            className="
                                    mt-8
                                    inline-block
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-indigo-600
                                    px-8
                                    py-4
                                    font-semibold
                                    text-white
                                    shadow-lg
                                    text-center
                                "
                        >
                            {data.button_text || "Shop Now"}
                        </a>


                        <p className="mt-4 text-xs text-zinc-400">
                            Offer ends at {data.ends_at || "July 30, 2026"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}