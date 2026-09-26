"use client";

import { TwoColumnRichText } from "@shared/sections";
import { useParams } from "next/navigation";

export default function Client2ColumnRichText({
  id,
  image,
  imageAlt,
  content,
  imageSide,
  heading,
}: any) {
  const params = useParams();
  const locale = (params.locale || "en") as string;

  const getImageUrl = (value?: string) => {
    if (!value) return "";

    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:image") ||
      value.startsWith("blob:")
    ) {
      return value;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}${value}`;
  };

  const getLocalizedValue = (value: any) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    return value[locale] ?? value.en ?? value.ar ?? "";
  };

  const localizedContent = getLocalizedValue(content);
  const localizedImageAlt = getLocalizedValue(imageAlt);

  const localizedHeading = {
    mainTitle: getLocalizedValue(heading?.mainTitle),
    title1: getLocalizedValue(heading?.title1),
    title2: getLocalizedValue(heading?.title2),
  };

  return (
    <TwoColumnRichText
      image={getImageUrl(image)}
      imageAlt={localizedImageAlt}
      content={localizedContent}
      heading={localizedHeading}
      imageSide={imageSide}
      locale={locale}
      imageContent={null}
      editorContent={
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          lang={locale}
          className="
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
          "
          dangerouslySetInnerHTML={{
            __html: localizedContent,
          }}
        />
      }
    />
  );
}
