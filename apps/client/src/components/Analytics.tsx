"use client";

import { useEffect } from "react";

const GA_ID = "G-FNC08KTVQP";
const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

export default function Analytics() {
  useEffect(() => {
    let done = false;
    let timer: number | undefined;

    const load = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, load));

      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);

      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };

    EVENTS.forEach((e) => window.addEventListener(e, load, { passive: true }));
    timer = window.setTimeout(load, 15000); // fallback for visitors who never interact

    return () => {
      window.clearTimeout(timer);
      EVENTS.forEach((e) => window.removeEventListener(e, load));
    };
  }, []);

  return null;
}
