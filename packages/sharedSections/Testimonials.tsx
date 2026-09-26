"use client";

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface Testimonial {
  id: string;

  name: LocalizedText | string;

  handle: string;

  avatar: string;

  role: LocalizedText | string;

  rating: number;

  text: LocalizedText | string;
}

interface TestimonialsData {
  heading: LocalizedText | string;

  title1: LocalizedText | string;

  title2: LocalizedText | string;

  testimonials: Testimonial[];
}

interface TestimonialsProps {
  testimonialsData: TestimonialsData;

  locale?: string;
}

export default function Testimonials({
  testimonialsData,
  locale = "en",
}: TestimonialsProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined): string => {
    if (!value) return "";

    // Backward compatibility with old data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      {/* Heading */}
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {t(testimonialsData.heading)}
        </p>

        <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t(testimonialsData.title1)}
          <br />

          <span className="text-muted-foreground">
            {t(testimonialsData.title2)}
          </span>
        </h2>
      </div>

      {/* Testimonials */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonialsData.testimonials.map((testimonial, i) => (
          <div
            key={testimonial.id}
            className={cn(
              "group relative flex flex-col rounded-3xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card/60",
              i % 2 === 1 && "sm:translate-y-6",
            )}
          >
            {/* Quote */}
            <Quote className="h-8 w-8 text-primary/30" />

            {/* Rating */}
            <div className="mt-3 flex items-center gap-0.5">
              {[...Array(testimonial.rating)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>

            {/* Review */}
            <p
              className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              &ldquo;{t(testimonial.text)}&rdquo;
            </p>

            {/* User */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-chart-2/20 font-display text-sm font-bold text-foreground">
                {testimonial.avatar}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold">{t(testimonial.name)}</p>

                <p dir="ltr" className="text-xs text-muted-foreground">
                  {testimonial.handle}
                </p>
              </div>
            </div>

            {/* Role */}
            <span className="mt-3 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
              {t(testimonial.role)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
