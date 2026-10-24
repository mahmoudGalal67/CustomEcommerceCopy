"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface BannerSlide {
  id: string;
  title: LocalizedText | string;
  subTitle: LocalizedText | string;
  image: string;
}

interface BannerProps {
  slides: BannerSlide[];
  isEditable?: boolean;
  apiUrl?: string;
  locale?: string;
}

export default function Banner({
  slides,
  isEditable,
  apiUrl = "",
  locale = "en",
}: BannerProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined) => {
    if (!value) return "";
    if (typeof value === "string") return value;

    return value[lang] ?? value.en ?? "";
  };

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className={isEditable ? "pointer-events-none" : "my-2"}
    >
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        loop
        className="h-[400px] w-full md:h-[500px]"
      >
        {slides.map((slide, index) => {
          const imageSrc = slide.image?.startsWith("http")
            ? slide.image
            : `${apiUrl}${slide.image}`;

          return (
            <SwiperSlide key={slide.id}>
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-900 text-white">
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={t(slide.title) || "Promotional banner"}
                    fill
                    sizes="100vw"
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                )}

                {/* Bottom cinematic gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"
                />

                {/* Primary color glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_55%)]"
                />

                {/* Content */}
                <div className="relative z-10 max-w-3xl px-8 py-6 text-center">
                  <h2 className="text-3xl font-bold tracking-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)] md:text-5xl">
                    {t(slide.title)}
                  </h2>

                  <p className="mt-3 text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-2xl">
                    {t(slide.subTitle)}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
