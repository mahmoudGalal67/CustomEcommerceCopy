import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import { useCMS } from "./store";
import AddSectionModal from "./AddSectionModal";
import type { SectionType } from "./Types";

export default function SectionWrapper({ section, index, children }: any) {
  const {
    selectedId,
    setSelectedId,
    deleteSection,
    moveSection,
    addSection,
    setShowAdd,
    showAdd,
  } = useCMS();

  const active = selectedId === section.id;
  return (
    <div
      data-section-id={section.id}
      className={`relative mb-4 group ${active ? "ring-4 ring-blue-500 rounded shadow" : ""}`}
      onClick={() => setSelectedId(section.id)}
    >
      {active && (
        <div className="absolute -top-4 right-4 flex gap-2 bg-white shadow rounded p-1 z-10">
          <button
            type="button"
            className="cursor-pointer hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              setShowAdd(true);
            }}
          >
            <Plus size={16} color="blue" />
          </button>

          <button
            type="button"
            className="cursor-pointer hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              deleteSection(section.id);
            }}
          >
            <Trash2 size={16} color="red" />
          </button>

          <button
            type="button"
            className="cursor-pointer hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(index, index - 1);
            }}
          >
            <ArrowUp size={16} color="green" />
          </button>

          <button
            type="button"
            className="cursor-pointer hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(index, index + 1);
            }}
          >
            <ArrowDown size={16} />
          </button>
        </div>
      )}

      {children}

      {showAdd && (
        <div onClick={(e) => e.stopPropagation()}>
          <AddSectionModal
            onSelect={(type: SectionType) => {
              addSection(index, type);
              setShowAdd(false);
            }}
            onClose={() => setShowAdd(false)}
          />
        </div>
      )}
    </div>
  );
}
