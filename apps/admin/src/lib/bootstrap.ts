import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

let echo: any = null;

export const initEcho = () => {
    if (echo) return echo;
    echo = new Echo({
        broadcaster: "pusher",
        key: "6e1aa36499cd7ae769b9",
        cluster: "eu",
        forceTLS: true,
        enabledTransports: ["ws"],
    });

    return echo;
};

export const getEcho = () => echo;