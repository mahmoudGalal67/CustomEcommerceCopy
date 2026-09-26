import { useCMS } from "../store";
import { Input } from "@/components/ui/input";

interface LocalizedText {
  en?: string;
  ar?: string;
}

export default function BrandMarqueeSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "brandMarquee") {
    return null;
  }

  const props = selectedSection.props as {
    title?: LocalizedText | string;
    brands?: (LocalizedText | string)[];
  };

  const brands = props.brands ?? [];

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

    // Backward compatibility with old string data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? "";
  };

  const updateLocalizedValue = (
    prop: "title" | "brands",
    index: number | null,
    lang: "en" | "ar",
    value: string,
  ) => {
    if (prop === "title") {
      updateProp(
        selectedSection.id,
        "title",
        (prev: LocalizedText | string = {}) => {
          const current = typeof prev === "string" ? { en: prev } : prev;

          return {
            ...current,
            [lang]: value,
          };
        },
      );

      return;
    }

    updateProp(
      selectedSection.id,
      "brands",
      (prev: (LocalizedText | string)[] = []) =>
        prev.map((item, i) => {
          if (i !== index) return item;

          const current = typeof item === "string" ? { en: item } : item;

          return {
            ...current,
            [lang]: value,
          };
        }),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ========================================================== */}
      {/* BRAND MARQUEE CONTENT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Brand Marquee</h3>

        {/* English Title */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Title (English)
          </label>

          <Input
            dir="ltr"
            value={getLocalizedValue(props.title, "en")}
            placeholder="Authentic footwear from the world's leading brands"
            onChange={(e) =>
              updateLocalizedValue("title", null, "en", e.target.value)
            }
          />
        </div>

        {/* Arabic Title */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Title (Arabic)
          </label>

          <Input
            dir="rtl"
            value={getLocalizedValue(props.title, "ar")}
            placeholder="أحذية أصلية من أشهر العلامات التجارية العالمية"
            onChange={(e) =>
              updateLocalizedValue("title", null, "ar", e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* BRANDS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Brands</h3>

          <span className="text-xs text-gray-500">
            {brands.length} {brands.length === 1 ? "brand" : "brands"}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {brands.map((brand, index) => (
            <div key={index} className="rounded-md border p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500">
                  Brand {index + 1}
                </p>

                {/* Delete */}
                {brands.length > 1 && (
                  <button
                    type="button"
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                    onClick={() =>
                      updateProp(
                        selectedSection.id,
                        "brands",
                        (prev: (LocalizedText | string)[] = []) =>
                          prev.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* English */}
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  English
                </label>

                <Input
                  dir="ltr"
                  placeholder="Brand name"
                  value={getLocalizedValue(brand, "en")}
                  onChange={(e) =>
                    updateLocalizedValue("brands", index, "en", e.target.value)
                  }
                />
              </div>

              {/* Arabic */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Arabic
                </label>

                <Input
                  dir="rtl"
                  placeholder="اسم العلامة التجارية"
                  value={getLocalizedValue(brand, "ar")}
                  onChange={(e) =>
                    updateLocalizedValue("brands", index, "ar", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {/* Add Brand */}
          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            onClick={() =>
              updateProp(
                selectedSection.id,
                "brands",
                (prev: (LocalizedText | string)[] = []) => [
                  ...prev,
                  {
                    en: "New Brand",
                    ar: "علامة تجارية جديدة",
                  },
                ],
              )
            }
          >
            ➕ Add Brand
          </button>
        </div>
      </div>
    </div>
  );
}
