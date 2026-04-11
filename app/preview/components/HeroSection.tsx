import Image from "next/image";

import { previewContent } from "../preview-config";
import type { GitHubProfile } from "../types";

type HeroSectionProps = {
  profile: GitHubProfile;
};

export function HeroSection({ profile }: HeroSectionProps) {
  const displayName = profile.name || profile.login;

  return (
    <section className="relative overflow-hidden rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border-strong)] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-4 shadow-[var(--preview-shadow)] sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--preview-page-accent),transparent_35%)]" />

      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[color:var(--preview-border-strong)] bg-white/10 shadow-lg sm:h-20 sm:w-20">
            <Image
              src={profile.avatar_url}
              alt={`${displayName} avatar`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>

          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--preview-text-soft)]">
              {previewContent.hero.eyebrow}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3rem] lg:leading-[1.05]">
              {displayName}&apos;s {previewContent.hero.titleSuffix}
            </h1>
            <p className="mt-2 text-base font-medium text-[color:var(--preview-text-muted)]">
              {previewContent.hero.subtitle}
            </p>
            <p className="mt-2 text-sm text-[color:var(--preview-text-soft)]">
              @{profile.login}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--preview-text-muted)]">
              {profile.bio || previewContent.hero.emptyBio}
            </p>
          </div>
        </div>

        <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/15 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--preview-text-soft)]">
            {previewContent.hero.contactTitle}
          </p>

          <div className="mt-2.5 space-y-2.5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--preview-text-soft)]">
                {previewContent.hero.emailLabel}
              </p>
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-1 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
                >
                  {profile.email}
                </a>
              ) : (
                <p className="mt-1 text-sm text-[color:var(--preview-text-soft)]">
                  {previewContent.hero.emailFallback}
                </p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--preview-text-soft)]">
                {previewContent.hero.phoneLabel}
              </p>
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone}`}
                  className="mt-1 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
                >
                  {profile.phone}
                </a>
              ) : (
                <p className="mt-1 text-sm text-[color:var(--preview-text-soft)]">
                  {previewContent.hero.phoneFallback}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border-strong)] bg-white px-4 py-1.5 text-sm font-semibold text-slate-950 transition duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              {previewContent.hero.githubButtonLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
