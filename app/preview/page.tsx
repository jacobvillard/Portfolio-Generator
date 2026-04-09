"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type GitHubProfile = {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    email: string | null;
    html_url: string;
};

type GitHubRepo = {
    id: number;
    name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
    fork: boolean;
};

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const username = searchParams.get("user");

    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [profile, setProfile] = useState<GitHubProfile | null>(null);
    const [loading, setLoading] = useState(true);

    function sortRepoPriority(data: GitHubRepo[]) {
        return data
            .filter((repo) => !repo.fork)
            .sort((a, b) => {
                if (a.stargazers_count > 0 && b.stargazers_count > 0) {
                    return b.stargazers_count - a.stargazers_count;
                }

                if (a.stargazers_count > 0) return -1;
                if (b.stargazers_count > 0) return 1;

                return (
                    new Date(b.updated_at).getTime() -
                    new Date(a.updated_at).getTime()
                );
            });
    }

    function getProjectDescription(repo: GitHubRepo) {
        if (repo.description) return repo.description;

        if (repo.language) {
            return `A ${repo.language} project built and maintained on GitHub.`;
        }

        return "A software project built and maintained on GitHub.";
    }

    function getLearningText(repo: GitHubRepo) {
        if (repo.language) {
            return `Built experience working with ${repo.language}, project structure, iteration, and source control.`;
        }

        return "Built experience in project structure, iteration, and source control.";
    }

    useEffect(() => {
        async function fetchGitHubData() {
            if (!username) return;

            try {
                const profileResponse = await fetch(
                    `https://api.github.com/users/${username}`
                );
                const profileData = await profileResponse.json();

                const reposResponse = await fetch(
                    `https://api.github.com/users/${username}/repos`
                );
                const reposData = await reposResponse.json();

                const sortedRepos = sortRepoPriority(reposData);

                setProfile(profileData);
                setRepos(sortedRepos.slice(0, 7)); // 1 featured + 6 cards
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

    const skills = useMemo(() => {
        const languageSet = new Set<string>();

        repos.forEach((repo) => {
            if (repo.language) {
                languageSet.add(repo.language);
            }
        });

        return Array.from(languageSet);
    }, [repos]);

    if (loading) {
        return (
            <main className="min-h-screen bg-black px-6 py-12 text-white">
                <div className="mx-auto max-w-6xl">
                    <p className="text-lg">Loading portfolio preview...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                {/* HERO */}
                {profile && (
                    <section className="mb-10 rounded-2xl border border-white/20 bg-white/5 p-8 shadow-lg">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-5">
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.login}
                                    className="h-24 w-24 rounded-full border border-white/20 object-cover"
                                />

                                <div>
                                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                                        Portfolio Preview
                                    </p>

                                    <h1 className="mt-1 text-4xl font-bold">
                                        {profile.name || profile.login}&apos;s Portfolio
                                    </h1>

                                    <p className="mt-2 text-lg text-white/70">
                                        Developer Portfolio
                                    </p>

                                    <p className="mt-3 text-sm text-white/60">
                                        @{profile.login}
                                    </p>

                                    <p className="mt-3 max-w-2xl text-sm text-white/80">
                                        {profile.bio || "No bio provided yet."}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={profile.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
                                >
                                    View GitHub
                                </a>

                                {profile.email && (
                                    <a
                                        href={`mailto:${profile.email}`}
                                        className="rounded-lg bg-white px-4 py-2 text-sm text-black transition hover:scale-105"
                                    >
                                        Contact
                                    </a>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* SKILLS */}
                <section className="mb-10">
                    <h2 className="mb-4 text-2xl font-semibold">Skills</h2>

                    <div className="flex flex-wrap gap-3">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-white/60">No skills detected yet.</p>
                        )}
                    </div>
                </section>

                {/* FEATURED PROJECT */}
                {featuredProject && (
                    <section className="mb-12">
                        <h2 className="mb-4 text-2xl font-semibold">Featured Project</h2>

                        <div className="grid gap-6 rounded-2xl border border-white/20 bg-white/5 p-6 shadow-lg md:grid-cols-2">
                            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-white/40">
                                Image Placeholder
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold">
                                        {featuredProject.name}
                                    </h3>

                                    <p className="mt-4 text-white/80">
                                        {getProjectDescription(featuredProject)}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
                                        <span>⭐ {featuredProject.stargazers_count}</span>
                                        <span>
                                            🧠 {featuredProject.language || "Unknown"}
                                        </span>
                                        <span>
                                            🕒{" "}
                                            {new Date(
                                                featuredProject.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-white/15 bg-black/30 p-4">
                                        <p className="text-sm font-semibold text-white">
                                            What I Learned
                                        </p>
                                        <p className="mt-2 text-sm text-white/70">
                                            {getLearningText(featuredProject)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <a
                                        href={featuredProject.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-105"
                                    >
                                        View Project
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* PROJECT GRID */}
                <section className="mb-12">
                    <h2 className="mb-4 text-2xl font-semibold">Projects</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {projectCards.map((repo) => (
                            <article
                                key={repo.id}
                                className="flex h-full flex-col rounded-2xl border border-white/20 bg-white/5 p-5 transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-4 flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-sm text-white/40">
                                    Image Placeholder
                                </div>

                                <h3 className="text-xl font-bold">{repo.name}</h3>

                                <p className="mt-3 text-sm text-white/75">
                                    {getProjectDescription(repo)}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
                                    <span>⭐ {repo.stargazers_count}</span>
                                    <span>🧠 {repo.language || "Unknown"}</span>
                                    <span>
                                        🕒 {new Date(repo.updated_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="mt-4 rounded-xl border border-white/15 bg-black/30 p-4">
                                    <p className="text-sm font-semibold text-white">
                                        What I Learned
                                    </p>
                                    <p className="mt-2 text-sm text-white/70">
                                        {getLearningText(repo)}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block rounded-lg border border-white/20 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
                                    >
                                        View Project
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* CONTACT */}
                {profile && (
                    <section className="rounded-2xl border border-white/20 bg-white/5 p-8 shadow-lg">
                        <h2 className="text-2xl font-semibold">Contact</h2>

                        <p className="mt-3 max-w-2xl text-sm text-white/75">
                            Interested in working together or learning more about these
                            projects? Get in touch or view the full GitHub profile.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {profile.email && (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-105"
                                >
                                    Email Me
                                </a>
                            )}

                            <a
                                href={profile.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-white/20 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
                            >
                                GitHub Profile
                            </a>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}