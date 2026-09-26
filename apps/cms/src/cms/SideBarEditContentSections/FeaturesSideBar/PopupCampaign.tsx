import {
  useShowPopupCampaignQuery,
  useUpdatePopupCampaignMutation,
} from "@/services/PopupCampaign";
import { useEffect, useState } from "react";

export default function () {
  const { data } = useShowPopupCampaignQuery(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [updatePopup, { isLoading: isSaving }] =
    useUpdatePopupCampaignMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const [formData, setFormData] = useState({
    enabled: false,
    title: "Sale Offers",
    description: "Don't miss out on our exclusive sale offers!",
    image: "",
    button_text: "Shop Now",
    button_link: "#",
    delay_seconds: "120",
    show_once_days: "7",
    starts_at: "",
    ends_at: "",
  });

  // Fill form when data comes from API
  useEffect(() => {
    if (data) {
      setFormData({
        enabled: data.enabled ?? false,
        title: data.title ?? "Sale Offers",
        description: data.description ?? "",
        image: data.image ?? "",
        button_text: data.button_text ?? "",
        button_link: data.button_link ?? "",
        delay_seconds: data.delay_seconds ?? "",
        show_once_days: data.show_once_days ?? "",
        starts_at: data.starts_at ?? "",
        ends_at: data.ends_at ?? "",
      });
    }
  }, [data]);

  const handleToggle = async () => {
    const newEnabled = !formData.enabled;

    // update UI immediately
    setFormData((prev) => ({
      ...prev,
      enabled: newEnabled,
    }));

    // try {
    //     const updated = await updatePopup({
    //         data: {
    //             ...formData,
    //             title: formData.title || "Sale Offers",
    //             enabled: newEnabled,
    //         },
    //     }).unwrap();

    //     setFormData(updated);
    // } catch (error) {
    //     console.error(error);

    //     // rollback on failure
    //     setFormData((prev) => ({
    //         ...prev,
    //         enabled: !newEnabled,
    //     }));
    // }
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      payload.append("enabled", String(formData.enabled));
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("button_text", formData.button_text);
      payload.append("button_link", formData.button_link);
      payload.append("delay_seconds", String(formData.delay_seconds));
      payload.append("show_once_days", String(formData.show_once_days));
      payload.append("starts_at", formData.starts_at);
      payload.append("ends_at", formData.ends_at);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await updatePopup(payload).unwrap();

      alert("Popup Campaign updated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update Popup Campaign");
    }
  };

  return (
    <div className="max-w-2xl p-2">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="border-b px-2 py-6">
          <h1 className="text-2xl font-bold text-zinc-900">Popup Campaign</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Configure promotional popup settings.
          </p>

          {/* Enable */}
          <div className="flex items-center justify-between rounded-2xl border p-5 my-5">
            <div>
              <h3 className="font-semibold">Enable Popup</h3>

              <p className="text-sm text-zinc-500">
                Activate this popup campaign
              </p>
            </div>

            <button
              className={`
            relative h-8 w-14
            rounded-full transition-all duration-300 ${formData?.enabled ? "bg-emerald-500" : "bg-slate-300"} cursor-pointer`}
              onClick={handleToggle}
            >
              <span
                className={`
              absolute transition-all duration-300 ${formData?.enabled ? "left-7" : "left-1"} top-1 h-6 w-6 rounded-full bg-white`}
              />
            </button>
          </div>
        </div>

        {!!formData?.enabled && (
          <div>
            <div className="grid gap-8 p-8 grid-cols-1">
              {/* Left */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Summer Sale 2026"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>

                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your promotion..."
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Image Upload
                  </label>

                  <div className="rounded-2xl border-2 border-dashed border-zinc-300 p-8 text-center">
                    {preview || formData.image ? (
                      <div className="mt-4">
                        <img
                          src={
                            preview ||
                            `${import.meta.env.VITE_API_URL}/storage/${formData.image}`
                          }
                          alt="Preview"
                          className="max-h-60 rounded-xl border"
                        />
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeWidth="2"
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                          />
                        </svg>

                        <p className="mt-4 text-sm text-zinc-500">
                          Drag & drop image or click to upload
                        </p>
                      </>
                    )}
                    <input
                      type="file"
                      className="mt-4 block w-full"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-6">
                {/* Button Text */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Button Text
                  </label>

                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_text: e.target.value,
                      }))
                    }
                    placeholder="Shop Now"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Button Link
                  </label>

                  <input
                    value={formData.button_link}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_link: e.target.value,
                      }))
                    }
                    type="url"
                    placeholder="https://example.com"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Delay */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Delay (seconds)
                  </label>

                  <input
                    value={formData.delay_seconds}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        delay_seconds: e.target.value,
                      }))
                    }
                    type="number"
                    min="0"
                    placeholder="5"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Show Once */}
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Show Once Every X Days
                  </label>

                  <input
                    value={formData.show_once_days}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        show_once_days: e.target.value,
                      }))
                    }
                    type="number"
                    min="1"
                    placeholder="7"
                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Start Date
                    </label>

                    <input
                      value={formData.starts_at}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          starts_at: e.target.value,
                        }))
                      }
                      type="datetime-local"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      End Date
                    </label>

                    <input
                      value={formData.ends_at}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ends_at: e.target.value,
                        }))
                      }
                      type="datetime-local"
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-8 py-6">
              <button
                className="
        w-full rounded-2xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        py-4
        font-semibold
        text-white
        shadow-lg
        transition
        hover:scale-[1.01]
        cursor-pointer
      "
                onClick={handleSubmit}
              >
                {isSaving ? "Saving..." : " Save Popup Campaign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
