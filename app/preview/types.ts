export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  email: string | null;
  phone?: string | null;
  blog?: string | null;
  twitter_username?: string | null;
  followers?: number;
  following?: number;
  public_repos?: number;
  public_gists?: number;
  html_url: string;
};

export type GitHubContributionDay = {
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  date: string;
  weekday: number;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubContributionMonth = {
  firstDay: string;
  name: string;
  totalWeeks: number;
  year: number;
};

export type GitHubContributionCalendar = {
  totalContributions: number;
  weeks: GitHubContributionWeek[];
  months: GitHubContributionMonth[];
};

export type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
};
