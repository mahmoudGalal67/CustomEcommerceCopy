import { useCMS } from "../store";
import { Input } from "@/components/ui/input";

type Lang = "en" | "ar";

const getLocalizedValue = (value: any, lang: Lang) => {
  if (!value) return "";
  if (typeof value === "string") {
    return lang === "en" ? value : "";
  }

  return value[lang] ?? "";
};

export default function TestimonialsSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "testimonials") {
    return null;
  }

  const props = selectedSection.props as any;

  const updateLocalizedSectionValue = (
    prop: string,
    lang: Lang,
    value: string,
  ) => {
    updateProp(selectedSection.id, prop, (prev: any) => ({
      ...(typeof prev === "object" && prev !== null ? prev : {}),
      [lang]: value,
    }));
  };

  const updateTestimonialLocalizedValue = (
    testimonialId: string,
    field: string,
    lang: Lang,
    value: string,
  ) => {
    updateProp(selectedSection.id, "testimonials", (prev: any[] = []) =>
      prev.map((item) =>
        item.id === testimonialId
          ? {
              ...item,
              [field]: {
                ...(typeof item[field] === "object" && item[field] !== null
                  ? item[field]
                  : {
                      en: item[field] ?? "",
                    }),
                [lang]: value,
              },
            }
          : item,
      ),
    );
  };

  const updateTestimonialValue = (
    testimonialId: string,
    field: string,
    value: any,
  ) => {
    updateProp(selectedSection.id, "testimonials", (prev: any[] = []) =>
      prev.map((item) =>
        item.id === testimonialId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ========================================================== */}
      {/* SECTION CONTENT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Section Content</h3>

        {/* Heading */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Heading</label>

          <div className="space-y-2">
            <Input
              dir="ltr"
              placeholder="English"
              value={getLocalizedValue(props.heading, "en")}
              onChange={(e) =>
                updateLocalizedSectionValue("heading", "en", e.target.value)
              }
            />

            <Input
              dir="rtl"
              placeholder="العربية"
              value={getLocalizedValue(props.heading, "ar")}
              onChange={(e) =>
                updateLocalizedSectionValue("heading", "ar", e.target.value)
              }
            />
          </div>
        </div>

        {/* Title 1 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Title Line 1</label>

          <div className="space-y-2">
            <Input
              dir="ltr"
              placeholder="English"
              value={getLocalizedValue(props.title1, "en")}
              onChange={(e) =>
                updateLocalizedSectionValue("title1", "en", e.target.value)
              }
            />

            <Input
              dir="rtl"
              placeholder="العربية"
              value={getLocalizedValue(props.title1, "ar")}
              onChange={(e) =>
                updateLocalizedSectionValue("title1", "ar", e.target.value)
              }
            />
          </div>
        </div>

        {/* Title 2 */}
        <div>
          <label className="mb-2 block text-sm font-medium">Title Line 2</label>

          <div className="space-y-2">
            <Input
              dir="ltr"
              placeholder="English"
              value={getLocalizedValue(props.title2, "en")}
              onChange={(e) =>
                updateLocalizedSectionValue("title2", "en", e.target.value)
              }
            />

            <Input
              dir="rtl"
              placeholder="العربية"
              value={getLocalizedValue(props.title2, "ar")}
              onChange={(e) =>
                updateLocalizedSectionValue("title2", "ar", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* TESTIMONIALS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Testimonials</h3>

        <div className="flex flex-col gap-4">
          {(props.testimonials ?? []).map((testimonial: any, index: number) => (
            <div key={testimonial.id} className="rounded-md border p-3">
              <p className="mb-4 text-xs font-semibold text-gray-500">
                Testimonial {index + 1}
              </p>

              {/* Name */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Name</label>

                <div className="space-y-2">
                  <Input
                    dir="ltr"
                    placeholder="English"
                    value={getLocalizedValue(testimonial.name, "en")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "name",
                        "en",
                        e.target.value,
                      )
                    }
                  />

                  <Input
                    dir="rtl"
                    placeholder="العربية"
                    value={getLocalizedValue(testimonial.name, "ar")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "name",
                        "ar",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* Handle */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Handle</label>

                <Input
                  dir="ltr"
                  placeholder="@username"
                  value={testimonial.handle ?? ""}
                  onChange={(e) =>
                    updateTestimonialValue(
                      testimonial.id,
                      "handle",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Avatar */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Avatar</label>

                <Input
                  dir="ltr"
                  placeholder="AM"
                  value={testimonial.avatar ?? ""}
                  onChange={(e) =>
                    updateTestimonialValue(
                      testimonial.id,
                      "avatar",
                      e.target.value,
                    )
                  }
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Role</label>

                <div className="space-y-2">
                  <Input
                    dir="ltr"
                    placeholder="English"
                    value={getLocalizedValue(testimonial.role, "en")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "role",
                        "en",
                        e.target.value,
                      )
                    }
                  />

                  <Input
                    dir="rtl"
                    placeholder="العربية"
                    value={getLocalizedValue(testimonial.role, "ar")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "role",
                        "ar",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Rating</label>

                <Input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={testimonial.rating ?? 5}
                  onChange={(e) =>
                    updateTestimonialValue(
                      testimonial.id,
                      "rating",
                      Math.min(5, Math.max(1, Number(e.target.value))),
                    )
                  }
                />
              </div>

              {/* Review */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Review</label>

                <div className="space-y-2">
                  <textarea
                    dir="ltr"
                    placeholder="English review"
                    className="min-h-24 w-full rounded-md border p-2 text-sm"
                    value={getLocalizedValue(testimonial.text, "en")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "text",
                        "en",
                        e.target.value,
                      )
                    }
                  />

                  <textarea
                    dir="rtl"
                    placeholder="المراجعة بالعربية"
                    className="min-h-24 w-full rounded-md border p-2 text-sm"
                    value={getLocalizedValue(testimonial.text, "ar")}
                    onChange={(e) =>
                      updateTestimonialLocalizedValue(
                        testimonial.id,
                        "text",
                        "ar",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* Delete */}
              {(props.testimonials?.length ?? 0) > 1 && (
                <button
                  type="button"
                  className="mt-1 w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                  onClick={() =>
                    updateProp(
                      selectedSection.id,
                      "testimonials",
                      (prev: any[] = []) =>
                        prev.filter((item) => item.id !== testimonial.id),
                    )
                  }
                >
                  Delete Testimonial
                </button>
              )}
            </div>
          ))}

          {/* Add */}
          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            onClick={() =>
              updateProp(
                selectedSection.id,
                "testimonials",
                (prev: any[] = []) => [
                  ...prev,
                  {
                    id: crypto.randomUUID(),

                    name: {
                      en: "New Customer",
                      ar: "عميل جديد",
                    },

                    handle: "@customer",

                    avatar: "NC",

                    role: {
                      en: "Verified Buyer",
                      ar: "مشتري موثّق",
                    },

                    rating: 5,

                    text: {
                      en: "Write your customer review here.",
                      ar: "اكتب تقييم العميل هنا.",
                    },
                  },
                ],
              )
            }
          >
            ➕ Add Testimonial
          </button>
        </div>
      </div>
    </div>
  );
}
