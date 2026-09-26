import UploadButton from "@/components/UploadButton";
import { useCMS } from "../store";
import { Input } from "@/components/ui/input";

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

export default function BannerSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "banner") {
    return null;
  }

  const props = selectedSection.props as {
    slides?: BannerSlide[];
  };

  const slides = props.slides ?? [];

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getLocalizedValue = (
    value: LocalizedText | string | undefined,
    lang: "en" | "ar",
  ) => {
    if (!value) return "";

    // Backward compatibility with old CMS data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? "";
  };

  const updateSlideLocalizedValue = (
    slideId: string,
    field: "title" | "subTitle",
    lang: "en" | "ar",
    value: string,
  ) => {
    updateProp(selectedSection.id, "slides", (prev: BannerSlide[] = []) =>
      prev.map((slide) => {
        if (slide.id !== slideId) {
          return slide;
        }

        const currentValue = slide[field];

        const current =
          typeof currentValue === "string"
            ? {
                en: currentValue,
              }
            : (currentValue ?? {});

        return {
          ...slide,

          [field]: {
            ...current,
            [lang]: value,
          },
        };
      }),
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex flex-col gap-6">
      {/* ========================================================== */}
      {/* BANNER SLIDES */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Banner Slides</h3>

          <span className="text-xs text-gray-500">
            {slides.length} {slides.length === 1 ? "slide" : "slides"}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {slides.map((slide, index) => (
            <div key={slide.id} className="rounded-md border p-3">
              {/* ================================================== */}
              {/* SLIDE HEADER */}
              {/* ================================================== */}

              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Slide {index + 1}
                </p>

                {slides.length > 1 && (
                  <button
                    type="button"
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                    onClick={() =>
                      updateProp(
                        selectedSection.id,
                        "slides",
                        (prev: BannerSlide[] = []) =>
                          prev.filter((item) => item.id !== slide.id),
                      )
                    }
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* ================================================== */}
              {/* TITLE */}
              {/* ================================================== */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Title</label>

                {/* English */}
                <Input
                  dir="ltr"
                  className="mb-2"
                  placeholder="Banner title"
                  value={getLocalizedValue(slide.title, "en")}
                  onChange={(e) =>
                    updateSlideLocalizedValue(
                      slide.id,
                      "title",
                      "en",
                      e.target.value,
                    )
                  }
                />

                {/* Arabic */}
                <Input
                  dir="rtl"
                  placeholder="عنوان البانر"
                  value={getLocalizedValue(slide.title, "ar")}
                  onChange={(e) =>
                    updateSlideLocalizedValue(
                      slide.id,
                      "title",
                      "ar",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* ================================================== */}
              {/* SUBTITLE */}
              {/* ================================================== */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Subtitle
                </label>

                {/* English */}
                <textarea
                  dir="ltr"
                  className="mb-2 min-h-20 w-full rounded-md border p-2 text-sm"
                  placeholder="Banner subtitle"
                  value={getLocalizedValue(slide.subTitle, "en")}
                  onChange={(e) =>
                    updateSlideLocalizedValue(
                      slide.id,
                      "subTitle",
                      "en",
                      e.target.value,
                    )
                  }
                />

                {/* Arabic */}
                <textarea
                  dir="rtl"
                  className="min-h-20 w-full rounded-md border p-2 text-sm"
                  placeholder="العنوان الفرعي للبانر"
                  value={getLocalizedValue(slide.subTitle, "ar")}
                  onChange={(e) =>
                    updateSlideLocalizedValue(
                      slide.id,
                      "subTitle",
                      "ar",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* ================================================== */}
              {/* IMAGE */}
              {/* ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium">Image</label>

                <UploadButton
                  selectedSection={selectedSection}
                  slide={slide}
                  updateProp={updateProp}
                  parent="slides"
                />
              </div>
            </div>
          ))}

          {/* ====================================================== */}
          {/* ADD SLIDE */}
          {/* ====================================================== */}

          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            onClick={() =>
              updateProp(
                selectedSection.id,
                "slides",
                (prev: BannerSlide[] = []) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),

                    title: {
                      en: "New Banner",
                      ar: "بانر جديد",
                    },

                    subTitle: {
                      en: "Banner subtitle",
                      ar: "العنوان الفرعي للبانر",
                    },

                    image: "",
                  },
                ],
              )
            }
          >
            ➕ Add Slide
          </button>
        </div>
      </div>
    </div>
  );
}
