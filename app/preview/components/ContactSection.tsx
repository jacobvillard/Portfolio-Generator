import { previewContent } from "../preview-config";
import type { GitHubProfile } from "../types";

type ContactSectionProps = {
  profile: GitHubProfile;
};

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <section className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-6 shadow-[var(--preview-shadow)] sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {previewContent.contact.title}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--preview-text-muted)] sm:text-base">
        {previewContent.contact.description}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--preview-text-soft)]">
            {previewContent.contact.githubLabel}
          </p>
          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
          >
            {profile.html_url}
          </a>
        </div>

        <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--preview-text-soft)]">
            {previewContent.contact.emailLabel}
          </p>
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
            >
              {profile.email}
            </a>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--preview-text-soft)]">
              {previewContent.contact.emailFallback}
            </p>
          )}
        </div>

        <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--preview-text-soft)]">
            {previewContent.contact.phoneLabel}
          </p>
          {profile.phone ? (
            <a
              href={`tel:${profile.phone}`}
              className="mt-3 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
            >
              {profile.phone}
            </a>
          ) : (
            <p className="mt-3 text-sm text-[color:var(--preview-text-soft)]">
              {previewContent.contact.phoneFallback}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
