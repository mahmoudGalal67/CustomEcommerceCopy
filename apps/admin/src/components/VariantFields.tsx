import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { UploadCloud } from "lucide-react";
import { useGetColorsQuery } from "@/services/ColorSlice";
import { useGetSizesQuery } from "@/services/SizeSlice";

// Small component for each draggable image
function SortableImage({ image, onRemove }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.dndId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    scale: isDragging ? "1.05" : "1",
    zIndex: isDragging ? 50 : 1,
    boxShadow: isDragging ? "0 10px 25px rgba(0,0,0,0.5)" : undefined,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative group aspect-square rounded-lg overflow-hidden border bg-black">
        <img
          src={
            image.type === "existing"
              ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${image.file_path}`
              : image.previewUrl
          }
          alt="preview"
          className="h-full w-full object-cover cursor-grab active:cursor-grabbing"
          {...listeners}
        />
        <button
          type="button"
          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image);
          }}
        >
          ✕
        </button>

        {image.type === "existing" && (
          <span className="absolute bottom-1 left-1 text-[9px] bg-white text-black px-1 rounded">
            SAVED
          </span>
        )}
      </div>
    </div>
  );
}

export default function VariantFields({
  index,
  field,
  register,
  watch,
  setValue,
  remove,
  errors,
  setIsDirty,
}: any) {
  const selectedColor = watch(`variants.${index}.color_id`);
  const selectedSize = watch(`variants.${index}.size_id`);
  const images = watch(`variants.${index}.images_all`) ?? [];

  const deletedImages = watch(`variants.${index}.deleted_images`) || [];

  const { data: colors } = useGetColorsQuery();
  const { data: sizes } = useGetSizesQuery();

  // DnD sensors setup
  const sensors = useSensors(useSensor(PointerSensor));

  // Handle reordering
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i: any) => i.dndId === active.id);
    const newIndex = images.findIndex((i: any) => i.dndId === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);
    const reorderedWithOrder = reordered.map((img: any, i: number) => ({
      ...img,
      sort_order: i,
    }));
    setValue(`variants.${index}.images_all`, reorderedWithOrder);

    setIsDirty(true);
  };

  return (
    <div
      key={field.id}
      className="p-4 mb-6 rounded-xl bg-background border border-gray-700 space-y-4"
    >
      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-primary text-sm mb-2">Price</label>
          <input
            type="number"
            {...register(`variants.${index}.price`)}
            onChange={(e) => {
              register(`variants.${index}.price`).onChange(e);
              setIsDirty(true);
            }}
            className="w-full rounded-lg p-2 text-primary bg-background border border-gray-600"
          />
          {errors.variants?.[index]?.price && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.price?.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-primary text-sm mb-2">Stock</label>
          <input
            type="number"
            {...register(String(`variants.${index}.stock`))}
            onChange={(e) => {
              register(String(`variants.${index}.stock`)).onChange(e);
              setIsDirty(true);
            }}
            className="w-full rounded-lg p-2 bg-background border border-gray-600 text-primary"
          />
          {errors.variants?.[index]?.stock && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.stock?.message}
            </p>
          )}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-primary text-sm mb-2">Color</label>
        <div className="flex gap-4 flex-wrap">
          {colors?.map((color: any) => {
            const isSelected = selectedColor == color.id;
            return (
              <label
                key={color.id}
                className={`flex items-center gap-2 cursor-pointer border-2 rounded-full p-1 ${
                  isSelected ? "border-brimary" : "border-transparent"
                }`}
              >
                <input
                  type="radio"
                  value={String(color.id)}
                  {...register(String(`variants.${index}.color_id`))}
                  onChange={(e) => {
                    register(String(`variants.${index}.color_id`)).onChange(e);
                    setIsDirty(true);
                  }}
                  className="hidden"
                />
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
              </label>
            );
          })}
        </div>
        {errors.variants?.[index]?.color_id && (
          <p className="text-red-500 text-sm">
            {errors.variants[index]?.color_id?.message}
          </p>
        )}
      </div>

      {/* Sizes */}
      <div>
        <label className="block text-primary text-sm mb-2">Size</label>
        <div className="flex gap-4 flex-wrap">
          {sizes?.map((size) => {
            const isSelected = selectedSize == size.id;
            return (
              <label
                key={size.id}
                className={`w-10 h-10 flex items-center justify-center rounded-md border-2 cursor-pointer ${
                  isSelected ? "border-white" : "border-gray-600"
                }`}
              >
                <input
                  type="radio"
                  value={String(size.id)}
                  {...register(String(`variants.${index}.size_id`))}
                  onChange={(e) => {
                    register(String(`variants.${index}.size_id`)).onChange(e);
                    setIsDirty(true);
                  }}
                  className="hidden"
                />
                <span className="text-xs text-primary">{size.code}</span>
              </label>
            );
          })}
        </div>
        {errors.variants?.[index]?.size_id && (
          <p className="text-red-500 text-sm">
            {errors.variants[index]?.size_id?.message}
          </p>
        )}
      </div>

      {/* Image upload + DnD reorder */}
      {selectedColor && selectedSize && (
        <div>
          <label className="block text-primary text-sm mb-2">
            Upload Images
          </label>
          {/* Upload box */}
          <label
            htmlFor={`variants.${index}.images`}
            className={`
      flex flex-col items-center justify-center gap-2
      border-2 border-dashed rounded-xl p-6
      cursor-pointer transition
      hover:border-primary hover:bg-primary/5
      ${errors.variants?.[index]?.images_all ? "border-red-500" : "border-muted"}
    `}
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click or drag images here
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP (max 2MB)
            </p>

            <input
              id={`variants.${index}.images`}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).map((file) => ({
                  file,
                  previewUrl: URL.createObjectURL(file),
                  type: "new",
                  dndId: crypto.randomUUID(),
                }));

                setValue(
                  `variants.${index}.images_all`,
                  [...images, ...files],
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  },
                );

                setIsDirty(true);
              }}
            />
          </label>

          {/* Drag & Drop Preview */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]} // ✅ Limit drag direction
          >
            <SortableContext
              items={images.map((img: any) => img.dndId)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-5">
                {images?.map((img: any, i: number) => (
                  <SortableImage
                    key={img.dndId}
                    image={img}
                    index={i}
                    onRemove={(image: any) => {
                      if (image.type === "existing") {
                        setValue(
                          `variants.${index}.deleted_images`,
                          [...(deletedImages ?? []), image.file_path],
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      } else {
                        URL.revokeObjectURL(image.previewUrl);
                      }

                      setValue(
                        `variants.${index}.images_all`,
                        images.filter((img: any) => img.dndId !== image.dndId),
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );

                      setIsDirty(true);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {errors.variants?.[index]?.images_all && (
            <p className="text-red-500 text-sm">
              {errors.variants[index]?.images_all?.message as string}
            </p>
          )}
        </div>
      )}

      {/* Delete Variant */}
      <button
        type="button"
        className="text-red-400 text-sm mt-2 bg-muted-foreground p-2 rounded-2xl"
        onClick={() => {
          remove(index);
          setIsDirty(true);
        }}
      >
        ❌ Delete Variant
      </button>
    </div>
  );
}
