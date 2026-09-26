import { useCMS } from "../store";
import { Input } from "@/components/ui/input";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface GeneralCountdownOffersProps {
  badge?: LocalizedText | string;

  titleBefore?: LocalizedText | string;
  titleHighlight?: LocalizedText | string;
  titleAfter?: LocalizedText | string;

  description?: LocalizedText | string;

  primaryButton?: {
    text?: LocalizedText | string;
    href?: string;
  };

  secondaryButton?: {
    text?: LocalizedText | string;
  };

  countdown?: {
    endDate?: string;
  };
}

type Language = "en" | "ar";

export default function GeneralCountdownOffersSidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "generalCountdownOffers") {
    return null;
  }

  const props = selectedSection.props as GeneralCountdownOffersProps;

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getLocalizedValue = (
    value: LocalizedText | string | undefined,
    lang: Language,
  ) => {
    if (!value) return "";

    // Backward compatibility with old string data
    if (typeof value === "string") {
      return value;
    }

    return value[lang] ?? value.en ?? "";
  };

  const updateLocalizedValue = (
    prop:
      | "badge"
      | "titleBefore"
      | "titleHighlight"
      | "titleAfter"
      | "description",
    lang: Language,
    value: string,
  ) => {
    updateProp(
      selectedSection.id,
      prop,
      (prev: LocalizedText | string = {}) => {
        const current: LocalizedText =
          typeof prev === "string" ? { en: prev } : prev;

        return {
          ...current,
          [lang]: value,
        };
      },
    );
  };

  const updateButtonText = (
    button: "primaryButton" | "secondaryButton",
    lang: Language,
    value: string,
  ) => {
    updateProp(selectedSection.id, button, (prev: any = {}) => {
      const currentText = prev.text;

      const current: LocalizedText =
        typeof currentText === "string"
          ? { en: currentText }
          : (currentText ?? {});

      return {
        ...prev,
        text: {
          ...current,
          [lang]: value,
        },
      };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ========================================================== */}
      {/* SALE CONTENT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Sale Content</h3>

        {/* ====================================================== */}
        {/* BADGE */}
        {/* ====================================================== */}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Badge</label>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Limited time — ends Sunday"
            value={getLocalizedValue(props.badge, "en")}
            onChange={(e) =>
              updateLocalizedValue("badge", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            placeholder="لفترة محدودة — ينتهي العرض يوم الأحد"
            value={getLocalizedValue(props.badge, "ar")}
            onChange={(e) =>
              updateLocalizedValue("badge", "ar", e.target.value)
            }
          />
        </div>

        {/* ====================================================== */}
        {/* TITLE BEFORE */}
        {/* ====================================================== */}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Title Before</label>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Up to"
            value={getLocalizedValue(props.titleBefore, "en")}
            onChange={(e) =>
              updateLocalizedValue("titleBefore", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            placeholder="خصم يصل إلى"
            value={getLocalizedValue(props.titleBefore, "ar")}
            onChange={(e) =>
              updateLocalizedValue("titleBefore", "ar", e.target.value)
            }
          />
        </div>

        {/* ====================================================== */}
        {/* HIGHLIGHT */}
        {/* ====================================================== */}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Highlight</label>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="40% off"
            value={getLocalizedValue(props.titleHighlight, "en")}
            onChange={(e) =>
              updateLocalizedValue("titleHighlight", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            placeholder="40%"
            value={getLocalizedValue(props.titleHighlight, "ar")}
            onChange={(e) =>
              updateLocalizedValue("titleHighlight", "ar", e.target.value)
            }
          />
        </div>

        {/* ====================================================== */}
        {/* TITLE AFTER */}
        {/* ====================================================== */}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">Title After</label>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="select styles."
            value={getLocalizedValue(props.titleAfter, "en")}
            onChange={(e) =>
              updateLocalizedValue("titleAfter", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            placeholder="على موديلات مختارة."
            value={getLocalizedValue(props.titleAfter, "ar")}
            onChange={(e) =>
              updateLocalizedValue("titleAfter", "ar", e.target.value)
            }
          />
        </div>

        {/* ====================================================== */}
        {/* DESCRIPTION */}
        {/* ====================================================== */}

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>

          <textarea
            dir="ltr"
            className="mb-2 min-h-24 w-full rounded-md border p-2 text-sm"
            placeholder="Sale description"
            value={getLocalizedValue(props.description, "en")}
            onChange={(e) =>
              updateLocalizedValue("description", "en", e.target.value)
            }
          />

          <textarea
            dir="rtl"
            className="min-h-24 w-full rounded-md border p-2 text-sm"
            placeholder="وصف العرض"
            value={getLocalizedValue(props.description, "ar")}
            onChange={(e) =>
              updateLocalizedValue("description", "ar", e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* BUTTONS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Buttons</h3>

        {/* ====================================================== */}
        {/* PRIMARY BUTTON */}
        {/* ====================================================== */}

        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
            Primary Button
          </p>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Shop The Sale"
            value={getLocalizedValue(props.primaryButton?.text, "en")}
            onChange={(e) =>
              updateButtonText("primaryButton", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            className="mb-2"
            placeholder="تسوق التخفيضات"
            value={getLocalizedValue(props.primaryButton?.text, "ar")}
            onChange={(e) =>
              updateButtonText("primaryButton", "ar", e.target.value)
            }
          />

          <Input
            dir="ltr"
            placeholder="Button URL"
            value={props.primaryButton?.href ?? ""}
            onChange={(e) =>
              updateProp(
                selectedSection.id,
                "primaryButton",
                (prev: any = {}) => ({
                  ...prev,
                  href: e.target.value,
                }),
              )
            }
          />
        </div>

        {/* ====================================================== */}
        {/* SECONDARY BUTTON */}
        {/* ====================================================== */}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
            Secondary Button
          </p>

          <Input
            dir="ltr"
            className="mb-2"
            placeholder="Use Code: STRYDE40"
            value={getLocalizedValue(props.secondaryButton?.text, "en")}
            onChange={(e) =>
              updateButtonText("secondaryButton", "en", e.target.value)
            }
          />

          <Input
            dir="rtl"
            placeholder="استخدم الكود: STRYDE40"
            value={getLocalizedValue(props.secondaryButton?.text, "ar")}
            onChange={(e) =>
              updateButtonText("secondaryButton", "ar", e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* COUNTDOWN */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Countdown</h3>

        <div>
          <label className="mb-1 block text-sm font-medium">
            End Date & Time
          </label>

          <Input
            type="datetime-local"
            value={
              props.countdown?.endDate
                ? props.countdown.endDate.slice(0, 16)
                : ""
            }
            onChange={(e) =>
              updateProp(selectedSection.id, "countdown", (prev: any = {}) => ({
                ...prev,
                endDate: e.target.value,
              }))
            }
          />

          <p className="mt-2 text-xs text-muted-foreground">
            The countdown will automatically update every second until this
            date.
          </p>
        </div>
      </div>
    </div>
  );
}
