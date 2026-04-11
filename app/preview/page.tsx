"use client";

export { default } from "./PreviewPageClient";
/*
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

                {/ * SKILLS * /}
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

                {/ * FEATURED PROJECT * /}
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

                {/ * PROJECT GRID * /}
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

                {/ * CONTACT * /}
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
*/
