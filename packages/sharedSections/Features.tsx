"use client";

import { ShieldCheck, Truck, Gift, Lock } from "lucide-react";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface Feature {
  id: string;
  title: LocalizedText | string;
  description: LocalizedText | string;
  icon: string;
}

interface FeaturesProps {
  heading?: LocalizedText | string;
  title1?: LocalizedText | string;
  title2?: LocalizedText | string;
  features?: Feature[];
  locale?: string;
}

const iconMap = {
  shield: ShieldCheck,
  truck: Truck,
  gift: Gift,
  lock: Lock,
} as const;

export default function Features({
  heading,
  title1,
  title2,
  features = [],
  locale = "en",
}: FeaturesProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined) => {
    if (!value) return "";

    // Backward compatibility with old CMS data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      {/* ======================================================== */}
      {/* HEADER */}
      {/* ======================================================== */}

      <div className="mb-5 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {t(heading)}
        </p>

        <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {t(title1)}

          <br />

          <span className="text-muted-foreground">{t(title2)}</span>
        </h2>
      </div>

      {/* ======================================================== */}
      {/* FEATURES */}
      {/* ======================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon =
            iconMap[feature.icon as keyof typeof iconMap] ?? ShieldCheck;

          return (
            <div
              key={feature.id}
              className="group rounded-2xl border border-border/50 bg-card/30 p-5 transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-display text-base font-semibold">
                {t(feature.title)}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {t(feature.description)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
