import Image from "next/image";

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
  priority?: boolean;
}

export default function Banner({
  slides,
  isEditable,
  apiUrl = "",
  locale = "en",
  priority = false,
}: BannerProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined) => {
    if (!value) return "";
    if (typeof value === "string") return value;

    return value[lang] ?? value.en ?? "";
  };

  const activeslide = slides[0];
  const imageSrc = activeslide.image?.startsWith("http")
    ? activeslide.image
    : `${apiUrl}${activeslide.image}`;

  return (
    <section
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className={isEditable ? "pointer-events-none" : "my-2"}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gray-900 text-white">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={t(activeslide.title) || "Promotional banner"}
            fill
            sizes="100vw"
            priority={priority}
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
            {t(activeslide.title)}
          </h2>

          <p className="mt-3 text-lg text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] md:text-2xl">
            {t(activeslide.subTitle)}
          </p>
        </div>
      </div>
    </section>
  );
}
