import type {
  GitHubContributionCalendar,
  GitHubProfile,
  GitHubRepo,
} from "../preview/types";

export type EditorFontFamily = "geist" | "system" | "serif" | "mono";

export type PortfolioTheme = {
  pageBackground: string;
  sectionBackground: string;
  cardBackground: string;
  primaryText: string;
  secondaryText: string;
  fontFamily: EditorFontFamily;
};

export type PortfolioProjectCard = {
  id: string;
  repoId: number | null;
  title: string;
  description: string;
  imageLabel: string;
  imageUrl: string;
  whatILearnedTitle: string;
  whatILearned: string;
  starsLabel: string;
  starsText: string;
  techLabel: string;
  tech: string;
  updatedLabel: string;
  updatedText: string;
  repoUrl: string;
  ctaLabel: string;
  showImageLabel: boolean;
  showImageTitle: boolean;
  showWhatILearned: boolean;
  showStars: boolean;
  showTech: boolean;
  showUpdated: boolean;
  clickable: boolean;
};

type SectionBase<TType extends EditorSectionType> = {
  id: string;
  type: TType;
  enabled: boolean;
};

export type HeroSectionConfig = SectionBase<"hero"> & {
  eyebrow: string;
  title: string;
  subtitle: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  contactTitle: string;
  githubValue: string;
  emailValue: string;
  phoneValue: string;
  githubButtonUrl: string;
  showHeroContact: boolean;
  showGithubUrl: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showGithubButton: boolean;
  githubLabel: string;
  emailLabel: string;
  phoneLabel: string;
  githubButtonLabel: string;
};

export type SkillsSectionConfig = SectionBase<"skills"> & {
  title: string;
  eyebrow: string;
  itemCount: number;
  languagesTitle: string;
  rolesTitle: string;
  languages: string[];
  roles: string[];
};

export type FeaturedProjectSectionConfig = SectionBase<"featured-project"> & {
  title: string;
  eyebrow: string;
  card: PortfolioProjectCard;
};

export type ProjectsGridSectionConfig = SectionBase<"projects-grid"> & {
  title: string;
  eyebrow: string;
  itemCount: number;
  cards: PortfolioProjectCard[];
};

export type TextSectionConfig = SectionBase<"text"> & {
  title: string;
  eyebrow: string;
  description: string;
  alignment: "left" | "center" | "right";
};

export type MixedMediaSectionConfig = SectionBase<"mixed-media"> & {
  title: string;
  eyebrow: string;
  description: string;
  mediaUrl: string;
  mediaAlt: string;
  mediaLabel: string;
  mediaSide: "left" | "right";
  showMediaLabel: boolean;
};

export type MediaSlideItem = {
  id: string;
  type: "image" | "video";
  url: string;
  alt: string;
  caption: string;
};

export type MediaSlideSectionConfig = SectionBase<"media-slide"> & {
  title: string;
  eyebrow: string;
  intro: string;
  showIntro: boolean;
  media: MediaSlideItem;
};

export type CollageSectionConfig = SectionBase<"collage"> & {
  title: string;
  eyebrow: string;
  intro: string;
  showIntro: boolean;
  items: MediaSlideItem[];
};

export type HighlightItem = {
  id: string;
  title: string;
  description: string;
};

export type HighlightsSectionConfig = SectionBase<"highlights"> & {
  title: string;
  eyebrow: string;
  itemCount: number;
  items: HighlightItem[];
};

export type ContributionStatItem = {
  key: "repos" | "followers" | "following" | "gists";
  enabled: boolean;
  label: string;
};

export type ContributionsSectionConfig = SectionBase<"contributions"> & {
  title: string;
  stats: ContributionStatItem[];
};

export type ContributionActivitySectionConfig =
  SectionBase<"contribution-activity"> & {
    title: string;
    summarySuffix: string;
  };

export type SocialLinkItem = {
  key: string;
  enabled: boolean;
  label: string;
  value: string;
  href: string;
};

export type SocialsSectionConfig = SectionBase<"socials"> & {
  title: string;
  links: SocialLinkItem[];
};

export type ContactItem = {
  key: "github" | "email" | "phone";
  enabled: boolean;
  label: string;
};

export type ContactSectionConfig = SectionBase<"contact"> & {
  title: string;
  description: string;
  githubUrl: string;
  email: string;
  phone: string;
  items: ContactItem[];
};

export type EditorSectionConfig =
  | HeroSectionConfig
  | SkillsSectionConfig
  | FeaturedProjectSectionConfig
  | ProjectsGridSectionConfig
  | TextSectionConfig
  | MixedMediaSectionConfig
  | MediaSlideSectionConfig
  | CollageSectionConfig
  | HighlightsSectionConfig
  | ContributionsSectionConfig
  | ContributionActivitySectionConfig
  | SocialsSectionConfig
  | ContactSectionConfig;

export type EditorSectionType = EditorSectionConfig["type"];

export type PortfolioEditorConfig = {
  theme: PortfolioTheme;
  sections: EditorSectionConfig[];
};

export type EditorDataBundle = {
  contributionCalendar: GitHubContributionCalendar | null;
  profile: GitHubProfile;
  repos: GitHubRepo[];
};
