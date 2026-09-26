import { useRef, useState } from "react";
import api from "@/utilis/axios";

interface Props {
  selectedSection: any;
  slide: any;
  updateProp: Function;

  // Optional:
  // "slides" for banners
  // "featuredProduct" / "miniProduct" for Hero2
  parent?: string;
}

export default function UploadButton({
  selectedSection,
  slide,
  updateProp,
  parent = "slides",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      /* ====================================================== */
      /* 1. Delete old image */
      /* ====================================================== */

      if (slide.image) {
        await api.post("/delete-image", {
          url: slide.image,
        });
      }

      /* ====================================================== */
      /* 2. Upload new image */
      /* ====================================================== */

      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post("/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);

            setProgress(percent);
          }
        },
      });

      const imageUrl = res.data.url;

      /* ====================================================== */
      /* 3. Update CMS */
      /* ====================================================== */

      updateProp(selectedSection.id, parent, (prev: any = []) => {
        /* ============================================== */
        /* Array - Banner slides */
        /* ============================================== */

        if (Array.isArray(prev)) {
          return prev.map((item: any) =>
            item.id === slide.id
              ? {
                  ...item,
                  image: imageUrl,
                }
              : item,
          );
        }

        /* ============================================== */
        /* Object - Hero2 products */
        /* ============================================== */

        return {
          ...prev,
          image: imageUrl,
        };
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleChange}
      />

      <div
        onClick={handleClick}
        className="relative cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 text-center hover:border-blue-500 hover:bg-blue-50 shadow transition"
      >
        {/* ================================================== */}
        {/* Preview */}
        {/* ================================================== */}

        {slide.image ? (
          <img
            src={`${import.meta.env.VITE_API_URL}${slide.image}`}
            alt="preview"
            className="mx-auto mb-3 max-h-40 rounded-xl object-contain"
          />
        ) : (
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            ⬆️
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-700">
          {slide.image ? "Change Image" : "Upload Image"}
        </h3>

        {/* ================================================== */}
        {/* Progress */}
        {/* ================================================== */}

        {uploading && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-1 text-xs text-gray-500">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
