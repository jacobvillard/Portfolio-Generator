import { previewContent } from "../preview/preview-config";
import {
  extractLanguages,
  extractSuggestedRoles,
  formatRepoName,
  getLearningText,
  getProjectDescription,
  sortRepoPriority,
} from "../preview/preview-utils";
import type { GitHubProfile, GitHubRepo } from "../preview/types";
import type {
  ContactSectionConfig,
  ContributionActivitySectionConfig,
  ContributionsSectionConfig,
  EditorFontFamily,
  EditorSectionConfig,
  EditorSectionType,
  FeaturedProjectSectionConfig,
  HighlightsSectionConfig,
  HeroSectionConfig,
  MediaSlideSectionConfig,
  MixedMediaSectionConfig,
  PortfolioEditorConfig,
  PortfolioProjectCard,
  PortfolioTheme,
  ProjectsGridSectionConfig,
  SocialsSectionConfig,
  SkillsSectionConfig,
  TextSectionConfig,
} from "./types";

type EditorSeedContext = {
  profile: GitHubProfile;
  repos: GitHubRepo[];
};

export const editorFontOptions: Array<{
  label: string;
  value: EditorFontFamily;
}> = [
  { label: "Geist Sans", value: "geist" },
  { label: "System UI", value: "system" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "mono" },
];

export const editorSectionLabels: Record<EditorSectionType, string> = {
  hero: "Hero",
  skills: "Skills",
  "featured-project": "Featured Project",
  "projects-grid": "Projects Grid",
  text: "Text",
  "mixed-media": "Mixed Media",
  "media-slide": "Media Gallery",
  collage: "Collage",
  highlights: "Highlights",
  contributions: "Contributions",
  "contribution-activity": "Contribution Activity",
  socials: "Socials & Links",
  contact: "Contact",
};

export const defaultTheme: PortfolioTheme = {
  pageBackground: "#07111f",
  sectionBackground: "#121a24",
  cardBackground: "#0c141d",
  primaryText: "#f8fafc",
  secondaryText: "#b6c2d2",
  fontFamily: "geist",
};

