"use client";

import { editorFontOptions } from "../editor-utils";
import type { PortfolioTheme } from "../types";

type ThemeEditorProps = {
  theme: PortfolioTheme;
  onChange: (theme: PortfolioTheme) => void;
};

export function ThemeEditor({ theme, onChange }: ThemeEditorProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
          Theme
        </p>
        <h2 className="text-xl font-semibold text-white">Visual style</h2>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <ColorField
          label="Page background"
          value={theme.pageBackground}
          onChange={(value) => onChange({ ...theme, pageBackground: value })}
        />
        <ColorField
          label="Section background"
          value={theme.sectionBackground}
          onChange={(value) => onChange({ ...theme, sectionBackground: value })}
        />
        <ColorField
          label="Card background"
          value={theme.cardBackground}
          onChange={(value) => onChange({ ...theme, cardBackground: value })}
        />
        <ColorField
          label="Primary text"
          value={theme.primaryText}
          onChange={(value) => onChange({ ...theme, primaryText: value })}
        />
        <ColorField
          label="Secondary text"
          value={theme.secondaryText}
          onChange={(value) => onChange({ ...theme, secondaryText: value })}
        />

        <label className="space-y-2">
          <span className="text-sm font-medium text-white">Font family</span>
          <select
            value={theme.fontFamily}
            onChange={(event) =>
              onChange({
                ...theme,
                fontFamily: event.target.value as PortfolioTheme["fontFamily"],
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition focus:border-white/30"
          >
            {editorFontOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950">
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

function ColorField({
  label,
  onChange,
  value,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-9 rounded-lg border border-white/10 bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
