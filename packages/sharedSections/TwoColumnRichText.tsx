"use client";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface TwoColumnRichTextProps {
  image: string;

  imageAlt?: LocalizedText | string;

  imageSide?: "left" | "right";

  heading?: {
    mainTitle: LocalizedText | string;
    title1: LocalizedText | string;
    title2: LocalizedText | string;
  };

  content: LocalizedText | string;

  locale?: string;

  imageContent?: React.ReactNode;

  editorContent?: React.ReactNode;
}

const richTextClass = `
  max-w-none

  [&_h1]:mb-6
  [&_h1]:text-4xl
  [&_h1]:font-bold
  [&_h1]:leading-tight

  [&_h2]:mb-5
  [&_h2]:mt-8
  [&_h2]:text-3xl
  [&_h2]:font-bold
  [&_h2]:leading-tight

  [&_h3]:mb-4
  [&_h3]:mt-6
  [&_h3]:text-2xl
  [&_h3]:font-semibold

  [&_h4]:mb-3
  [&_h4]:mt-5
  [&_h4]:text-xl
  [&_h4]:font-semibold

  [&_p]:my-4
  [&_p]:leading-7

  [&_strong]:font-bold
  [&_em]:italic

  [&_ul]:my-4
  [&_ul]:list-disc
  [&_ul]:pl-6

  [&_ol]:my-4
  [&_ol]:list-decimal
  [&_ol]:pl-6

  [&_li]:my-1

  [&_a]:font-medium
  [&_a]:underline
  [&_a]:underline-offset-4

  [&_blockquote]:my-6
  [&_blockquote]:border-l-4
  [&_blockquote]:pl-4
  [&_blockquote]:italic

  [&_hr]:my-8

  [&_img]:my-6
  [&_img]:max-w-full
  [&_img]:rounded-xl
`;

export default function TwoColumnRichText({
  image,
  imageAlt = "",
  content,
  imageSide = "left",
  imageContent,
  editorContent,
  heading,
  locale = "en",
}: TwoColumnRichTextProps) {
  const lang = locale === "ar" ? "ar" : "en";

  const t = (value: LocalizedText | string | undefined): string => {
    if (!value) return "";

    // Backward compatibility with old string data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  const imageElement = imageContent ? (
    imageContent
  ) : (
    <img src={image} alt={t(imageAlt)} className="h-full w-full object-cover" />
  );

  const textElement = editorContent ? (
    editorContent
  ) : (
    <div
      className={richTextClass}
      dir={lang === "ar" ? "rtl" : "ltr"}
      dangerouslySetInnerHTML={{
        __html: t(content),
      }}
    />
  );

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      lang={lang}
      className="w-full py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {t(heading?.mainTitle)}
          </p>

          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {t(heading?.title1)}
            <br />

            <span className="text-muted-foreground">{t(heading?.title2)}</span>
          </h2>
        </div>

        {/* Content */}
        <div className="grid overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm lg:grid-cols-2">
          {/* IMAGE */}
          <div
            className={`min-h-[350px] lg:min-h-[550px] ${
              imageSide === "right" ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {imageElement}
          </div>

          {/* CONTENT */}
          <div
            className={`flex items-center p-8 sm:p-10 lg:p-14 xl:p-16 ${
              imageSide === "right" ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <div className="w-full">{textElement}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
