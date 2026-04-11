import { previewContent } from "../preview-config";
import {
  formatRepoName,
  formatUpdatedAt,
  getLearningText,
  getProjectDescription,
} from "../preview-utils";
import type { GitHubRepo } from "../types";

type ProjectCardProps = {
  repo: GitHubRepo;
};

export function ProjectCard({ repo }: ProjectCardProps) {
  return (
    <article className="grid h-full grid-rows-[160px_auto_1fr_auto_auto] gap-4 rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-5 transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:bg-[color:var(--preview-surface-bg-strong)] hover:shadow-[var(--preview-shadow)]">
      <div className="flex items-end rounded-[var(--preview-radius-lg)] border border-dashed border-[color:var(--preview-border)] bg-[linear-gradient(180deg,rgba(125,211,252,0.12),rgba(255,255,255,0.02))] p-4">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--preview-text-soft)]">
          {previewContent.projects.imageLabel}
        </span>
      </div>

      <div className="min-h-[4.5rem]">
        <h3 className="text-xl font-semibold tracking-tight text-white">
          {formatRepoName(repo.name)}
        </h3>
      </div>

      <p className="text-sm leading-7 text-[color:var(--preview-text-muted)]">
        {getProjectDescription(repo)}
      </p>

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <MetaItem
          label="Language"
          value={repo.language || previewContent.shared.languageFallback}
        />
        <MetaItem
          label={previewContent.shared.updatedLabel}
          value={formatUpdatedAt(repo.updated_at)}
        />
      </dl>

      <div className="space-y-4">
        <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">
            {previewContent.shared.learnedLabel}
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--preview-text-muted)]">
            {getLearningText(repo)}
          </p>
        </div>

        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border-strong)] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-white hover:text-slate-950"
        >
          {previewContent.projects.ctaLabel}
        </a>
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-white/5 p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--preview-text-soft)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm text-white">{value}</dd>
    </div>
  );
}
