"use client";

import type { GitHubRepo } from "../../preview/types";
import type { PortfolioProjectCard } from "../types";

type CardEditorProps = {
  card: PortfolioProjectCard;
  repos: GitHubRepo[];
  title: string;
  onCardChange: (nextCard: PortfolioProjectCard) => void;
};

export function CardEditor({
  card,
  repos,
  title,
  onCardChange,
}: CardEditorProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-white">{title}</h4>
        <p className="text-sm text-white/55">
          Override the repo-backed content whenever needed.
        </p>
      </div>

      <div className="mt-4 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-white">Repository binding</span>
          <select
            value={card.repoId ?? ""}
            onChange={(event) =>
              onCardChange({
                ...card,
                repoId: event.target.value ? Number(event.target.value) : null,
              })
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none"
          >
            <option value="" className="bg-slate-950">
              Manual entry
            </option>
            {repos.map((repo) => (
              <option key={repo.id} value={repo.id} className="bg-slate-950">
                {repo.name}
              </option>
            ))}
          </select>
        </label>

        <TextField
          label="Title"
          value={card.title}
          onChange={(value) => onCardChange({ ...card, title: value })}
        />

        <TextAreaField
          label="Description"
          rows={4}
          value={card.description}
          onChange={(value) => onCardChange({ ...card, description: value })}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Image label"
            value={card.imageLabel}
            onChange={(value) => onCardChange({ ...card, imageLabel: value })}
          />
          <TextField
            label="Image URL"
            value={card.imageUrl}
            onChange={(value) => onCardChange({ ...card, imageUrl: value })}
          />
        </div>

        <TextAreaField
          label="What I learned text"
          rows={4}
          value={card.whatILearned}
          onChange={(value) => onCardChange({ ...card, whatILearned: value })}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="What I learned title"
            value={card.whatILearnedTitle}
            onChange={(value) =>
              onCardChange({ ...card, whatILearnedTitle: value })
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Tech / language title"
            value={card.techLabel}
            onChange={(value) => onCardChange({ ...card, techLabel: value })}
          />
          <TextField
            label="Tech / language text"
            value={card.tech}
            onChange={(value) => onCardChange({ ...card, tech: value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Updated box title"
            value={card.updatedLabel}
            onChange={(value) => onCardChange({ ...card, updatedLabel: value })}
          />
          <TextField
            label="Updated text"
            value={card.updatedText}
            onChange={(value) => onCardChange({ ...card, updatedText: value })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Repository link"
            value={card.repoUrl}
            onChange={(value) => onCardChange({ ...card, repoUrl: value })}
          />
          <ToggleField
            label="Whole card clickable"
            checked={card.clickable}
            onChange={(checked) => onCardChange({ ...card, clickable: checked })}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ToggleField
            label="Show image label"
            checked={card.showImageLabel}
            onChange={(checked) =>
              onCardChange({ ...card, showImageLabel: checked })
            }
          />
          <ToggleField
            label="Show title in image box"
            checked={card.showImageTitle}
            onChange={(checked) =>
              onCardChange({ ...card, showImageTitle: checked })
            }
          />
          <ToggleField
            label="Show What I learned"
            checked={card.showWhatILearned}
            onChange={(checked) =>
              onCardChange({ ...card, showWhatILearned: checked })
            }
          />
          <ToggleField
            label="Show stars box"
            checked={card.showStars}
            onChange={(checked) => onCardChange({ ...card, showStars: checked })}
          />
          <ToggleField
            label="Show tech box"
            checked={card.showTech}
            onChange={(checked) => onCardChange({ ...card, showTech: checked })}
          />
          <ToggleField
            label="Show updated box"
            checked={card.showUpdated}
            onChange={(checked) => onCardChange({ ...card, showUpdated: checked })}
          />
        </div>
      </div>
    </div>
  );
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function TextAreaField({
  label,
  onChange,
  rows,
  value,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function ToggleField({
  checked,
  label,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-3 py-3 text-sm text-white">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  );
}
