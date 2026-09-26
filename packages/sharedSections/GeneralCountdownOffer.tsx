"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

interface LocalizedText {
  en?: string;
  ar?: string;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface GeneralCountdownOffersProps {
  badge?: LocalizedText | string;

  titleBefore?: LocalizedText | string;
  titleHighlight?: LocalizedText | string;
  titleAfter?: LocalizedText | string;

  description?: LocalizedText | string;

  primaryButton?: {
    text?: LocalizedText | string;
    href?: string;
  };

  secondaryButton?: {
    text?: LocalizedText | string;
  };

  countdown?: {
    endDate?: string;
  };

  locale?: string;
}

function calculateTimeLeft(endDate?: string): TimeLeft {
  if (!endDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const difference = new Date(endDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function GeneralCountdownOffers({
  badge,
  titleBefore,
  titleHighlight,
  titleAfter,
  description,
  primaryButton,
  secondaryButton,
  countdown,
  locale = "en",
}: GeneralCountdownOffersProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined) => {
    if (!value) return "";

    // Backward compatibility
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  const endDate = countdown?.endDate;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(endDate),
  );

  useEffect(() => {
    if (!endDate) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const countdownItems = [
    {
      id: "days",
      value: timeLeft.days,
      label: lang === "ar" ? "يوم" : "Days",
    },
    {
      id: "hours",
      value: timeLeft.hours,
      label: lang === "ar" ? "ساعات" : "Hrs",
    },
    {
      id: "minutes",
      value: timeLeft.minutes,
      label: lang === "ar" ? "دقائق" : "Min",
    },
    {
      id: "seconds",
      value: timeLeft.seconds,
      label: lang === "ar" ? "ثوانٍ" : "Sec",
    },
  ];

  return (
    <section
      id="sale"
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className="mx-auto px-4 py-8 sm:px-6 lg:px-8"
    >
      <div
        className={`${locale == "ar" ? "from-primary/10 via-zinc-900 to-zinc-900" : "from-zinc-900 via-zinc-900 to-primary/10"}relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-tl  p-8 sm:p-12 lg:p-16`}
      >
        {/* Glow accents */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-chart-2/15 blur-[100px]" />

        <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" />

        <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* ====================================================== */}
          {/* CONTENT */}
          {/* ====================================================== */}

          <div className="max-w-lg">
            {/* Badge */}
            <div
              className={`${locale == "ar" ? "text-white" : "text-primary"} inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium `}
            >
              <Clock className="h-3.5 w-3.5" />

              {t(badge)}
            </div>

            {/* Title */}
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {t(titleBefore)}{" "}
              <span className="bg-gradient-to-r from-primary to-popover bg-clip-text text-transparent">
                {t(titleHighlight)}
              </span>{" "}
              {t(titleAfter)}
            </h2>

            {/* Description */}
            <p className="mt-3 text-white">{t(description)}</p>

            {/* Buttons */}
            <div
              className={`mt-6 flex flex-wrap gap-3 ${
                locale === "ar" ? "flex-row-reverse justify-end" : ""
              }`}
            >
              {/* Primary */}
              <Button
                size="lg"
                asChild
                className="group gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <a href={primaryButton?.href ?? "#sale"}>
                  {t(primaryButton?.text) ||
                    (locale === "ar" ? "تسوق التخفيضات" : "Shop The Sale")}

                  <ArrowRight
                    className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                      locale === "ar" ? "rotate-180" : ""
                    }`}
                  />
                </a>
              </Button>

              {/* Secondary */}
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-border/60 px-7 text-base font-semibold hover:border-primary/50"
              >
                {t(secondaryButton?.text)}
              </Button>
            </div>
          </div>

          {/* ====================================================== */}
          {/* COUNTDOWN */}
          {/* ====================================================== */}

          <div className="grid grid-cols-4 gap-3">
            {countdownItems.map((time) => (
              <div
                key={time.id}
                className="flex flex-col items-center rounded-2xl border border-border/50 bg-background/50 px-3 py-4 backdrop-blur-md sm:px-5"
              >
                <span className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
                  {String(time.value).padStart(2, "0")}
                </span>

                <span className="mt-1 text-[10px] uppercase tracking-wider text-white">
                  {time.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
