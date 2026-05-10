"use client";

import type { GitHubContributionCalendar } from "../preview/types";
import type {
  EditorDataBundle,
  MediaSlideItem,
  PortfolioEditorConfig,
  PortfolioProjectCard,
} from "./types";

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType = "text/plain;charset=utf-8",
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function createDeployNotes(username: string) {
  return `# Portfolio Export

Files exported from Portfolio Generator for ${username || "your portfolio"}.

## What to host

- \`portfolio-site.html\`
- Optional: \`portfolio-config.json\` as your editable source backup

## Quick hosting options

1. Rename \`portfolio-site.html\` to \`index.html\`
2. Upload it to any static host
3. Point your custom subdomain at that host

## Good fits

- Vercel static deployment
- Netlify drag-and-drop deploy
- GitHub Pages
- Cloudflare Pages
- Any VPS or shared hosting that serves static HTML

## Notes

- The exported HTML is self-contained and does not require Next.js to run
- If you make more edits in Portfolio Generator, export again to get the newest version
`;
}

export function createPortablePortfolioHtml(
  config: PortfolioEditorConfig,
  dataBundle: EditorDataBundle | null,
  username: string,
) {
  const theme = config.theme;
  const sections = config.sections.filter((section) => section.enabled);
  const title = escapeHtml(
    dataBundle?.profile.name
      ? `${dataBundle.profile.name}'s Portfolio`
      : username
        ? `${username}'s Portfolio`
        : "Portfolio",
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    :root {
      --page-bg: ${theme.pageBackground};
      --section-bg: ${theme.sectionBackground};
      --card-bg: ${theme.cardBackground};
      --text-main: ${theme.primaryText};
      --text-soft: ${theme.secondaryText};
      --border: ${withAlpha(theme.primaryText, 0.12)};
      --border-soft: ${withAlpha(theme.primaryText, 0.08)};
      --font: ${getStaticFontStack(theme.fontFamily)};
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at top, ${withAlpha(theme.primaryText, 0.08)}, transparent 28%), var(--page-bg);
      color: var(--text-main);
      font-family: var(--font);
    }
    a { color: inherit; text-decoration: none; }
    .page { max-width: 1200px; margin: 0 auto; padding: 32px 16px 56px; }
    .stack { display: grid; gap: 24px; }
    .section {
      background: var(--section-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 24px;
    }
    .eyebrow {
      font-size: 12px;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--text-soft);
      font-weight: 700;
      margin: 0 0 12px;
    }
    .title { margin: 0; font-size: 40px; line-height: 1.1; }
    .section-title { margin: 0; font-size: 32px; line-height: 1.15; }
    .body { color: var(--text-soft); line-height: 1.9; font-size: 16px; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border-soft);
      border-radius: 22px;
      padding: 18px;
    }
    .grid-2 { display: grid; gap: 18px; }
    .grid-3 { display: grid; gap: 18px; }
    .hero { display: grid; gap: 20px; }
    .hero-main { display: grid; gap: 20px; }
    .hero-meta { display: grid; gap: 8px; }
    .hero-avatar {
      width: 96px; height: 96px; border-radius: 28px; object-fit: cover;
      border: 1px solid var(--border);
    }
    .media {
      width: 100%; min-height: 260px; border-radius: 24px; overflow: hidden;
      border: 1px solid var(--border-soft); background: var(--card-bg);
      display: flex; align-items: end; padding: 24px;
      background-image: linear-gradient(180deg, ${withAlpha(theme.secondaryText, 0.08)}, transparent);
    }
    .media img, .media video { width: 100%; height: 100%; object-fit: cover; display: block; }
    .badge-list { display: flex; flex-wrap: wrap; gap: 10px; }
    .badge {
      border: 1px solid var(--border-soft);
      background: var(--card-bg);
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 14px;
    }
    .project-grid { display: grid; gap: 18px; }
    .project-card { display: grid; gap: 16px; height: 100%; }
    .meta-grid { display: grid; gap: 12px; }
    .meta-pill {
      background: var(--card-bg);
      border: 1px solid var(--border-soft);
      border-radius: 18px;
      padding: 16px;
    }
    .small-label {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.28em; color: var(--text-soft); font-weight: 700;
    }
    .actions {
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--text-main); color: #08111b; border-radius: 999px;
      padding: 12px 20px; font-weight: 700; margin-top: 12px;
    }
    .scroll-row { display: grid; gap: 18px; }
    .collage-grid { display: grid; gap: 18px; }
    .center { text-align: center; margin-left: auto; margin-right: auto; }
    .right { text-align: right; margin-left: auto; }
    .left { text-align: left; }
    .heatmap { display: grid; gap: 4px; grid-template-columns: repeat(${dataBundle?.contributionCalendar?.weeks.length ?? 0}, minmax(0, 1fr)); margin-top: 18px; }
    .heatmap-week { display: grid; gap: 4px; }
    .heatmap-day { aspect-ratio: 1 / 1; border-radius: 2px; min-width: 8px; }
    @media (min-width: 768px) {
      .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .project-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .hero { grid-template-columns: minmax(0, 1fr) 280px; align-items: start; }
      .hero-main { grid-template-columns: auto minmax(0, 1fr); align-items: start; }
      .meta-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .scroll-row { grid-auto-flow: column; grid-auto-columns: minmax(320px, 1fr); overflow-x: auto; padding-bottom: 4px; }
      .collage-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .collage-grid > :first-child { grid-column: span 2; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="stack">
      ${sections.map((section) => renderSection(section, dataBundle)).join("\n")}
    </div>
  </main>
</body>
</html>`;
}

function renderSection(
  section: PortfolioEditorConfig["sections"][number],
  dataBundle: EditorDataBundle | null,
) {
  if (section.type === "hero") {
    return `<section class="section hero">
      <div class="hero-main">
        <img class="hero-avatar" src="${escapeAttr(section.avatarUrl)}" alt="${escapeAttr(section.title)}" />
        <div>
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h1 class="title">${escapeHtml(section.title)}</h1>
          <div class="hero-meta">
            <div class="body">${escapeHtml(section.subtitle)}</div>
            <div class="body">${escapeHtml(section.handle)}</div>
          </div>
          <p class="body">${escapeHtml(section.bio)}</p>
        </div>
      </div>
      ${
        section.showHeroContact
          ? `<div class="card">
              <p class="eyebrow" style="margin-bottom:16px;">${escapeHtml(section.contactTitle)}</p>
              ${section.showGithubUrl ? renderContactLine(section.githubLabel, section.githubValue) : ""}
              ${section.showEmail ? renderContactLine(section.emailLabel, section.emailValue) : ""}
              ${section.showPhone ? renderContactLine(section.phoneLabel, section.phoneValue) : ""}
              ${section.showGithubButton ? `<a class="actions" href="${escapeAttr(section.githubButtonUrl || "#")}">${escapeHtml(section.githubButtonLabel)}</a>` : ""}
            </div>`
          : ""
      }
    </section>`;
  }

  if (section.type === "skills") {
    return `<section>
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="grid-2" style="margin-top:16px;">
        <article class="section">
          <h3 style="margin:0;">${escapeHtml(section.languagesTitle)}</h3>
          <div class="badge-list" style="margin-top:16px;">${section.languages
            .slice(0, section.itemCount)
            .map((item) => `<span class="badge">${escapeHtml(item)}</span>`)
            .join("")}</div>
        </article>
        <article class="section">
          <h3 style="margin:0;">${escapeHtml(section.rolesTitle)}</h3>
          <div class="badge-list" style="margin-top:16px;">${section.roles
            .slice(0, section.itemCount)
            .map((item) => `<span class="badge">${escapeHtml(item)}</span>`)
            .join("")}</div>
        </article>
      </div>
    </section>`;
  }

  if (section.type === "featured-project") {
    return `<section>
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="section grid-2" style="margin-top:16px;">
        ${renderProjectVisual(section.card)}
        ${renderProjectDetails(section.card, true)}
      </div>
    </section>`;
  }

  if (section.type === "projects-grid") {
    return `<section>
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="project-grid" style="margin-top:16px;">
        ${section.cards.slice(0, section.itemCount).map((card) => renderProjectGridCard(card)).join("")}
      </div>
    </section>`;
  }

  if (section.type === "text") {
    const alignClass =
      section.alignment === "center"
        ? "center"
        : section.alignment === "right"
          ? "right"
          : "left";

    return `<section class="section">
      <div class="${alignClass}" style="max-width:820px;">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        <h2 class="section-title">${escapeHtml(section.title)}</h2>
        <p class="body">${escapeHtml(section.description)}</p>
      </div>
    </section>`;
  }

  if (section.type === "mixed-media") {
    const media = renderMixedMediaBlock(section);
    const text = `<div>
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <p class="body">${escapeHtml(section.description)}</p>
    </div>`;

    return `<section class="section">
      <div class="grid-2" style="align-items:center;">
        ${section.mediaSide === "left" ? `${media}${text}` : `${text}${media}`}
      </div>
    </section>`;
  }

  if (section.type === "media-slide") {
    return `<section class="section">
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      ${section.showIntro ? `<p class="body">${escapeHtml(section.intro)}</p>` : ""}
      <div style="margin-top:18px;">${renderMediaHeroCard(section.media)}</div>
    </section>`;
  }

  if (section.type === "collage") {
    return `<section class="section">
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      ${section.showIntro ? `<p class="body">${escapeHtml(section.intro)}</p>` : ""}
      <div class="collage-grid" style="margin-top:18px;">
        ${section.items.map((item) => renderMediaCard(item)).join("")}
      </div>
    </section>`;
  }

  if (section.type === "highlights") {
    return `<section>
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="grid-3" style="margin-top:16px;">
        ${section.items.slice(0, section.itemCount).map((item) => `<article class="section"><h3 style="margin:0;">${escapeHtml(item.title)}</h3><p class="body">${escapeHtml(item.description)}</p></article>`).join("")}
      </div>
    </section>`;
  }

  if (section.type === "contributions") {
    const stats = [
      { key: "repos", value: String(dataBundle?.profile.public_repos ?? 0) },
      { key: "followers", value: String(dataBundle?.profile.followers ?? 0) },
      { key: "following", value: String(dataBundle?.profile.following ?? 0) },
      { key: "gists", value: String(dataBundle?.profile.public_gists ?? 0) },
    ];

    return `<section class="section">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="grid-2" style="margin-top:18px;">
        ${section.stats
          .filter((stat) => stat.enabled)
          .map((stat) => {
            const value = stats.find((item) => item.key === stat.key)?.value ?? "0";
            return renderMetaPill(stat.label, value);
          })
          .join("")}
      </div>
    </section>`;
  }

  if (section.type === "contribution-activity") {
    return `<section class="section">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="card" style="margin-top:18px;">
        <div class="small-label">${escapeHtml(
          `${dataBundle?.contributionCalendar?.totalContributions ?? 0} ${section.summarySuffix}`,
        )}</div>
        ${renderContributionHeatmap(dataBundle?.contributionCalendar)}
      </div>
    </section>`;
  }

  if (section.type === "socials") {
    return `<section class="section">
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="stack" style="margin-top:18px;">
        ${section.links
          .filter((link) => link.enabled)
          .map((link) => renderMetaPill(link.label, link.value || link.href || "Add link"))
          .join("")}
      </div>
    </section>`;
  }

  return `<section class="section">
    <h2 class="section-title">${escapeHtml(section.title)}</h2>
    <p class="body">${escapeHtml(section.description)}</p>
    <div class="grid-${Math.max(1, section.items.filter((item) => item.enabled).length)}" style="margin-top:18px;">
      ${section.items
        .filter((item) => item.enabled)
        .map((item) =>
          renderMetaPill(
            item.label,
            item.key === "github"
              ? section.githubUrl || "No link provided"
              : item.key === "email"
                ? section.email || "No email provided"
                : section.phone || "No phone provided",
          ),
        )
        .join("")}
    </div>
  </section>`;
}

function renderProjectVisual(card: PortfolioProjectCard) {
  if (card.imageUrl) {
    return `<div class="media" style="padding:0;"><img src="${escapeAttr(card.imageUrl)}" alt="${escapeAttr(card.title)}" /></div>`;
  }

  return `<div class="media">
    ${card.showImageLabel ? `<div><div class="small-label">${escapeHtml(card.imageLabel)}</div>${card.showImageTitle ? `<div style="margin-top:12px;font-size:28px;font-weight:700;">${escapeHtml(card.title)}</div>` : ""}</div>` : card.showImageTitle ? `<div style="font-size:28px;font-weight:700;">${escapeHtml(card.title)}</div>` : ""}
  </div>`;
}

function renderProjectDetails(card: PortfolioProjectCard, large: boolean) {
  return `<div style="display:grid;gap:18px;">
    <div class="meta-grid">
      ${card.showStars ? renderMetaPill(card.starsLabel, card.starsText) : ""}
      ${card.showTech ? renderMetaPill(card.techLabel, card.tech) : ""}
      ${card.showUpdated ? renderMetaPill(card.updatedLabel, card.updatedText) : ""}
    </div>
    <div>
      <div style="font-weight:700;">Project overview</div>
      <p class="body" style="font-size:${large ? "16px" : "14px"};">${escapeHtml(card.description)}</p>
    </div>
    ${card.showWhatILearned ? `<div class="card"><div style="font-weight:700;">${escapeHtml(card.whatILearnedTitle)}</div><p class="body">${escapeHtml(card.whatILearned)}</p></div>` : ""}
    ${card.repoUrl ? `<a class="actions" href="${escapeAttr(card.repoUrl)}">${escapeHtml(card.ctaLabel)}</a>` : ""}
  </div>`;
}

function renderProjectGridCard(card: PortfolioProjectCard) {
  const content = `<article class="section project-card">
    ${renderProjectVisual(card)}
    <div>
      <h3 style="margin:0 0 8px;font-size:28px;">${escapeHtml(card.title)}</h3>
      <p class="body">${escapeHtml(card.description)}</p>
    </div>
    ${card.showWhatILearned ? `<div class="card"><div style="font-weight:700;">${escapeHtml(card.whatILearnedTitle)}</div><p class="body">${escapeHtml(card.whatILearned)}</p></div>` : "<div></div>"}
    <div class="grid-2">
      ${card.showTech ? renderMetaPill(card.techLabel, card.tech) : ""}
      ${card.showUpdated ? renderMetaPill(card.updatedLabel, card.updatedText) : ""}
    </div>
  </article>`;

  if (card.clickable && card.repoUrl) {
    return `<a href="${escapeAttr(card.repoUrl)}">${content}</a>`;
  }

  return content;
}

function renderMixedMediaBlock(
  section: Extract<PortfolioEditorConfig["sections"][number], { type: "mixed-media" }>,
) {
  if (section.mediaUrl) {
    return `<div class="media" style="padding:0;"><img src="${escapeAttr(section.mediaUrl)}" alt="${escapeAttr(section.mediaAlt || section.title)}" /></div>`;
  }

  return `<div class="media">
    ${
      section.showMediaLabel
        ? `<div><div class="small-label">${escapeHtml(section.mediaLabel)}</div><div style="margin-top:12px;font-size:28px;font-weight:700;">${escapeHtml(section.title)}</div></div>`
        : `<div style="font-size:28px;font-weight:700;">${escapeHtml(section.title)}</div>`
    }
  </div>`;
}

function renderMediaHeroCard(item: MediaSlideItem) {
  return `<article class="card" style="padding:0;overflow:hidden;">
    ${
      item.url
        ? item.type === "video"
          ? `<video src="${escapeAttr(item.url)}" controls style="width:100%;height:420px;object-fit:cover;background:black;"></video>`
          : `<img src="${escapeAttr(item.url)}" alt="${escapeAttr(item.alt)}" style="width:100%;height:420px;object-fit:cover;display:block;" />`
        : `<div class="media" style="min-height:420px;"><div style="font-size:32px;font-weight:700;">${escapeHtml(item.caption || "Main media")}</div></div>`
    }
    ${item.caption ? `<div style="padding:20px;"><p class="body">${escapeHtml(item.caption)}</p></div>` : ""}
  </article>`;
}

function renderMediaCard(item: MediaSlideItem) {
  return `<article class="card" style="padding:0;overflow:hidden;">
    ${
      item.url
        ? item.type === "video"
          ? `<video src="${escapeAttr(item.url)}" controls style="width:100%;height:280px;object-fit:cover;background:black;"></video>`
          : `<img src="${escapeAttr(item.url)}" alt="${escapeAttr(item.alt)}" style="width:100%;height:280px;object-fit:cover;display:block;" />`
        : `<div class="media" style="min-height:280px;"><div style="font-size:24px;font-weight:700;">${escapeHtml(item.caption || "Media item")}</div></div>`
    }
    ${item.caption ? `<div style="padding:18px;"><p class="body">${escapeHtml(item.caption)}</p></div>` : ""}
  </article>`;
}

function renderMetaPill(label: string, value: string) {
  return `<div class="meta-pill"><div class="small-label">${escapeHtml(label)}</div><div style="margin-top:12px;font-weight:600;">${escapeHtml(value)}</div></div>`;
}

function renderContactLine(label: string, value: string) {
  return `<div style="margin-bottom:16px;"><div class="small-label">${escapeHtml(label)}</div><div style="margin-top:8px;">${escapeHtml(value)}</div></div>`;
}

function renderContributionHeatmap(calendar: GitHubContributionCalendar | null | undefined) {
  if (!calendar) {
    return `<p class="body">Contribution activity will appear here when available.</p>`;
  }

  return `<div class="heatmap">${calendar.weeks
    .map(
      (week) => `<div class="heatmap-week">${week.contributionDays
        .map(
          (day) =>
            `<div class="heatmap-day" style="background:${getContributionColor(day.contributionLevel)};" title="${escapeAttr(`${day.contributionCount} contributions on ${day.date}`)}"></div>`,
        )
        .join("")}</div>`,
    )
    .join("")}</div>`;
}

function getContributionColor(level: GitHubContributionCalendar["weeks"][number]["contributionDays"][number]["contributionLevel"]) {
  switch (level) {
    case "FIRST_QUARTILE":
      return "#9be564";
    case "SECOND_QUARTILE":
      return "#49c04d";
    case "THIRD_QUARTILE":
      return "#2ea043";
    case "FOURTH_QUARTILE":
      return "#1f7a36";
    case "NONE":
    default:
      return "rgba(255,255,255,0.06)";
  }
}

function getStaticFontStack(fontFamily: PortfolioEditorConfig["theme"]["fontFamily"]) {
  switch (fontFamily) {
    case "system":
      return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case "serif":
      return 'Georgia, Cambria, "Times New Roman", Times, serif';
    case "mono":
      return '"SFMono-Regular", ui-monospace, monospace';
    case "geist":
    default:
      return 'ui-sans-serif, system-ui, sans-serif';
  }
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return `rgba(255,255,255,${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value: string) {
  return escapeHtml(value);
}
