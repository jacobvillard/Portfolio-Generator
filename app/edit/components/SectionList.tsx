"use client";

import {
  editorSectionLabels,
  getAvailableSectionTypes,
} from "../editor-utils";
import type { EditorSectionConfig, EditorSectionType } from "../types";

type SectionListProps = {
  sections: EditorSectionConfig[];
  selectedSectionId: string | null;
  onAdd: (type: EditorSectionType) => void;
  onMove: (sectionId: string, direction: "up" | "down") => void;
  onRemove: (sectionId: string) => void;
  onSelect: (sectionId: string) => void;
  onToggle: (sectionId: string) => void;
  onTypeChange: (sectionId: string, nextType: EditorSectionType) => void;
};

export function SectionList({
  sections,
  selectedSectionId,
  onAdd,
  onMove,
  onRemove,
  onSelect,
  onToggle,
  onTypeChange,
}: SectionListProps) {
  const availableTypes = getAvailableSectionTypes(sections);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Sections
        </p>
        <h2 className="text-xl font-semibold text-white">Structure</h2>
      </div>

      <div className="mt-5 space-y-3">
        {sections.map((section, index) => {
          return (
            <div
              key={section.id}
              className={`rounded-2xl border p-4 transition ${
                selectedSectionId === section.id
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(section.id)}
                  className="flex-1 text-left"
                >
                  <p className="text-sm font-semibold text-white">
                    {editorSectionLabels[section.type]}
                  </p>
                  <p className="mt-1 text-xs text-white/55">Position {index + 1}</p>
                </button>

                <label className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/75">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => onToggle(section.id)}
                    className="accent-white"
                  />
                  Visible
                </label>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
                <select
                  value={section.type}
                  onChange={(event) =>
                    onTypeChange(section.id, event.target.value as EditorSectionType)
                  }
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none"
                >
                  {(Object.keys(editorSectionLabels) as EditorSectionType[]).map((type) => (
                    <option key={type} value={type} className="bg-slate-950">
                      {editorSectionLabels[type]}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => onMove(section.id, "up")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => onMove(section.id, "down")}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(section.id)}
                  className="rounded-xl border border-rose-400/20 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-400/10"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="text-sm font-medium text-white">Add section</p>
        {availableTypes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onAdd(type)}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              >
                Add {editorSectionLabels[type]}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-white/55">
            12 section limit reached.
          </p>
        )}
      </div>
    </section>
  );
}
