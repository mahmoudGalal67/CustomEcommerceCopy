import { useCMS } from "../store";
import { Input } from "@/components/ui/input";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface Feature {
  id: string;
  title: LocalizedText | string;
  description: LocalizedText | string;
  icon: string;
}

const iconOptions = [
  { value: "shield", label: "Shield" },
  { value: "truck", label: "Truck" },
  { value: "gift", label: "Gift" },
  { value: "lock", label: "Lock" },
] as const;

export default function FeaturesSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "features") {
    return null;
  }

  const props = selectedSection.props as {
    heading?: LocalizedText | string;
    title1?: LocalizedText | string;
    title2?: LocalizedText | string;
    features?: Feature[];
  };

  const features = props.features ?? [];

  /*
  |--------------------------------------------------------------------------
  | Localization helpers
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

  const updateLocalizedProp = (
    prop: "heading" | "title1" | "title2",
    lang: "en" | "ar",
    value: string,
  ) => {
    updateProp(
      selectedSection.id,
      prop,
      (prev: LocalizedText | string = {}) => {
        const current =
          typeof prev === "string"
            ? {
                en: prev,
              }
            : prev;

        return {
          ...current,
          [lang]: value,
        };
      },
    );
  };

  const updateFeatureLocalizedValue = (
    featureId: string,
    field: "title" | "description",
    lang: "en" | "ar",
    value: string,
  ) => {
    updateProp(selectedSection.id, "features", (prev: Feature[] = []) =>
      prev.map((feature) => {
        if (feature.id !== featureId) {
          return feature;
        }

        const currentValue = feature[field];

        const current =
          typeof currentValue === "string"
            ? {
                en: currentValue,
              }
            : (currentValue ?? {});

        return {
          ...feature,
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
      {/* SECTION CONTENT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Section Content</h3>

        {/* Heading */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Heading</label>

          {/* English */}
          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Loved by 50,000+"
            value={getLocalizedValue(props.heading, "en")}
            onChange={(e) =>
              updateLocalizedProp("heading", "en", e.target.value)
            }
          />

          {/* Arabic */}
          <Input
            dir="rtl"
            placeholder="محبوب من أكثر من 50,000 عميل"
            value={getLocalizedValue(props.heading, "ar")}
            onChange={(e) =>
              updateLocalizedProp("heading", "ar", e.target.value)
            }
          />
        </div>

        {/* Title 1 */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Title Line 1</label>

          {/* English */}
          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Real Sneakerheads."
            value={getLocalizedValue(props.title1, "en")}
            onChange={(e) =>
              updateLocalizedProp("title1", "en", e.target.value)
            }
          />

          {/* Arabic */}
          <Input
            dir="rtl"
            placeholder="عشاق أحذية حقيقيون."
            value={getLocalizedValue(props.title1, "ar")}
            onChange={(e) =>
              updateLocalizedProp("title1", "ar", e.target.value)
            }
          />
        </div>

        {/* Title 2 */}
        <div>
          <label className="mb-1 block text-sm font-medium">Title Line 2</label>

          {/* English */}
          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Real Reviews."
            value={getLocalizedValue(props.title2, "en")}
            onChange={(e) =>
              updateLocalizedProp("title2", "en", e.target.value)
            }
          />

          {/* Arabic */}
          <Input
            dir="rtl"
            placeholder="تقييمات حقيقية."
            value={getLocalizedValue(props.title2, "ar")}
            onChange={(e) =>
              updateLocalizedProp("title2", "ar", e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* FEATURES */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Features</h3>

        <div className="flex flex-col gap-3">
          {features.map((feature, index) => (
            <div key={feature.id} className="rounded-md border p-3">
              <p className="mb-3 text-xs font-semibold text-gray-500">
                Feature {index + 1}
              </p>

              {/* ================================================== */}
              {/* TITLE */}
              {/* ================================================== */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Title</label>

                {/* English */}
                <Input
                  dir="ltr"
                  className="mb-2"
                  placeholder="Feature title"
                  value={getLocalizedValue(feature.title, "en")}
                  onChange={(e) =>
                    updateFeatureLocalizedValue(
                      feature.id,
                      "title",
                      "en",
                      e.target.value,
                    )
                  }
                />

                {/* Arabic */}
                <Input
                  dir="rtl"
                  placeholder="عنوان الميزة"
                  value={getLocalizedValue(feature.title, "ar")}
                  onChange={(e) =>
                    updateFeatureLocalizedValue(
                      feature.id,
                      "title",
                      "ar",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* ================================================== */}
              {/* DESCRIPTION */}
              {/* ================================================== */}

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                {/* English */}
                <textarea
                  dir="ltr"
                  className="mb-2 min-h-20 w-full rounded-md border p-2 text-sm"
                  placeholder="Feature description"
                  value={getLocalizedValue(feature.description, "en")}
                  onChange={(e) =>
                    updateFeatureLocalizedValue(
                      feature.id,
                      "description",
                      "en",
                      e.target.value,
                    )
                  }
                />

                {/* Arabic */}
                <textarea
                  dir="rtl"
                  className="min-h-20 w-full rounded-md border p-2 text-sm"
                  placeholder="وصف الميزة"
                  value={getLocalizedValue(feature.description, "ar")}
                  onChange={(e) =>
                    updateFeatureLocalizedValue(
                      feature.id,
                      "description",
                      "ar",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* ================================================== */}
              {/* ICON */}
              {/* ================================================== */}

              <div>
                <label className="mb-1 block text-sm font-medium">Icon</label>

                <select
                  className="h-10 w-full rounded-md border bg-white px-3 text-sm"
                  value={feature.icon ?? "shield"}
                  onChange={(e) =>
                    updateProp(
                      selectedSection.id,
                      "features",
                      (prev: Feature[] = []) =>
                        prev.map((item) =>
                          item.id === feature.id
                            ? {
                                ...item,
                                icon: e.target.value,
                              }
                            : item,
                        ),
                    )
                  }
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ================================================== */}
              {/* DELETE */}
              {/* ================================================== */}

              {features.length > 1 && (
                <button
                  type="button"
                  className="mt-3 w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  onClick={() =>
                    updateProp(
                      selectedSection.id,
                      "features",
                      (prev: Feature[] = []) =>
                        prev.filter((item) => item.id !== feature.id),
                    )
                  }
                >
                  Delete Feature
                </button>
              )}
            </div>
          ))}

          {/* ====================================================== */}
          {/* ADD FEATURE */}
          {/* ====================================================== */}

          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() =>
              updateProp(
                selectedSection.id,
                "features",
                (prev: Feature[] = []) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),

                    title: {
                      en: "New Feature",
                      ar: "ميزة جديدة",
                    },

                    description: {
                      en: "Feature description",
                      ar: "وصف الميزة",
                    },

                    icon: "shield",
                  },
                ],
              )
            }
          >
            ➕ Add Feature
          </button>
        </div>
      </div>
    </div>
  );
}
