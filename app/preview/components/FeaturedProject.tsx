import { previewContent } from "../preview-config";
import {
  formatRepoName,
  formatUpdatedAt,
  getLearningText,
  getProjectDescription,
} from "../preview-utils";
import type { GitHubRepo } from "../types";

type FeaturedProjectProps = {
  repo: GitHubRepo;
};

export function FeaturedProject({ repo }: FeaturedProjectProps) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--preview-text-soft)]">
          {previewContent.featuredProject.title}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {formatRepoName(repo.name)}
        </h2>
      </div>

      <article className="grid gap-5 overflow-hidden rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border-strong)] bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[var(--preview-shadow)] lg:grid-cols-[1.1fr_1fr] lg:p-7">
        <div className="flex min-h-[220px] flex-col justify-between rounded-[calc(var(--preview-radius-xl)-0.5rem)] border border-dashed border-[color:var(--preview-border)] bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_50%),rgba(255,255,255,0.04)] p-5 lg:min-h-[280px]">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--preview-text-soft)]">
            {previewContent.featuredProject.imageLabel}
          </span>
          <div>
            <p className="text-2xl font-semibold text-white">Project spotlight</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--preview-text-muted)]">
              A larger presentation area reserved for future screenshots, generated cover images, or custom branding set by the portfolio owner.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Stars" value={repo.stargazers_count.toString()} />
              <Metric
                label="Language"
                value={repo.language || previewContent.shared.languageFallback}
              />
              <Metric
                label={previewContent.shared.updatedLabel}
                value={formatUpdatedAt(repo.updated_at)}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                {previewContent.featuredProject.descriptionLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--preview-text-muted)] sm:text-base">
                {getProjectDescription(repo)}
              </p>
            </div>

            <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">
                {previewContent.shared.learnedLabel}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--preview-text-muted)]">
                {getLearningText(repo)}
              </p>
            </div>
          </div>

          <div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              {previewContent.featuredProject.ctaLabel}
            </a>
          </div>
        </div>
      </article>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--preview-text-soft)]">
        {label}
      </p>
      <p className="mt-3 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
