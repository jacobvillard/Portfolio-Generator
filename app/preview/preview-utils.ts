import { previewContent, previewRoleMap } from "./preview-config";
import type { GitHubRepo } from "./types";

const longDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function sortRepoPriority(data: GitHubRepo[]) {
  return data
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      if (a.stargazers_count > 0 && b.stargazers_count > 0) {
        return b.stargazers_count - a.stargazers_count;
      }

      if (a.stargazers_count > 0) return -1;
      if (b.stargazers_count > 0) return 1;

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
}

export function formatRepoName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

export function getProjectDescription(repo: GitHubRepo) {
  if (repo.description?.trim()) {
    return repo.description.trim();
  }

  if (repo.language) {
    return `A ${repo.language} repository focused on maintainable structure, practical delivery, and iterative improvement.`;
  }

  return previewContent.shared.fallbackProjectDescription;
}

export function getLearningText(repo: GitHubRepo) {
  if (repo.language) {
    return `Strengthened ${repo.language} fundamentals while improving project structure, delivery habits, and maintainable source control workflows.`;
  }

  return "Built stronger habits around project structure, iterative delivery, and maintainable development workflows.";
}

export function formatUpdatedAt(dateString: string) {
  return longDateFormatter.format(new Date(dateString));
}

export function extractLanguages(repos: GitHubRepo[]) {
  return Array.from(
    new Set(repos.map((repo) => repo.language).filter(Boolean) as string[]),
  );
}

export function extractSuggestedRoles(languages: string[]) {
  const roles = new Set<string>();

  languages.forEach((language) => {
    previewRoleMap[language]?.forEach((role) => roles.add(role));
  });

  if (roles.size === 0 && languages.length > 0) {
    roles.add("Software Developer");
  }

  return Array.from(roles);
}
