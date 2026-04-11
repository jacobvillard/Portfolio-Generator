import { previewContent } from "../preview-config";
import type { GitHubProfile } from "../types";

type SocialLinksCardProps = {
  profile: GitHubProfile;
};

function normalizeWebsite(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export function SocialLinksCard({ profile }: SocialLinksCardProps) {
  const websiteUrl = normalizeWebsite(profile.blog);
  const twitterUrl = profile.twitter_username
    ? `https://x.com/${profile.twitter_username}`
    : null;
  const links = [
    {
      label: previewContent.socials.githubLabel,
      href: profile.html_url,
      text: profile.html_url,
    },
    ...(websiteUrl
      ? [
          {
            label: previewContent.socials.websiteLabel,
            href: websiteUrl,
            text: websiteUrl,
          },
        ]
      : []),
    ...(twitterUrl
      ? [
          {
            label: previewContent.socials.twitterLabel,
            href: twitterUrl,
            text: twitterUrl,
          },
        ]
      : []),
  ];

  return (
    <section className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-6 shadow-[var(--preview-shadow)]">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {previewContent.socials.title}
      </h2>

      <div className="mt-5 space-y-4">
        {links.map((link) => (
          <LinkRow
            key={link.label}
            label={link.label}
            href={link.href}
            text={link.text}
          />
        ))}
      </div>
    </section>
  );
}

function LinkRow({
  label,
  href,
  text,
}: {
  label: string;
  href?: string | null;
  text: string;
}) {
  return (
    <div className="rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-black/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--preview-text-soft)]">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-sm font-medium text-white underline decoration-white/25 underline-offset-4 transition hover:decoration-white"
        >
          {text}
        </a>
      ) : null}
    </div>
  );
}
