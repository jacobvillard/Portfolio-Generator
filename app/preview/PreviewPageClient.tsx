"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ContactSection } from "./components/ContactSection";
import { ContributionActivityCard } from "./components/ContributionActivityCard";
import { ContributionCard } from "./components/ContributionCard";
import { FeaturedProject } from "./components/FeaturedProject";
import { HeroSection } from "./components/HeroSection";
import { ProjectCard } from "./components/ProjectCard";
import { SkillsSection } from "./components/SkillsSection";
import { SocialLinksCard } from "./components/SocialLinksCard";
import {
  extractLanguages,
  extractSuggestedRoles,
  sortRepoPriority,
} from "./preview-utils";
import type {
  GitHubContributionCalendar,
  GitHubProfile,
  GitHubRepo,
} from "./types";

export default function PreviewPageClient() {
  const searchParams = useSearchParams();
  const username = searchParams.get("user");

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [contributionCalendar, setContributionCalendar] =
    useState<GitHubContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/github-profile?user=${encodeURIComponent(username)}`,
        );

        if (!response.ok) {
          throw new Error(`GitHub profile request failed: ${response.status}`);
        }

        const data = (await response.json()) as {
          contributionCalendar: GitHubContributionCalendar | null;
          profile: GitHubProfile;
          repos: GitHubRepo[];
        };

        const sortedRepos = sortRepoPriority(data.repos);

        setProfile(data.profile);
        setContributionCalendar(data.contributionCalendar);
        setRepos(sortedRepos.slice(0, 7));
      } catch (error) {
        console.log("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [username]);

  const featuredProject = repos[0];
  const projectCards = repos.slice(1, 7);

  const languages = useMemo(() => extractLanguages(repos), [repos]);
  const suggestedRoles = useMemo(
    () => extractSuggestedRoles(languages),
    [languages],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[color:var(--preview-page-bg)] px-6 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[var(--preview-max-width)]">
          <div className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-8">
            <p className="text-lg font-medium">Loading portfolio preview...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_28%),var(--preview-page-bg)] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto flex max-w-[var(--preview-max-width)] flex-col gap-6 lg:gap-7">
        {profile ? <HeroSection profile={profile} /> : null}

        {featuredProject ? <FeaturedProject repo={featuredProject} /> : null}

        <SkillsSection languages={languages} roles={suggestedRoles} />

        <section className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--preview-text-soft)]">
              Selected Projects
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              More work from GitHub
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {projectCards.map((repo) => (
              <ProjectCard key={repo.id} repo={repo} />
            ))}
          </div>
        </section>
        {profile ? (
          <section className="space-y-6">
            <ContributionCard profile={profile} />
            <ContributionActivityCard
              contributionCalendar={contributionCalendar}
            />
            <SocialLinksCard profile={profile} />
          </section>
        ) : null}

        {profile ? <ContactSection profile={profile} /> : null}
      </div>
    </main>
  );
}