export function getFontFamilyStack(fontFamily: EditorFontFamily) {
  switch (fontFamily) {
    case "system":
      return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case "serif":
      return 'Georgia, Cambria, "Times New Roman", Times, serif';
    case "mono":
      return '"Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, monospace';
    case "geist":
    default:
      return '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif';
  }
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "").trim();

  if (normalized.length !== 6) {
    return `rgba(255, 255, 255, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createMediaSlideItem(
  index: number,
  type: "image" | "video" = "image",
) {
  return {
    id: createId("media"),
    type,
    url: "",
    alt: type === "image" ? `Portfolio media ${index + 1}` : `Portfolio video ${index + 1}`,
    caption: type === "image" ? `Media item ${index + 1}` : `Video item ${index + 1}`,
  };
}

function createHighlightItem(index: number) {
  return {
    id: createId("highlight"),
    title: index === 0 ? "Process-led work" : `Highlight ${index + 1}`,
    description:
      index === 0
        ? "A good fit for explaining approach, impact, or the kind of projects you enjoy building."
        : "Use this card for achievements, values, focus areas, or standout strengths.",
  };
}

export function parseCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export function createProjectCardFromRepo(
  repo: GitHubRepo | undefined,
  index: number,
): PortfolioProjectCard {
  return {
    id: createId("project"),
    repoId: repo?.id ?? null,
    title: repo ? formatRepoName(repo.name) : `Project ${index + 1}`,
    description: repo
      ? getProjectDescription(repo)
      : previewContent.shared.fallbackProjectDescription,
    imageLabel:
      index === 0
        ? previewContent.featuredProject.imageLabel
        : previewContent.projects.imageLabel,
    imageUrl: "",
    whatILearnedTitle: previewContent.shared.learnedLabel,
    whatILearned: repo
      ? getLearningText(repo)
      : "Captured lessons from shipping, iteration, and maintainable project structure.",
    starsLabel: "Stars",
    starsText: String(repo?.stargazers_count ?? 0),
    techLabel: "Tech",
    tech: repo?.language ?? previewContent.shared.languageFallback,
    updatedLabel: previewContent.shared.updatedLabel,
    updatedText: formatUpdatedText(repo?.updated_at),
    repoUrl: repo?.html_url ?? "",
    ctaLabel:
      index === 0
        ? previewContent.featuredProject.ctaLabel
        : previewContent.projects.ctaLabel,
    showImageLabel: true,
    showImageTitle: true,
    showWhatILearned: true,
    showStars: index === 0,
    showTech: true,
    showUpdated: true,
    clickable: index !== 0,
  };
}

export function syncCardWithRepo(
  card: PortfolioProjectCard,
  repo: GitHubRepo | undefined,
): PortfolioProjectCard {
  if (!repo) {
    return {
      ...card,
      repoId: null,
    };
  }

  return {
    ...card,
    repoId: repo.id,
    title: formatRepoName(repo.name),
    description: getProjectDescription(repo),
    imageLabel: card.imageLabel,
    whatILearned: getLearningText(repo),
    starsText: String(repo.stargazers_count),
    tech: repo.language ?? previewContent.shared.languageFallback,
    repoUrl: repo.html_url,
    updatedText: formatUpdatedText(repo.updated_at),
  };
}

function getUnusedRepo(
  repos: GitHubRepo[],
  cards: PortfolioProjectCard[],
  excludedRepoIds: number[] = [],
) {
  const usedIds = new Set<number>([
    ...cards
      .map((card) => card.repoId)
      .filter((value): value is number => value !== null),
    ...excludedRepoIds,
  ]);

  return repos.find((repo) => !usedIds.has(repo.id));
}

export function ensureCardCount(
  cards: PortfolioProjectCard[],
  repos: GitHubRepo[],
  nextCount: number,
  excludedRepoIds: number[] = [],
) {
  const nextCards = [...cards];

  while (nextCards.length < nextCount) {
    const repo =
      getUnusedRepo(repos, nextCards, excludedRepoIds) ?? repos[nextCards.length];
    nextCards.push(createProjectCardFromRepo(repo, nextCards.length));
  }

  return nextCards.slice(0, nextCount);
}

export function getAvailableSectionTypes(sections: EditorSectionConfig[]) {
  if (sections.length >= 12) {
    return [];
  }

  return Object.keys(editorSectionLabels) as EditorSectionType[];
}

export function createSectionFromType(
  type: EditorSectionType,
  context: EditorSeedContext,
): EditorSectionConfig {
  const sortedRepos = sortRepoPriority(context.repos);
  const languages = extractLanguages(sortedRepos);
  const roles = extractSuggestedRoles(languages);

  switch (type) {
    case "hero":
      return {
        id: createId("section"),
        type: "hero",
        enabled: true,
        eyebrow: previewContent.hero.eyebrow,
        title: `${context.profile.name || context.profile.login}'s ${previewContent.hero.titleSuffix}`,
        subtitle: previewContent.hero.subtitle,
        handle: `@${context.profile.login}`,
        bio: context.profile.bio || previewContent.hero.emptyBio,
        avatarUrl: context.profile.avatar_url,
        contactTitle: previewContent.hero.contactTitle,
        githubValue: context.profile.html_url,
        emailValue: context.profile.email ?? previewContent.hero.emailFallback,
        phoneValue: context.profile.phone ?? previewContent.hero.phoneFallback,
        githubButtonUrl: context.profile.html_url,
        showHeroContact: true,
        showGithubUrl: false,
        showEmail: true,
        showPhone: true,
        showGithubButton: true,
        githubLabel: previewContent.hero.githubLabel,
        emailLabel: previewContent.hero.emailLabel,
        phoneLabel: previewContent.hero.phoneLabel,
        githubButtonLabel: previewContent.hero.githubButtonLabel,
      } satisfies HeroSectionConfig;
    case "skills":
      return {
        id: createId("section"),
        type: "skills",
        enabled: true,
        title: previewContent.skills.title,
        eyebrow: "Section",
        itemCount: 6,
        languagesTitle: "Languages",
        rolesTitle: previewContent.skills.rolesTitle,
        languages,
        roles,
      } satisfies SkillsSectionConfig;
    case "featured-project":
      return {
        id: createId("section"),
        type: "featured-project",
        enabled: true,
        title: previewContent.featuredProject.title,
        eyebrow: "Feature",
        card: createProjectCardFromRepo(sortedRepos[0], 0),
      } satisfies FeaturedProjectSectionConfig;
    case "projects-grid":
      return {
        id: createId("section"),
        type: "projects-grid",
        enabled: true,
        title: previewContent.projects.title,
        eyebrow: "Projects",
        itemCount: Math.min(6, Math.max(sortedRepos.length - 1, 1)),
        cards: ensureCardCount(
          sortedRepos
            .slice(1, 7)
            .map((repo, index) => createProjectCardFromRepo(repo, index + 1)),
          sortedRepos,
          Math.min(6, Math.max(sortedRepos.length - 1, 1)),
          sortedRepos[0] ? [sortedRepos[0].id] : [],
        ),
      } satisfies ProjectsGridSectionConfig;
    case "text":
      return {
        id: createId("section"),
        type: "text",
        enabled: true,
        title: "About this portfolio",
        eyebrow: "Overview",
        description:
          "Use this section for context that does not fit neatly into projects or skills, like your goals, working style, or the kind of opportunities you want to attract.",
        alignment: "left",
      } satisfies TextSectionConfig;
    case "mixed-media":
      return {
        id: createId("section"),
        type: "mixed-media",
        enabled: true,
        title: "Project story",
        eyebrow: "Mixed Media",
        description:
          "Pair written context with a supporting visual, screenshot, mockup, or branded image to make the portfolio feel more editorial.",
        mediaUrl: "",
        mediaAlt: "Portfolio supporting visual",
        mediaLabel: "Supporting visual",
        mediaSide: "right",
        showMediaLabel: true,
      } satisfies MixedMediaSectionConfig;
    case "media-slide":
      return {
        id: createId("section"),
        type: "media-slide",
        enabled: true,
        title: "Media gallery",
        eyebrow: "Showcase",
        intro:
          "Use this area for screenshots, prototype clips, before-and-after comparisons, or a compact mini case study.",
        showIntro: true,
        media: createMediaSlideItem(0),
      } satisfies MediaSlideSectionConfig;
    case "collage":
      return {
        id: createId("section"),
        type: "collage",
        enabled: true,
        title: "Visual collage",
        eyebrow: "Collage",
        intro:
          "Great for moodboards, side-by-side screenshots, branding sets, or a quick visual summary of your work.",
        showIntro: true,
        items: [
          createMediaSlideItem(0),
          createMediaSlideItem(1),
          createMediaSlideItem(2),
          createMediaSlideItem(3),
        ],
      };
    case "highlights":
      return {
        id: createId("section"),
        type: "highlights",
        enabled: true,
        title: "Highlights",
        eyebrow: "Snapshot",
        itemCount: 3,
        items: [createHighlightItem(0), createHighlightItem(1), createHighlightItem(2)],
      } satisfies HighlightsSectionConfig;
    case "contributions":
      return {
        id: createId("section"),
        type: "contributions",
        enabled: true,
        title: previewContent.contributions.title,
        stats: [
          { key: "repos", enabled: true, label: previewContent.contributions.reposLabel },
          { key: "followers", enabled: true, label: previewContent.contributions.followersLabel },
          { key: "following", enabled: true, label: previewContent.contributions.followingLabel },
          { key: "gists", enabled: true, label: previewContent.contributions.gistsLabel },
        ],
      } satisfies ContributionsSectionConfig;
    case "contribution-activity":
      return {
        id: createId("section"),
        type: "contribution-activity",
        enabled: true,
        title: previewContent.contributionActivity.title,
        summarySuffix: "contributions in the last year",
      } satisfies ContributionActivitySectionConfig;
    case "socials":
      const websiteUrl = normalizeWebsite(context.profile.blog);
      const twitterUrl = context.profile.twitter_username
        ? `https://x.com/${context.profile.twitter_username}`
        : "";

      return {
        id: createId("section"),
        type: "socials",
        enabled: true,
        title: previewContent.socials.title,
        links: [
          {
            key: "github",
            enabled: true,
            label: previewContent.socials.githubLabel,
            value: context.profile.html_url,
            href: context.profile.html_url,
          },
          {
            key: "website",
            enabled: Boolean(websiteUrl),
            label: previewContent.socials.websiteLabel,
            value: websiteUrl ?? "",
            href: websiteUrl ?? "",
          },
          {
            key: "twitter",
            enabled: Boolean(twitterUrl),
            label: previewContent.socials.twitterLabel,
            value: twitterUrl,
            href: twitterUrl,
          },
        ],
      } satisfies SocialsSectionConfig;
    case "contact":
      return {
        id: createId("section"),
        type: "contact",
        enabled: true,
        title: previewContent.contact.title,
        description: previewContent.contact.description,
        githubUrl: context.profile.html_url,
        email: context.profile.email ?? "",
        phone: context.profile.phone ?? "",
        items: [
          { key: "github", enabled: true, label: previewContent.contact.githubLabel },
          { key: "email", enabled: true, label: previewContent.contact.emailLabel },
          { key: "phone", enabled: true, label: previewContent.contact.phoneLabel },
        ],
      } satisfies ContactSectionConfig;
    default:
      return assertNever(type);
  }
}

export function createInitialEditorConfig(
  profile: GitHubProfile,
  repos: GitHubRepo[],
): PortfolioEditorConfig {
  const sortedRepos = sortRepoPriority(repos);
  const context = { profile, repos: sortedRepos };

  return {
    theme: defaultTheme,
    sections: [
      createSectionFromType("hero", context),
      createSectionFromType("featured-project", context),
      createSectionFromType("skills", context),
      createSectionFromType("projects-grid", context),
      createSectionFromType("contact", context),
    ],
  };
}

export function replaceSectionType(
  currentSection: EditorSectionConfig,
  nextType: EditorSectionType,
  context: EditorSeedContext,
) {
  const nextSection = createSectionFromType(nextType, context);

  return {
    ...nextSection,
    id: currentSection.id,
    enabled: currentSection.enabled,
  } satisfies EditorSectionConfig;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled section type: ${String(value)}`);
}

function formatUpdatedText(dateString: string | undefined) {
  if (!dateString) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

function normalizeWebsite(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}
