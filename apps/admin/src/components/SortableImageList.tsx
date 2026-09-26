import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableImage({
  id,
  url,
  onRemove,
}: {
  id: string;
  url: string;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex items-center gap-3 border p-2 rounded bg-gray-50 cursor-grab"
    >
      <img
        src={url}
        alt="uploaded"
        className="w-12 h-12 object-cover rounded"
      />
      <span className="text-xs text-gray-500">{id}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 ml-auto text-sm"
      >
        ✕
      </button>
    </div>
  );
}

export default function SortableImageList({
  images,
  onChange,
}: {
  images: string[];
  onChange: (newOrder: string[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      onChange(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={images} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 mt-2">
          {images.map((img) => (
            <SortableImage
              key={img}
              id={img}
              url={`/uploads/${img}`} // you can adjust this to your real URL or local preview
              onRemove={() => onChange(images.filter((item) => item !== img))}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
