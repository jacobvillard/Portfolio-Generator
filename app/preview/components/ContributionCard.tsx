import { previewContent } from "../preview-config";
import type { GitHubProfile } from "../types";

type ContributionCardProps = {
  profile: GitHubProfile;
};

export function ContributionCard({ profile }: ContributionCardProps) {
  const stats = [
    {
      label: previewContent.contributions.reposLabel,
      value: profile.public_repos ?? 0,
    },
    {
      label: previewContent.contributions.followersLabel,
      value: profile.followers ?? 0,
    },
    {
      label: previewContent.contributions.followingLabel,
      value: profile.following ?? 0,
    },
    {
      label: previewContent.contributions.gistsLabel,
      value: profile.public_gists ?? 0,
    },
  ];

  return (
    <section className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-6 shadow-[var(--preview-shadow)]">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {previewContent.contributions.title}
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-4"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--preview-text-soft)]">
              {stat.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
