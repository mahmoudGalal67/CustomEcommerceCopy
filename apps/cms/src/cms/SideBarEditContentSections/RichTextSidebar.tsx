"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCMS } from "../store";

type LocalizedText = {
  en?: string;
  ar?: string;
};

export default function RichTextSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "twoColumnRichText") {
    return null;
  }

  const { id, props } = selectedSection;

  const heading = props.heading ?? {
    mainTitle: { en: "", ar: "" },
    title1: { en: "", ar: "" },
    title2: { en: "", ar: "" },
  };

  const normalizeText = (
    value: LocalizedText | string | undefined,
  ): LocalizedText => {
    if (!value) {
      return { en: "", ar: "" };
    }

    if (typeof value === "string") {
      return {
        en: value,
        ar: "",
      };
    }

    return {
      en: value.en ?? "",
      ar: value.ar ?? "",
    };
  };

  const updateHeading = (
    key: "mainTitle" | "title1" | "title2",
    language: "en" | "ar",
    value: string,
  ) => {
    updateProp(id, "heading", (prev: any = {}) => {
      const current = normalizeText(prev[key]);

      return {
        ...prev,
        [key]: {
          ...current,
          [language]: value,
        },
      };
    });
  };

  const mainTitle = normalizeText(heading.mainTitle);
  const title1 = normalizeText(heading.title1);
  const title2 = normalizeText(heading.title2);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Heading</h3>

        <div className="flex flex-col gap-5">
          {/* Main Title */}
          <div className="space-y-3">
            <Label>Main Title</Label>

            <div className="space-y-2">
              <Label
                htmlFor="heading-main-title-en"
                className="text-xs text-muted-foreground"
              >
                English
              </Label>

              <Input
                id="heading-main-title-en"
                dir="ltr"
                value={mainTitle.en}
                onChange={(e) =>
                  updateHeading("mainTitle", "en", e.target.value)
                }
                placeholder="Enter main title"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="heading-main-title-ar"
                className="text-xs text-muted-foreground"
              >
                العربية
              </Label>

              <Input
                id="heading-main-title-ar"
                dir="rtl"
                value={mainTitle.ar}
                onChange={(e) =>
                  updateHeading("mainTitle", "ar", e.target.value)
                }
                placeholder="أدخل العنوان الرئيسي"
              />
            </div>
          </div>

          {/* Title 1 */}
          <div className="space-y-3">
            <Label>Title 1</Label>

            <div className="space-y-2">
              <Label
                htmlFor="heading-title-1-en"
                className="text-xs text-muted-foreground"
              >
                English
              </Label>

              <Input
                id="heading-title-1-en"
                dir="ltr"
                value={title1.en}
                onChange={(e) => updateHeading("title1", "en", e.target.value)}
                placeholder="Enter first title"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="heading-title-1-ar"
                className="text-xs text-muted-foreground"
              >
                العربية
              </Label>

              <Input
                id="heading-title-1-ar"
                dir="rtl"
                value={title1.ar}
                onChange={(e) => updateHeading("title1", "ar", e.target.value)}
                placeholder="أدخل العنوان الأول"
              />
            </div>
          </div>

          {/* Title 2 */}
          <div className="space-y-3">
            <Label>Title 2</Label>

            <div className="space-y-2">
              <Label
                htmlFor="heading-title-2-en"
                className="text-xs text-muted-foreground"
              >
                English
              </Label>

              <Input
                id="heading-title-2-en"
                dir="ltr"
                value={title2.en}
                onChange={(e) => updateHeading("title2", "en", e.target.value)}
                placeholder="Enter second title"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="heading-title-2-ar"
                className="text-xs text-muted-foreground"
              >
                العربية
              </Label>

              <Input
                id="heading-title-2-ar"
                dir="rtl"
                value={title2.ar}
                onChange={(e) => updateHeading("title2", "ar", e.target.value)}
                placeholder="أدخل العنوان الثاني"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
