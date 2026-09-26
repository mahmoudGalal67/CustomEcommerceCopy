"use client";

import { TwoColumnRichText } from "@shared/sections";

import { useCMS } from "../store";

import RichTextEditor from "./RichTextEditor";
import EditableImage from "./EditableImage";

interface LocalizedText {
  en?: string;
  ar?: string;
}

export default function CMS2ColumnRichText({
  id,
  image,
  imageAlt,
  content,
  imageSide,
  heading,
}: any) {
  const { selectedSection, updateProp } = useCMS();

  const active = selectedSection?.id === id;

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

    return `${import.meta.env.VITE_API_URL}${value}`;
  };

  /*
   * Support old content:
   *
   * content: "<p>Hello</p>"
   *
   * and new content:
   *
   * content: {
   *   en: "<p>Hello</p>",
   *   ar: "<p>مرحبا</p>"
   * }
   */
  const normalizedContent: LocalizedText =
    typeof content === "string"
      ? {
          en: content,
          ar: "",
        }
      : {
          en: content?.en ?? "",
          ar: content?.ar ?? "",
        };

  const updateContent = (value: LocalizedText) => {
    updateProp(id, "content", value);
  };

  const imageElement = (
    <EditableImage
      active={active}
      src={getImageUrl(image)}
      alt={typeof imageAlt === "string" ? imageAlt : (imageAlt?.en ?? "")}
      onChange={(value) => {
        updateProp(id, "image", value);
      }}
    />
  );

  return (
    <TwoColumnRichText
      image={getImageUrl(image)}
      imageAlt={imageAlt}
      content={normalizedContent}
      imageSide={imageSide}
      heading={heading}
      imageContent={imageElement}
      editorContent={
        active ? (
          <RichTextEditor value={normalizedContent} onChange={updateContent} />
        ) : (
          <div
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
            dir="ltr"
            dangerouslySetInnerHTML={{
              __html: normalizedContent.en,
            }}
          />
        )
      }
    />
  );
}
