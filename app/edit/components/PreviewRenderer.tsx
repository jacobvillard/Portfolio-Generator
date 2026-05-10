"use client";

import type { ReactNode } from "react";

import { getFontFamilyStack, hexToRgba } from "../editor-utils";
import type {
  EditorDataBundle,
  PortfolioEditorConfig,
  PortfolioProjectCard,
} from "../types";

type PreviewRendererProps = {
  config: PortfolioEditorConfig;
  dataBundle: EditorDataBundle | null;
};

export function PreviewRenderer({ config, dataBundle }: PreviewRendererProps) {
  const { theme } = config;
  const enabledSections = config.sections.filter((section) => section.enabled);
  const borderColor = hexToRgba(theme.primaryText, 0.12);
  const softBorderColor = hexToRgba(theme.primaryText, 0.08);
  const mutedText = theme.secondaryText;
  return (
    <div
      className="min-h-full rounded-[2rem] border p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:p-6"
      style={{
        background: `radial-gradient(circle at top, ${hexToRgba(theme.primaryText, 0.08)}, transparent 28%), ${theme.pageBackground}`,
        borderColor,
        color: theme.primaryText,
        fontFamily: getFontFamilyStack(theme.fontFamily),
      }}
    >
      <div className="flex flex-col gap-6">
        {enabledSections.map((section) => {
          if (section.type === "hero") {
            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-start">
                  <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={section.avatarUrl}
                      alt={section.title}
                      className="h-20 w-20 rounded-3xl border object-cover sm:h-24 sm:w-24"
                      style={{ borderColor }}
                    />
                    <div className="space-y-3">
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.35em]"
                        style={{ color: mutedText }}
                      >
                        {section.eyebrow}
                      </p>
                      <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                          {section.title}
                        </h1>
                        <p className="text-lg font-medium" style={{ color: mutedText }}>
                          {section.subtitle}
                        </p>
                        <p className="text-sm" style={{ color: mutedText }}>
                          {section.handle}
                        </p>
                      </div>
                      <p
                        className="max-w-3xl text-sm leading-7 sm:text-base"
                        style={{ color: mutedText }}
                      >
                        {section.bio}
                      </p>
                    </div>
                  </div>

                  {section.showHeroContact ? (
                    <div
                      className="rounded-[1.5rem] border p-4"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderColor: softBorderColor,
                      }}
                    >
                      <p
                        className="text-xs font-semibold uppercase tracking-[0.28em]"
                        style={{ color: mutedText }}
                      >
                        {section.contactTitle}
                      </p>
                      <div className="mt-4 space-y-4">
                        {section.showGithubUrl ? (
                          <HeroContactItem
                            label={section.githubLabel}
                            value={section.githubValue}
                            mutedText={mutedText}
                          />
                        ) : null}
                        {section.showEmail ? (
                          <HeroContactItem
                            label={section.emailLabel}
                            value={section.emailValue}
                            mutedText={mutedText}
                          />
                        ) : null}
                        {section.showPhone ? (
                          <HeroContactItem
                            label={section.phoneLabel}
                            value={section.phoneValue}
                            mutedText={mutedText}
                          />
                        ) : null}
                      </div>
                      {section.showGithubButton ? (
                        <a
                          href={section.githubButtonUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                          style={{ backgroundColor: theme.primaryText }}
                        >
                          {section.githubButtonLabel}
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          }

          if (section.type === "skills") {
            const languages = section.languages.slice(0, section.itemCount);
            const roles = section.roles.slice(0, section.itemCount);

            return (
              <section key={section.id} className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <SurfaceCard
                    title={section.languagesTitle}
                    borderColor={borderColor}
                    backgroundColor={theme.sectionBackground}
                  >
                    <BadgeList
                      items={languages}
                      backgroundColor={theme.cardBackground}
                      borderColor={softBorderColor}
                      textColor={theme.primaryText}
                    />
                  </SurfaceCard>
                  <SurfaceCard
                    title={section.rolesTitle}
                    borderColor={borderColor}
                    backgroundColor={theme.sectionBackground}
                  >
                    <BadgeList
                      items={roles}
                      backgroundColor={theme.cardBackground}
                      borderColor={softBorderColor}
                      textColor={theme.primaryText}
                    />
                  </SurfaceCard>
                </div>
              </section>
            );
          }

          if (section.type === "featured-project") {
            return (
              <section key={section.id} className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <article
                  className="grid gap-5 rounded-[1.75rem] border p-5 lg:grid-cols-[1.15fr_1fr] lg:p-6"
                  style={{
                    backgroundColor: theme.sectionBackground,
                    borderColor,
                  }}
                >
                  <ProjectVisual
                    card={section.card}
                    borderColor={softBorderColor}
                    cardBackground={theme.cardBackground}
                    secondaryText={mutedText}
                  />
                  <ProjectDetails
                    card={section.card}
                    cardBackground={theme.cardBackground}
                    borderColor={softBorderColor}
                    primaryText={theme.primaryText}
                    secondaryText={mutedText}
                    large
                  />
                </article>
              </section>
            );
          }

          if (section.type === "projects-grid") {
            const cards = section.cards.slice(0, section.itemCount);

            return (
              <section key={section.id} className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <div className="grid gap-4 xl:grid-cols-3">
                  {cards.map((card) => (
                    <ProjectGridCard
                      key={card.id}
                      card={card}
                      backgroundColor={theme.sectionBackground}
                      borderColor={borderColor}
                      cardBackground={theme.cardBackground}
                      softBorderColor={softBorderColor}
                      mutedText={mutedText}
                    />
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "text") {
            const alignmentClasses =
              section.alignment === "center"
                ? "mx-auto max-w-3xl text-center"
                : section.alignment === "right"
                  ? "ml-auto max-w-3xl text-right"
                  : "max-w-3xl";

            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-6 sm:p-7"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div className={`${alignmentClasses} space-y-3`}>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
                  <p
                    className="text-sm leading-8 sm:text-base"
                    style={{ color: mutedText }}
                  >
                    {section.description}
                  </p>
                </div>
              </section>
            );
          }

          if (section.type === "mixed-media") {
            const mediaBlock = (
              <MixedMediaVisual
                title={section.title}
                mediaAlt={section.mediaAlt}
                mediaLabel={section.mediaLabel}
                mediaUrl={section.mediaUrl}
                showMediaLabel={section.showMediaLabel}
                cardBackground={theme.cardBackground}
                borderColor={softBorderColor}
                mutedText={mutedText}
              />
            );

            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div
                  className={`grid gap-5 lg:grid-cols-2 lg:items-center ${
                    section.mediaSide === "left" ? "" : ""
                  }`}
                >
                  {section.mediaSide === "left" ? mediaBlock : null}
                  <div className="space-y-3">
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.35em]"
                      style={{ color: mutedText }}
                    >
                      {section.eyebrow}
                    </p>
                    <h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
                    <p
                      className="text-sm leading-8 sm:text-base"
                      style={{ color: mutedText }}
                    >
                      {section.description}
                    </p>
                  </div>
                  {section.mediaSide === "right" ? mediaBlock : null}
                </div>
              </section>
            );
          }

          if (section.type === "media-slide") {
            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div className="space-y-3">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
                  {section.showIntro ? (
                    <p
                      className="max-w-3xl text-sm leading-8 sm:text-base"
                      style={{ color: mutedText }}
                    >
                      {section.intro}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5">
                  {section.media ? (
                    <MediaHeroCard
                      item={section.media}
                      cardBackground={theme.cardBackground}
                      borderColor={softBorderColor}
                      mutedText={mutedText}
                    />
                  ) : (
                    <div
                      className="rounded-[1.25rem] border p-5 text-sm"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderColor: softBorderColor,
                        color: mutedText,
                      }}
                    >
                      Add media URLs in the editor to populate this section.
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (section.type === "collage") {
            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div className="space-y-3">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
                  {section.showIntro ? (
                    <p
                      className="max-w-3xl text-sm leading-8 sm:text-base"
                      style={{ color: mutedText }}
                    >
                      {section.intro}
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {section.items.length > 0 ? (
                    section.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={index === 0 ? "md:col-span-2 xl:row-span-2" : ""}
                      >
                        <MediaSlideCard
                          item={item}
                          cardBackground={theme.cardBackground}
                          borderColor={softBorderColor}
                          mutedText={mutedText}
                        />
                      </div>
                    ))
                  ) : (
                    <div
                      className="rounded-[1.25rem] border p-5 text-sm"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderColor: softBorderColor,
                        color: mutedText,
                      }}
                    >
                      Add collage media in the editor to populate this section.
                    </div>
                  )}
                </div>
              </section>
            );
          }

          if (section.type === "highlights") {
            const items = section.items.slice(0, section.itemCount);

            return (
              <section key={section.id} className="space-y-4">
                <div className="space-y-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.35em]"
                    style={{ color: mutedText }}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <SurfaceCard
                      key={item.id}
                      title={item.title}
                      borderColor={borderColor}
                      backgroundColor={theme.sectionBackground}
                    >
                      <p className="text-sm leading-7" style={{ color: mutedText }}>
                        {item.description}
                      </p>
                    </SurfaceCard>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "contributions") {
            const stats = [
              { key: "repos", value: String(dataBundle?.profile.public_repos ?? 0) },
              { key: "followers", value: String(dataBundle?.profile.followers ?? 0) },
              { key: "following", value: String(dataBundle?.profile.following ?? 0) },
              { key: "gists", value: String(dataBundle?.profile.public_gists ?? 0) },
            ];

            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {section.stats.filter((stat) => stat.enabled).map((stat) => (
                    <MetaPill
                      key={stat.key}
                      label={stat.label}
                      value={stats.find((item) => item.key === stat.key)?.value ?? "0"}
                      backgroundColor={theme.cardBackground}
                      borderColor={softBorderColor}
                      mutedText={mutedText}
                    />
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "contribution-activity") {
            const calendar = dataBundle?.contributionCalendar ?? null;

            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-2xl font-semibold">{section.title}</h2>
                  <div
                    className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-medium"
                    style={{
                      borderColor: softBorderColor,
                      backgroundColor: theme.cardBackground,
                      color: mutedText,
                    }}
                  >
                    {calendar?.totalContributions ?? 0} {section.summarySuffix}
                  </div>
                </div>

                {calendar ? (
                  <ContributionHeatmap
                    contributionCalendar={calendar}
                    mutedText={mutedText}
                    softBorderColor={softBorderColor}
                    theme={theme}
                  />
                ) : (
                  <div
                    className="mt-5 rounded-[1.25rem] border p-4 text-sm"
                    style={{
                      backgroundColor: theme.cardBackground,
                      borderColor: softBorderColor,
                      color: mutedText,
                    }}
                  >
                    Contribution activity appears here when a server-side GitHub token is configured.
                  </div>
                )}
              </section>
            );
          }

          if (section.type === "socials") {
            const visibleLinks = section.links.filter((link) => link.enabled);

            return (
              <section
                key={section.id}
                className="rounded-[1.75rem] border p-5 sm:p-6"
                style={{
                  backgroundColor: theme.sectionBackground,
                  borderColor,
                }}
              >
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <div className="mt-5 space-y-4">
                  {visibleLinks.length > 0 ? (
                    visibleLinks.map((link) => (
                      <ContactCard
                        key={link.key}
                        label={link.label}
                        value={link.value || link.href || "Add link"}
                        backgroundColor={theme.cardBackground}
                        borderColor={softBorderColor}
                        mutedText={mutedText}
                      />
                    ))
                  ) : (
                    <div
                      className="rounded-[1.25rem] border p-4 text-sm"
                      style={{
                        backgroundColor: theme.cardBackground,
                        borderColor: softBorderColor,
                        color: mutedText,
                      }}
                    >
                      No social links configured yet.
                    </div>
                  )}
                </div>
              </section>
            );
          }

          return (
            <section
              key={section.id}
              className="rounded-[1.75rem] border p-5 sm:p-6"
              style={{
                backgroundColor: theme.sectionBackground,
                borderColor,
              }}
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p
                  className="max-w-2xl text-sm leading-7 sm:text-base"
                  style={{ color: mutedText }}
                >
                  {section.description}
                </p>
              </div>

              <div
                className={`mt-5 grid gap-4 ${
                  Math.max(1, section.items.filter((item) => item.enabled).length) === 1
                    ? "md:grid-cols-1"
                    : Math.max(1, section.items.filter((item) => item.enabled).length) === 2
                      ? "md:grid-cols-2"
                      : "md:grid-cols-3"
                }`}
              >
                {section.items
                  .filter((item) => item.enabled)
                  .map((item) => (
                    <ContactCard
                      key={item.key}
                      label={item.label}
                      value={getContactValue(item.key, section)}
                      backgroundColor={theme.cardBackground}
                      borderColor={softBorderColor}
                      mutedText={mutedText}
                    />
                  ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function SurfaceCard({
  backgroundColor,
  borderColor,
  children,
  title,
}: {
  title: string;
  children: ReactNode;
  backgroundColor: string;
  borderColor: string;
}) {
  return (
    <article
      className="rounded-[1.5rem] border p-5"
      style={{ backgroundColor, borderColor }}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </article>
  );
}

function HeroContactItem({
  label,
  value,
  mutedText,
}: {
  label: string;
  value: string;
  mutedText: string;
}) {
  return (
    <div>
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.24em]"
        style={{ color: mutedText }}
      >
        {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function BadgeList({
  backgroundColor,
  borderColor,
  items,
  textColor,
}: {
  items: string[];
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-white/55">No items configured.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border px-3 py-2 text-sm"
          style={{
            backgroundColor,
            borderColor,
            color: textColor,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function MixedMediaVisual({
  borderColor,
  cardBackground,
  mediaAlt,
  mediaLabel,
  mediaUrl,
  mutedText,
  showMediaLabel,
  title,
}: {
  title: string;
  mediaUrl: string;
  mediaAlt: string;
  mediaLabel: string;
  showMediaLabel: boolean;
  cardBackground: string;
  borderColor: string;
  mutedText: string;
}) {
  if (mediaUrl) {
    return (
      <div
        className="relative overflow-hidden rounded-[1.5rem] border"
        style={{
          backgroundColor: cardBackground,
          borderColor,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt={mediaAlt || title}
          className="h-full min-h-[260px] w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[260px] flex-col justify-end rounded-[1.5rem] border p-5"
      style={{
        background: `linear-gradient(180deg, ${hexToRgba(mutedText, 0.08)}, transparent), ${cardBackground}`,
        borderColor,
      }}
    >
      {showMediaLabel ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: mutedText }}>
          {mediaLabel}
        </p>
      ) : null}
      <p className="mt-3 text-xl font-semibold">{title}</p>
    </div>
  );
}

function MediaSlideCard({
  borderColor,
  cardBackground,
  item,
  mutedText,
}: {
  item: {
    type: "image" | "video";
    url: string;
    alt: string;
    caption: string;
  };
  cardBackground: string;
  borderColor: string;
  mutedText: string;
}) {
  return (
    <article
      className="overflow-hidden rounded-[1.5rem] border"
      style={{
        backgroundColor: cardBackground,
        borderColor,
      }}
    >
      {item.url ? (
        item.type === "video" ? (
          <video src={item.url} controls className="h-[280px] w-full bg-black object-cover" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.url} alt={item.alt} className="h-[280px] w-full object-cover" />
        )
      ) : (
        <div
          className="flex h-[280px] items-end p-5"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(mutedText, 0.08)}, transparent), ${cardBackground}`,
          }}
        >
          <p className="text-lg font-semibold">{item.caption || "Media item"}</p>
        </div>
      )}
      {item.caption ? (
        <div className="p-4">
          <p className="text-sm leading-7" style={{ color: mutedText }}>
            {item.caption}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function MediaHeroCard({
  borderColor,
  cardBackground,
  item,
  mutedText,
}: {
  item: {
    type: "image" | "video";
    url: string;
    alt: string;
    caption: string;
  };
  cardBackground: string;
  borderColor: string;
  mutedText: string;
}) {
  return (
    <article
      className="overflow-hidden rounded-[1.5rem] border"
      style={{
        backgroundColor: cardBackground,
        borderColor,
      }}
    >
      {item.url ? (
        item.type === "video" ? (
          <video
            src={item.url}
            controls
            className="h-[320px] w-full bg-black object-cover sm:h-[420px]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt}
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        )
      ) : (
        <div
          className="flex h-[320px] items-end p-6 sm:h-[420px]"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(mutedText, 0.08)}, transparent), ${cardBackground}`,
          }}
        >
          <p className="text-2xl font-semibold">{item.caption || "Main media"}</p>
        </div>
      )}
      {item.caption ? (
        <div className="p-5">
          <p className="text-sm leading-7" style={{ color: mutedText }}>
            {item.caption}
          </p>
        </div>
      ) : null}
    </article>
  );
}

function ProjectVisual({
  borderColor,
  card,
  cardBackground,
  secondaryText,
}: {
  card: PortfolioProjectCard;
  borderColor: string;
  cardBackground: string;
  secondaryText: string;
}) {
  if (card.imageUrl) {
    return (
      <div
        className="relative overflow-hidden rounded-[1.25rem] border"
        style={{
          backgroundColor: cardBackground,
          borderColor,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className="flex h-full min-h-[180px] flex-col justify-end rounded-[1.25rem] border p-5"
      style={{
        background: `linear-gradient(180deg, ${hexToRgba(secondaryText, 0.08)}, transparent), ${cardBackground}`,
        borderColor,
      }}
    >
      {card.showImageLabel ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: secondaryText }}>
          {card.imageLabel}
        </p>
      ) : null}
      {card.showImageTitle ? (
        <p className="mt-3 text-xl font-semibold">{card.title}</p>
      ) : null}
    </div>
  );
}

function ProjectDetails({
  borderColor,
  card,
  cardBackground,
  large,
  primaryText,
  secondaryText,
}: {
  card: PortfolioProjectCard;
  cardBackground: string;
  borderColor: string;
  primaryText: string;
  secondaryText: string;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-5">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {card.showStars ? (
            <MetaPill label={card.starsLabel} value={card.starsText} backgroundColor={cardBackground} borderColor={borderColor} mutedText={secondaryText} />
          ) : null}
          {card.showTech ? (
            <MetaPill label={card.techLabel} value={card.tech} backgroundColor={cardBackground} borderColor={borderColor} mutedText={secondaryText} />
          ) : null}
          {card.showUpdated ? (
            <MetaPill label={card.updatedLabel} value={card.updatedText} backgroundColor={cardBackground} borderColor={borderColor} mutedText={secondaryText} />
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: primaryText }}>
            Project overview
          </p>
          <p className={`mt-3 leading-7 ${large ? "text-base" : "text-sm"}`} style={{ color: secondaryText }}>
            {card.description}
          </p>
        </div>
        {card.showWhatILearned ? (
          <div
            className="rounded-[1.25rem] border p-4"
            style={{
              backgroundColor: cardBackground,
              borderColor,
            }}
          >
            <p className="text-sm font-semibold">{card.whatILearnedTitle}</p>
            <p className="mt-3 text-sm leading-7" style={{ color: secondaryText }}>
              {card.whatILearned}
            </p>
          </div>
        ) : null}
      </div>

      <a
        href={card.repoUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
        style={{ backgroundColor: primaryText }}
      >
        {card.ctaLabel}
      </a>
    </div>
  );
}

function ProjectGridCard({
  backgroundColor,
  borderColor,
  card,
  cardBackground,
  mutedText,
  softBorderColor,
}: {
  card: PortfolioProjectCard;
  backgroundColor: string;
  borderColor: string;
  cardBackground: string;
  softBorderColor: string;
  mutedText: string;
}) {
  const content = (
    <article
      className="grid h-full grid-rows-[180px_auto_1fr_auto] gap-4 rounded-[1.5rem] border p-4 transition hover:-translate-y-1"
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <ProjectVisual
        card={card}
        borderColor={softBorderColor}
        cardBackground={cardBackground}
        secondaryText={mutedText}
      />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{card.title}</h3>
        <p className="text-sm leading-7" style={{ color: mutedText }}>
          {card.description}
        </p>
      </div>
      {card.showWhatILearned ? (
        <div
          className="rounded-[1.25rem] border p-4"
          style={{
            backgroundColor: cardBackground,
            borderColor: softBorderColor,
          }}
        >
          <p className="text-sm font-semibold">{card.whatILearnedTitle}</p>
          <p className="mt-2 text-sm leading-7" style={{ color: mutedText }}>
            {card.whatILearned}
          </p>
        </div>
      ) : (
        <div />
      )}
      <div className="grid gap-3 text-sm sm:grid-cols-2">
        {card.showTech ? (
          <MetaPill
            label={card.techLabel}
            value={card.tech}
            backgroundColor={cardBackground}
            borderColor={softBorderColor}
            mutedText={mutedText}
          />
        ) : null}
        {card.showUpdated ? (
          <MetaPill
            label={card.updatedLabel}
            value={card.updatedText}
            backgroundColor={cardBackground}
            borderColor={softBorderColor}
            mutedText={mutedText}
          />
        ) : null}
      </div>
    </article>
  );

  if (card.clickable && card.repoUrl) {
    return (
      <a href={card.repoUrl} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

function MetaPill({
  backgroundColor,
  borderColor,
  label,
  mutedText,
  value,
}: {
  label: string;
  value: string;
  backgroundColor: string;
  borderColor: string;
  mutedText: string;
}) {
  return (
    <div
      className="rounded-[1.25rem] border p-4"
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: mutedText }}>
        {label}
      </p>
      <p className="mt-3 text-sm font-medium">{value}</p>
    </div>
  );
}

function ContactCard({
  backgroundColor,
  borderColor,
  label,
  mutedText,
  value,
}: {
  label: string;
  value: string;
  backgroundColor: string;
  borderColor: string;
  mutedText: string;
}) {
  return (
    <div
      className="rounded-[1.25rem] border p-4"
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: mutedText }}>
        {label}
      </p>
      <p className="mt-3 text-sm leading-7">{value}</p>
    </div>
  );
}

function ContributionHeatmap({
  contributionCalendar,
  mutedText,
  softBorderColor,
  theme,
}: {
  contributionCalendar: NonNullable<EditorDataBundle["contributionCalendar"]>;
  mutedText: string;
  softBorderColor: string;
  theme: PortfolioEditorConfig["theme"];
}) {
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekCount = contributionCalendar.weeks.length;
  const monthLabels = contributionCalendar.months
    .map((month) => {
      const weekIndex = contributionCalendar.weeks.findIndex((week) =>
        week.contributionDays.some((day) => day.date === month.firstDay),
      );

      return weekIndex >= 0 ? { name: month.name, weekIndex } : null;
    })
    .filter(Boolean) as { name: string; weekIndex: number }[];

  const levelColors: Record<string, string> = {
    NONE: hexToRgba(theme.primaryText, 0.06),
    FIRST_QUARTILE: "#9be564",
    SECOND_QUARTILE: "#49c04d",
    THIRD_QUARTILE: "#2ea043",
    FOURTH_QUARTILE: "#1f7a36",
  };

  return (
    <div className="mt-5 overflow-x-auto">
      <div className="min-w-[720px]">
        <div className="relative mb-2 ml-10 h-4">
          {monthLabels.map((month) => (
            <span
              key={`${month.name}-${month.weekIndex}`}
              className="absolute text-xs"
              style={{ left: `${(month.weekIndex / weekCount) * 100}%`, color: mutedText }}
            >
              {month.name}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="grid grid-rows-7 gap-1 pt-0.5 text-xs" style={{ color: mutedText }}>
            {weekdayLabels.map((label, index) => (
              <span key={label} className={index % 2 === 0 ? "invisible" : ""}>
                {label}
              </span>
            ))}
          </div>

          <div
            className="grid flex-1 gap-1 rounded-[1.25rem] border p-3"
            style={{
              gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
              borderColor: softBorderColor,
              backgroundColor: theme.cardBackground,
            }}
          >
            {contributionCalendar.weeks.map((week) => (
              <div key={week.contributionDays[0]?.date} className="grid grid-rows-7 gap-1">
                {week.contributionDays.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.contributionCount} contributions on ${day.date}`}
                    className="aspect-square w-full rounded-[2px]"
                    style={{
                      backgroundColor: levelColors[day.contributionLevel],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getContactValue(
  key: "github" | "email" | "phone",
  section: Extract<PortfolioEditorConfig["sections"][number], { type: "contact" }>,
) {
  if (key === "github") {
    return section.githubUrl || "No link provided";
  }

  if (key === "email") {
    return section.email || "No email provided";
  }

  return section.phone || "No phone provided";
}
