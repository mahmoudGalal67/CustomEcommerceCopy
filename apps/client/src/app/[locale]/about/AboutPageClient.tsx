"use client";

import {
  ArrowRight,
  Heart,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetSettingsQuery } from "@/services/SettingsApi";
import { useParams } from "next/navigation";

import AnimatedCounter from "@/components/AnimatedCounter";

import { useGetFeaturesQuery } from "@/services/features";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ICONS: Record<string, LucideIcon> = {
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Heart,
  Truck,
  CreditCard,
  ShoppingBag,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
};

type LocalizedText = {
  en?: string;
  ar?: string;
};

const getLocalizedText = (
  value: LocalizedText | string | null | undefined,
  locale: string,
) => {
  if (!value) return "";

  // Backward compatibility with old string data
  if (typeof value === "string") {
    return value;
  }

  if (locale === "ar") {
    return value.ar || value.en || "";
  }

  return value.en || value.ar || "";
};

export default function AboutPage() {
  const { data: features, isLoading: isLoadingFeatures } =
    useGetFeaturesQuery(undefined);
  const router = useRouter();

  const params = useParams();
  const locale = (params.locale || "en") as string;
  const { data: settings } = useGetSettingsQuery(undefined);

  const info = settings?.info;

  const featuress = info?.features ?? [];
  useEffect(() => {
    if (!isLoadingFeatures && features?.show_about_page === false) {
      router.replace("/en/404");
    }
  }, [settings, isLoadingFeatures, router]);

  const whyChoseUs = info?.whyChooseUs ?? [];
  const shopping = info?.shopping ?? [];

  if (isLoadingFeatures) {
    return null;
  }

  if (settings?.features?.show_about_page === false) {
    return null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -right-40 top-[35%] h-[35rem] w-[35rem] rounded-full bg-primary/5 blur-3xl" />

        <div
          className="
            absolute inset-0 opacity-[0.035]
            [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
            [background-size:64px_64px]
          "
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* ========================================================= */}
        {/* HERO */}
        {/* ========================================================= */}

        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            {locale == "ar" ? "أكثر من مجرد أحذية" : "More than just shoes"}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            {locale == "ar" ? "نؤمن بحق" : "We believe the right"}
            <span className="block text-primary">
              {locale == "ar"
                ? "الاقتران يغير كل شيء."
                : "pair changes everything."}
            </span>
          </h1>

          <p
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="mx-auto mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
            dangerouslySetInnerHTML={{
              __html: getLocalizedText(info?.about?.description, locale),
            }}
          />

          <div
            className={`mt-8 flex flex-col justify-center gap-3 sm:flex-row`}
          >
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-7 cursor-pointer"
            >
              {locale == "ar" ? "اتصل بنا" : "Contact us"}
            </Button>
            <Button size="lg" className="h-12 rounded-xl px-7 cursor-pointer">
              {locale == "ar" ? "استكشف المجموعة" : "Explore collection "}

              <ArrowRight
                className={`h-4 w-4 ${
                  locale === "ar" ? "mr-2 rotate-180" : "ml-2"
                }`}
              />
            </Button>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BRAND STORY */}
        {/* ========================================================= */}

        <section className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Visual */}
          <div className="relative">
            <div
              className="
      group relative aspect-[4/3] overflow-hidden rounded-[2rem]
      bg-foreground shadow-2xl
    "
            >
              {/* Background image */}
              <img
                src="/images/about-shoes.jpg"
                alt=""
                className="
        absolute inset-0 h-full w-full object-cover
        transition-transform duration-700
        group-hover:scale-105
      "
              />

              {/* Dark gradient overlay */}
              <div
                className="
        absolute inset-0
        bg-gradient-to-br
        from-black/40 via-black/20 to-black/40
      "
              />

              {/* Primary color glow */}
              <div
                className="
        absolute -right-24 -top-24
        h-72 w-72 rounded-full
        bg-primary/30 blur-3xl
      "
              />

              <div
                className="
        absolute -bottom-32 -left-24
        h-80 w-80 rounded-full
        bg-primary/20 blur-3xl
      "
              />

              {/* Decorative grid */}
              <div
                className="
        absolute inset-0 opacity-[0.08]
        [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
        [background-size:48px_48px]
      "
              />

              {/* Decorative circles */}
              <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

              {/* Content */}
              <div
                className="
        relative flex h-full flex-col items-center
        justify-center p-8 text-center text-white sm:p-10
      "
              >
                {/* Icon */}
                <div
                  className="
          mb-6 flex h-20 w-20 items-center justify-center
          rounded-3xl border border-white/20
          bg-white/10 shadow-2xl backdrop-blur-md
          transition-transform duration-500
          group-hover:scale-110
        "
                >
                  <Sparkles className="h-9 w-9 text-primary" />
                </div>

                {/* Heading */}
                <p
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="
          text-3xl font-bold tracking-tight
          drop-shadow-lg sm:text-4xl
        "
                >
                  {locale === "ar" ? "سِر على طريقتك" : "Walk your way."}
                </p>

                {/* Description */}
                <p
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="
          mt-4 max-w-sm text-sm leading-7
          text-white/70 drop-shadow
        "
                >
                  {locale === "ar"
                    ? "الأناقة والراحة والثقة؛ اعثر على الزوج الذي يلائم قصتك."
                    : "Style, comfort, confidence — find the pair that fits your story."}
                </p>

                {/* Bottom badge */}
                <div
                  className="
          mt-7 inline-flex items-center gap-2
          rounded-full border border-white/15
          bg-white/10 px-4 py-2
          text-xs font-medium text-white/80
          backdrop-blur-md
        "
                >
                  <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_currentColor]" />
                  {locale === "ar" ? "اكتشف أسلوبك" : "Discover your style"}
                </div>
              </div>
            </div>

            {/* Floating card */}
            <Card
              className="
                absolute -bottom-7 left-5 w-[calc(100%-2.5rem)]
                max-w-sm border-border/60 bg-background/95 shadow-xl
                backdrop-blur sm:left-8
              "
            >
              <CardContent className="flex items-center gap-2 p-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold">
                    {" "}
                    {locale == "ar" ? "صُنِعَ بشغف" : " Built with passion"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locale == "ar"
                      ? "كل تفصيل مهم. "
                      : " Every detail matters."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Story */}
          <div className="lg:pl-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {locale == "ar" ? "قصتنا" : "  Our story"}
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {locale == "ar"
                ? "بدأ الأمر بفكرة بسيطة."
                : " It started with a simple idea."}
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
              <div
                dir={locale === "ar" ? "rtl" : "ltr"}
                className="
    prose prose-neutral dark:prose-invert
    mt-6 max-w-none
    text-base leading-8 text-muted-foreground
    [&_p]:mb-5
    [&_p]:leading-8
    [&_h1]:text-3xl
    [&_h2]:text-2xl
    [&_h3]:text-xl
  "
                dangerouslySetInnerHTML={{
                  __html: getLocalizedText(info?.about?.story, locale),
                }}
              />
            </div>

            <div className="mt-8">
              <Button variant="outline" className="rounded-xl cursor-pointer">
                {locale == "ar" ? "اكتشف منتجاتنا" : "Discover our products"}
                <ArrowRight
                  className={`h-4 w-4 ${
                    locale === "ar" ? "mr-2 rotate-180" : "ml-2"
                  }`}
                />
              </Button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* STATS */}
        {/* ========================================================= */}
        <section className="mt-24 rounded-[2rem] border bg-background/70 p-8 shadow-sm backdrop-blur sm:p-12">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {featuress.map((feature: any, i: number) => (
              <div key={i}>
                <p className="text-4xl font-bold tracking-tight sm:text-5xl">
                  <AnimatedCounter value={feature.title?.[locale] ?? ""} />
                </p>

                <p
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  {feature.description?.[locale] ?? ""}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* VALUES */}
        {/* ========================================================= */}

        <section className="mt-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {locale === "ar" ? "ما نمثله" : "What we stand for"}
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {locale === "ar" ? "لماذا تتسوق معنا؟" : "Why shop with us?"}
            </h2>

            <p className="mt-4 text-muted-foreground">
              {locale === "ar"
                ? "نحن لا نريد بيع المنتجات فقط، بل نريد بناء تجربة تستمتع بالعودة إليها."
                : "We don't just want to sell products. We want to build an experience you enjoy coming back to."}
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {whyChoseUs.map((value: any, index: number) => {
              const Icon = ICONS[value.icon] ?? Sparkles;

              return (
                <Card
                  key={`${value.title?.en}-${index}`}
                  className="
            group border-border/60 bg-background/80
            shadow-sm backdrop-blur transition-all duration-300
            hover:-translate-y-1 hover:shadow-xl
          "
                >
                  <CardContent className="p-7">
                    <div
                      className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl bg-primary/10 text-primary
                transition-all duration-300
                group-hover:bg-primary
                group-hover:text-primary-foreground
              "
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold">
                      {getLocalizedText(value.title, locale)}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {getLocalizedText(value.description, locale)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURES */}
        {/* ========================================================= */}

        <section className="mt-24">
          <div className="rounded-[2rem] bg-muted/40 p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  {locale === "ar"
                    ? "تجربة تسوق بسيطة"
                    : "Shopping made simple"}
                </p>

                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  {locale === "ar" ? (
                    <>
                      كل ما تحتاجه،
                      <span className="block">في مكان واحد.</span>
                    </>
                  ) : (
                    <>
                      Everything you need,
                      <span className="block">all in one place.</span>
                    </>
                  )}
                </h2>

                <p
                  className="mt-5 leading-7 text-muted-foreground"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                >
                  {locale === "ar"
                    ? "من تصفح منتجاتك المفضلة إلى استلام طلبك عند باب منزلك، نركز على جعل كل خطوة بسيطة."
                    : "From browsing your favorite styles to receiving your order at your door, we're focused on making every step simple."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
                {shopping.map((feature: any, index: number) => {
                  const Icon = ICONS[feature.icon] ?? PackageCheck;

                  return (
                    <div
                      key={`${feature.title?.en}-${index}`}
                      className="rounded-2xl border bg-background/80 p-5"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        className="mt-5 font-semibold"
                      >
                        {getLocalizedText(feature.title, locale)}
                      </h3>

                      <p
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        className="mt-2 text-sm leading-6 text-muted-foreground"
                      >
                        {getLocalizedText(feature.description, locale)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SOCIAL / CTA */}
        {/* ========================================================= */}

        <section className="group relative mt-24 overflow-hidden rounded-[2rem] bg-foreground px-6 py-16 text-background shadow-2xl sm:px-12">
          {/* Background image */}
          <img
            src="/images/instagram-shoes.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Main overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-black/85" />

          {/* Primary glow */}
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

          {/* Subtle grid */}
          <div
            className="
      absolute inset-0 opacity-[0.07]
      [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]
      [background-size:48px_48px]
    "
          />

          {/* Decorative circles */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/5" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full border border-white/10" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            {/* Instagram icon */}
            <div
              className="
        mx-auto flex h-16 w-16 items-center justify-center
        rounded-2xl border border-white/20
        bg-white/10 shadow-2xl backdrop-blur-md
        transition-all duration-500
        group-hover:scale-110 group-hover:border-primary/40
      "
            ></div>

            <h2
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="
        mt-7 text-3xl font-bold tracking-tight text-white
        drop-shadow-lg sm:text-4xl
      "
            >
              {locale === "ar" ? "تابع الرحلة." : "Follow the journey."}
            </h2>

            <p
              dir={locale === "ar" ? "rtl" : "ltr"}
              className="
        mx-auto mt-4 max-w-lg text-sm leading-7
        text-white/70 drop-shadow sm:text-base
      "
            >
              {locale === "ar"
                ? "اكتشف أحدث المنتجات، وأفكاراً لتنسيق الإطلالات، وعروضاً خاصة، وكل ما يحدث في متجرنا."
                : "Discover new arrivals, styling inspiration, special offers, and everything happening in our store."}
            </p>

            {/* CTA */}
            <Button
              variant="secondary"
              size="lg"
              className="
        mt-8 h-12 rounded-xl px-7
        shadow-xl transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        cursor-pointer
      "
            >
              {locale === "ar"
                ? "تابعنا على إنستغرام"
                : "Follow us on Instagram"}

              <ArrowRight
                className={`h-4 w-4 ${
                  locale === "ar" ? "mr-2 rotate-180" : "ml-2"
                }`}
              />
            </Button>

            {/* Small status badge */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_currentColor]" />

                {locale === "ar" ? "انضم إلى مجتمعنا" : "Join our community"}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
