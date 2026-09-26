"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";

interface EditableImageProps {
  active: boolean;
  src: string;
  alt?: string;
  onChange: (src: string) => void;
}

export default function EditableImage({
  active,
  src,
  alt = "",
  onChange,
}: EditableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!active) {
    return <img src={src} alt={alt} className="h-full w-full object-cover" />;
  }

  return (
    <div
      className="
        group/edit-image
        relative
        h-full
        w-full
        cursor-pointer
      "
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.click();
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />

      <div
        className="
          pointer-events-none
          absolute inset-0
          flex flex-col items-center justify-center
          bg-black/0
          opacity-0
          transition-all duration-200

          group-hover/edit-image:bg-black/50
          group-hover/edit-image:opacity-100
        "
      >
        <div
          className="
            flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-background
            text-foreground
            shadow-2xl
            transition-transform
            scale-90
            group-hover/edit-image:scale-100
          "
        >
          <ImagePlus className="h-6 w-6" />
        </div>

        <span
          className="
            mt-3
            rounded-full
            bg-background
            px-4 py-1.5
            text-xs font-semibold
            shadow-lg
          "
        >
          Change image
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFileChange(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
