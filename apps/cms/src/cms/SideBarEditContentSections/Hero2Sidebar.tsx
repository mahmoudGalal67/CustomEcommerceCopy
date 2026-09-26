import { useCMS } from "../store";
import { Input } from "@/components/ui/input";
import UploadButton from "@/components/UploadButton";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";

export default function Hero2Sidebar() {
  const { selectedSection, updateProp } = useCMS();

  if (!selectedSection || selectedSection.type !== "hero2") {
    return null;
  }

  const props = selectedSection.props as any;

  /* -------------------------------------------------------------- */
  /* Helpers */
  /* -------------------------------------------------------------- */

  const updateNestedProp = (parent: string, key: string, value: any) => {
    updateProp(selectedSection.id, parent, (prev: any = {}) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ========================================================== */}
      {/* HERO CONTENT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Hero Content</h3>

        {/* Badge */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Badge</label>

          <LocalizedInput
            placeholder="New"
            value={props.badge}
            onChange={(value) => updateProp(selectedSection.id, "badge", value)}
          />
        </div>

        {/* Title Line 1 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Title Line 1</label>

          <LocalizedInput
            placeholder="Title Line 1"
            value={props.titleLine1}
            onChange={(value) =>
              updateProp(selectedSection.id, "titleLine1", value)
            }
          />
        </div>

        {/* Highlight */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Highlight</label>

          <LocalizedInput
            placeholder="Highlight"
            value={props.titleHighlight}
            onChange={(value) =>
              updateProp(selectedSection.id, "titleHighlight", value)
            }
          />
        </div>

        {/* Title Line 3 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Title Line 3</label>

          <LocalizedInput
            placeholder="Title Line 3"
            value={props.titleLine3}
            onChange={(value) =>
              updateProp(selectedSection.id, "titleLine3", value)
            }
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">Description</label>

          <LocalizedTextarea
            placeholder="description"
            value={props.description}
            onChange={(value) =>
              updateProp(selectedSection.id, "description", value)
            }
          />
        </div>
      </div>
      {/* ========================================================== */}
      {/* BUTTONS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Buttons</h3>

        {/* Primary */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Primary Button
          </p>

          <LocalizedInput
            value={props.primaryButton?.text}
            placeholder="text"
            onChange={(value) =>
              updateNestedProp("primaryButton", "text", value)
            }
          />

          <Input
            placeholder="Button URL"
            value={props.primaryButton?.href ?? ""}
            onChange={(e) =>
              updateNestedProp("primaryButton", "href", e.target.value)
            }
          />
        </div>

        {/* Secondary */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
            Secondary Button
          </p>

          <LocalizedInput
            placeholder="text"
            value={props.secondaryButton?.text}
            onChange={(value) =>
              updateNestedProp("secondaryButton", "text", value)
            }
          />

          <Input
            placeholder="Button URL"
            value={props.secondaryButton?.href ?? ""}
            onChange={(e) =>
              updateNestedProp("secondaryButton", "href", e.target.value)
            }
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* STATS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Statistics</h3>

        <div className="flex flex-col gap-3">
          {(props.stats ?? []).map((stat: any, index: number) => (
            <div key={stat.id} className="rounded-md border p-3">
              <p className="mb-2 text-xs font-semibold text-gray-500">
                Stat {index + 1}
              </p>

              <LocalizedInput
                placeholder="value"
                value={stat.value}
                onChange={(value) =>
                  updateProp(selectedSection.id, "stats", (prev: any[] = []) =>
                    prev.map((item) =>
                      item.id === stat.id
                        ? {
                            ...item,
                            value,
                          }
                        : item,
                    ),
                  )
                }
              />
              <LocalizedInput
                value={stat.label}
                placeholder="label"
                onChange={(value) =>
                  updateProp(selectedSection.id, "stats", (prev: any[] = []) =>
                    prev.map((item) =>
                      item.id === stat.id
                        ? {
                            ...item,
                            label: value,
                          }
                        : item,
                    ),
                  )
                }
              />

              {/* Delete */}
              {(props.stats?.length ?? 0) > 1 && (
                <button
                  type="button"
                  className="mt-2 w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white"
                  onClick={() =>
                    updateProp(
                      selectedSection.id,
                      "stats",
                      (prev: any[] = []) =>
                        prev.filter((item) => item.id !== stat.id),
                    )
                  }
                >
                  Delete Stat
                </button>
              )}
            </div>
          ))}

          {/* Add Stat */}
          <button
            type="button"
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
            onClick={() =>
              updateProp(selectedSection.id, "stats", (prev: any[] = []) => [
                ...prev,
                {
                  id: crypto.randomUUID(),

                  value: {
                    en: "100+",
                    ar: "100+",
                  },

                  label: {
                    en: "New Stat",
                    ar: "إحصائية جديدة",
                  },
                },
              ])
            }
          >
            ➕ Add Stat
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* FEATURED PRODUCT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Featured Product</h3>

        {/* Badge */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium">Badge</label>

          <LocalizedInput
            placeholder="badge"
            value={props.featuredProduct?.badge}
            onChange={(value) =>
              updateNestedProp("featuredProduct", "badge", value)
            }
          />
        </div>

        {/* Brand */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium">Brand</label>

          <LocalizedInput
            placeholder="brand"
            value={props.featuredProduct?.brand}
            onChange={(value) =>
              updateNestedProp("featuredProduct", "brand", value)
            }
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium">Product Name</label>

          <LocalizedInput
            placeholder="name"
            value={props.featuredProduct?.name}
            onChange={(value) =>
              updateNestedProp("featuredProduct", "name", value)
            }
          />
        </div>

        {/* Price */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium">Price</label>

          <LocalizedInput
            placeholder="price"
            value={props.featuredProduct?.price}
            onChange={(value) =>
              updateNestedProp("featuredProduct", "price", value)
            }
          />
        </div>

        {/* Fallback */}
        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium">
            Fallback Text
          </label>

          <LocalizedInput
            placeholder="fallbackText"
            value={props.featuredProduct?.fallbackText}
            onChange={(value) =>
              updateNestedProp("featuredProduct", "fallbackText", value)
            }
          />
        </div>

        {/* Image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Image</label>

          <UploadButton
            selectedSection={selectedSection}
            slide={props.featuredProduct}
            parent="featuredProduct"
            updateProp={updateProp}
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* MINI PRODUCT */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Mini Product</h3>

        <LocalizedInput
          placeholder="brand"
          value={props.miniProduct?.brand}
          onChange={(value) => updateNestedProp("miniProduct", "brand", value)}
        />

        <LocalizedInput
          placeholder="name"
          value={props.miniProduct?.name}
          onChange={(value) => updateNestedProp("miniProduct", "name", value)}
        />

        <label className="mb-1 block text-sm font-medium">Image</label>

        <UploadButton
          selectedSection={selectedSection}
          slide={props.miniProduct}
          parent="miniProduct"
          updateProp={updateProp}
        />
      </div>

      {/* ========================================================== */}
      {/* REVIEWS */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Reviews</h3>

        <label className="mb-1 block text-sm font-medium">Rating</label>

        <Input
          type="number"
          min={0}
          max={5}
          step={1}
          value={props.reviews?.rating ?? 5}
          onChange={(e) =>
            updateNestedProp("reviews", "rating", Number(e.target.value))
          }
        />

        <label className="mb-1 mt-3 block text-sm font-medium">
          Review Text
        </label>

        <LocalizedInput
          placeholder="text"
          value={props.reviews?.text}
          onChange={(value) => updateNestedProp("reviews", "text", value)}
        />
      </div>

      {/* ========================================================== */}
      {/* SHIPPING */}
      {/* ========================================================== */}

      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">Shipping</h3>

        <LocalizedInput
          placeholder="title"
          value={props.shipping?.title}
          onChange={(value) => updateNestedProp("shipping", "title", value)}
        />

        <LocalizedInput
          placeholder="value"
          value={props.shipping?.value}
          onChange={(value) => updateNestedProp("shipping", "value", value)}
        />
      </div>
    </div>
  );
}
