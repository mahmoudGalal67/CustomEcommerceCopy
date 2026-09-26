"use client";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface BrandMarqueeProps {
  brands: (LocalizedText | string)[];
  title?: LocalizedText | string;
  locale?: string;
}

export default function BrandMarquee({
  brands,
  title,
  locale = "en",
}: BrandMarqueeProps) {
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
      dir="ltr"
      id="brands"
      className="relative border-y border-border/40 py-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {t(title)}
        </p>
      </div>

      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* First marquee */}
        <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${i}-${t(brand)}`}
              className="font-display text-2xl font-bold tracking-tight text-muted-foreground/50 transition-colors hover:text-foreground sm:text-3xl"
            >
              {t(brand)}
            </span>
          ))}
        </div>

        {/* Second marquee */}
        <div
          className="flex shrink-0 animate-marquee items-center gap-12 pr-12"
          aria-hidden
        >
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${i}-${t(brand)}-dup`}
              className="font-display text-2xl font-bold tracking-tight text-muted-foreground/50 transition-colors hover:text-foreground sm:text-3xl"
            >
              {t(brand)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
