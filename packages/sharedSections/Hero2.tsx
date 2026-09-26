"use client";

import { ArrowRight, Sparkles, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

interface LocalizedText {
  en: string;
  ar: string;
}

export default function Hero2({
  badge,
  titleLine1,
  titleHighlight,
  titleLine3,
  description,
  primaryButton,
  secondaryButton,
  stats,
  featuredProduct,
  miniProduct,
  reviews,
  shipping,
  apiUrl,
  featuredProductContent,
  miniProductContent,
  locale,
}: any) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined) => {
    if (!value) return "";

    // Backward compatibility with old CMS data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  const FeaturedImageUrl =
    typeof featuredProduct.image === "string" &&
    featuredProduct.image.startsWith("http")
      ? featuredProduct.image
      : `${apiUrl}${featuredProduct.image ?? ""}`;

  const MiniImageUrl =
    typeof miniProduct.image === "string" &&
    miniProduct.image.startsWith("http")
      ? miniProduct.image
      : `${apiUrl}${miniProduct.image ?? ""}`;

  return (
    <section className=" relative  overflow-hidden pt-28 sm:pt-32">
      <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="hero-constellation pointer-events-none absolute inset-0" />
          {/* ====================================================== */}
          {/* LEFT */}
          {/* ====================================================== */}

          <div
            className={`${
              locale === "ar"
                ? "animate-fade-up text-center lg:text-right"
                : "animate-fade-up text-center lg:text-left"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />

              {t(badge)}
            </div>

            {/* Title */}
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl">
              {t(titleLine1)}

              <br />

              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
                  {t(titleHighlight)}
                </span>

                <span className="absolute -bottom-1 left-0 right-0 h-3 -rotate-1 bg-primary/30 blur-sm" />
              </span>

              <br />

              {t(titleLine3)}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-md text-balance text-lg text-muted-foreground lg:mx-0">
              {t(description)}
            </p>

            {/* Buttons */}
            <div
              className={`${
                locale === "ar"
                  ? "sm:flex-row-reverse lg:justify-end"
                  : "lg:justify-start"
              } mt-8 flex flex-col items-center gap-3 sm:flex-row `}
            >
              <Button
                size="lg"
                className={`${
                  locale === "ar" ? "" : ""
                }group h-12 gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground hover:bg-primary/90`}
                asChild
              >
                <a href={primaryButton.href}>
                  {t(primaryButton.text)}

                  <ArrowRight
                    className={`${
                      locale === "ar" ? "transform rotate-180" : ""
                    } h-4 w-4 transition-transform group-hover:translate-x-1`}
                  />
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full border-border/60 px-7 text-base font-semibold hover:border-primary/50 hover:bg-secondary"
                asChild
              >
                <a href={secondaryButton.href}>{t(secondaryButton.text)}</a>
              </Button>
            </div>

            {/* ================================================== */}
            {/* STATS */}
            {/* ================================================== */}

            <div className="mt-10 flex items-center justify-center gap-8 lg:justify-start">
              {stats.map((stat: any) => (
                <div key={stat.id} className="text-center lg:text-left">
                  <p className="font-display text-2xl font-bold">
                    {t(stat.value)}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {t(stat.label)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================== */}
          {/* RIGHT */}
          {/* ====================================================== */}

          <div className="relative hidden h-[34rem] animate-fade-up lg:block [animation-delay:150ms]">
            {/* ================================================== */}
            {/* MAIN FEATURED CARD */}
            {/* ================================================== */}

            <div className="absolute right-0 top-8 h-[26rem] w-[22rem] animate-float overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-lime-400/30 via-emerald-500/15 to-zinc-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div
                className={`${
                  locale === "ar"
                    ? "absolute -left-12 -top-12"
                    : "absolute -right-12 -top-12"
                } h-48 w-48 rounded-full bg-primary/40 blur-3xl`}
              />

              <div className="absolute inset-0 bg-noise opacity-[0.05]" />

              {/* Featured badge */}
              <div className="flex h-full items-center justify-center">
                {featuredProductContent ? (
                  featuredProductContent
                ) : featuredProduct.image ? (
                  <img
                    src={FeaturedImageUrl}
                    alt={String(t(featuredProduct.name))}
                    className="h-full w-full rounded-xl object-cover drop-shadow-2xl"
                  />
                ) : (
                  <span className="font-display text-[10rem] font-bold leading-none tracking-tighter text-white/90 drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)]">
                    {t(featuredProduct.fallbackText)}
                  </span>
                )}
              </div>

              {/* Product information */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-background/60 px-4 py-3 backdrop-blur-md">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(featuredProduct.brand)}
                  </p>

                  <p className="font-display text-sm font-semibold">
                    {t(featuredProduct.name)}
                  </p>
                </div>

                <span className="font-display text-lg font-bold text-primary">
                  {t(featuredProduct.price)}
                </span>
              </div>
            </div>

            {/* ================================================== */}
            {/* MINI PRODUCT */}
            {/* ================================================== */}

            <div className="absolute left-0 top-0 h-32 w-44 animate-float rounded-2xl border border-border/50 bg-gradient-to-br from-sky-500/30 via-blue-600/15 to-zinc-900  shadow-xl [animation-delay:0.5s]">
              <div className="flex h-full items-center justify-center">
                {miniProductContent ? (
                  miniProductContent
                ) : miniProduct.image ? (
                  <img
                    src={MiniImageUrl}
                    alt={String(t(miniProduct.name))}
                    className="h-full w-full rounded-xl object-cover drop-shadow-2xl"
                  />
                ) : (
                  <span className="font-display text-3xl font-bold text-white/90">
                    {t(miniProduct.brand)}
                  </span>
                )}
              </div>

              <div className="absolute -bottom-2 left-3 rounded-full bg-background px-2.5 py-1 text-xs font-semibold shadow-lg">
                {t(miniProduct.name)}
              </div>
            </div>

            {/* ================================================== */}
            {/* REVIEWS */}
            {/* ================================================== */}

            <div className="absolute bottom-8 left-4 flex items-center gap-3 rounded-2xl border border-border/50 bg-card/80 px-4 py-3 backdrop-blur-md animate-float [animation-delay:1s]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <Zap className="h-5 w-5 text-primary" />
              </div>

              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(reviews.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-3 w-3 fill-primary text-primary"
                    />
                  ))}
                </div>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t(reviews.text)}
                </p>
              </div>
            </div>

            {/* ================================================== */}
            {/* SHIPPING */}
            {/* ================================================== */}

            <div className="absolute -bottom-2 right-8 rounded-2xl border border-primary/30 bg-primary px-4 py-2.5 text-primary-foreground shadow-[0_10px_30px_-8px_hsl(var(--primary)/0.6)] animate-float [animation-delay:1.5s]">
              <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
                {t(shipping.title)}
              </p>

              <p className="font-display text-sm font-bold">
                {t(shipping.value)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
