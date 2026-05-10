"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type {
  GitHubContributionCalendar,
  GitHubProfile,
  GitHubRepo,
} from "../preview/types";
import { sortRepoPriority } from "../preview/preview-utils";
import {
  createInitialEditorConfig,
  createSectionFromType,
  defaultTheme,
  editorSectionLabels,
  ensureCardCount,
  getAvailableSectionTypes,
  moveItem,
  replaceSectionType,
  syncCardWithRepo,
} from "./editor-utils";
import {
  createDeployNotes,
  createPortablePortfolioHtml,
  downloadTextFile,
} from "./editor-export";
import {
  clearStoredPortfolioConfig,
  loadStoredPortfolioConfig,
  saveStoredPortfolioConfig,
} from "./editor-persistence";
import { LivePreview } from "./components/LivePreview";
import { SectionEditor } from "./components/SectionEditor";
import { SectionList } from "./components/SectionList";
import { ThemeEditor } from "./components/ThemeEditor";
import type {
  EditorDataBundle,
  EditorSectionConfig,
  EditorSectionType,
  PortfolioEditorConfig,
} from "./types";

export default function EditPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("user")?.trim() ?? "";

  const [usernameInput, setUsernameInput] = useState(username);
  const [config, setConfig] = useState<PortfolioEditorConfig | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [dataBundle, setDataBundle] = useState<EditorDataBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [storageState, setStorageState] = useState<"idle" | "loaded" | "saved">(
    "idle",
  );

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  useEffect(() => {
    if (!username || !config) {
      return;
    }

    saveStoredPortfolioConfig(username, config);
    setStorageState("saved");
  }, [config, username]);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!username) {
        setConfig(null);
        setDataBundle(null);
        setSelectedSectionId(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setCopyState("idle");
      setStorageState("idle");

      try {
        const response = await fetch(
          `/api/github-profile?user=${encodeURIComponent(username)}`,
        );

        if (!response.ok) {
          throw new Error(`Unable to load GitHub data for ${username}.`);
        }

        const result = (await response.json()) as {
          contributionCalendar: GitHubContributionCalendar | null;
          profile: GitHubProfile;
          repos: GitHubRepo[];
        };

        const sortedRepos = sortRepoPriority(result.repos);
        const nextBundle = {
          contributionCalendar: result.contributionCalendar,
          profile: result.profile,
          repos: sortedRepos,
        };

        const generatedConfig = createInitialEditorConfig(result.profile, sortedRepos);
        const storedConfig = loadStoredPortfolioConfig(username);
        const nextConfig = storedConfig ?? generatedConfig;

        setDataBundle(nextBundle);
        setConfig(nextConfig);
        setSelectedSectionId(nextConfig.sections[0]?.id ?? null);
        setStorageState(storedConfig ? "loaded" : "idle");
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading GitHub data.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [username]);

  const selectedSection = useMemo(
    () => config?.sections.find((section) => section.id === selectedSectionId) ?? null,
    [config, selectedSectionId],
  );

  function updateConfig(
    updater: (currentConfig: PortfolioEditorConfig) => PortfolioEditorConfig,
  ) {
    setConfig((currentConfig) => {
      if (!currentConfig) {
        return currentConfig;
      }

      return updater(currentConfig);
    });
  }

  function updateSection(nextSection: EditorSectionConfig) {
    if (!dataBundle) {
      return;
    }

    updateConfig((currentConfig) => ({
      ...currentConfig,
      sections: currentConfig.sections.map((section) => {
        if (section.id !== nextSection.id) {
          return section;
        }

        if (nextSection.type === "featured-project") {
          const previousRepoId =
            section.type === "featured-project" ? section.card.repoId : null;

          if (previousRepoId === nextSection.card.repoId) {
            return nextSection;
          }

          const repo = dataBundle.repos.find(
            (candidate) => candidate.id === nextSection.card.repoId,
          );

          return {
            ...nextSection,
            card: repo ? syncCardWithRepo(nextSection.card, repo) : nextSection.card,
          };
        }

        if (nextSection.type === "projects-grid") {
          const expandedCards = ensureCardCount(
            nextSection.cards,
            dataBundle.repos,
            Math.max(1, Math.min(12, nextSection.itemCount)),
          ).map((card) => {
            const previousCard =
              section.type === "projects-grid"
                ? section.cards.find((candidate) => candidate.id === card.id)
                : undefined;

            if (!card.repoId || previousCard?.repoId === card.repoId) {
              return card;
            }

            const repo = dataBundle.repos.find(
              (candidate) => candidate.id === card.repoId,
            );

            return repo ? syncCardWithRepo(card, repo) : card;
          });

          return {
            ...nextSection,
            itemCount: Math.max(1, Math.min(12, nextSection.itemCount)),
            cards: expandedCards,
          };
        }

        if (nextSection.type === "skills") {
          return {
            ...nextSection,
            itemCount: Math.max(1, Math.min(12, nextSection.itemCount)),
          };
        }

        if (nextSection.type === "highlights") {
          return {
            ...nextSection,
            itemCount: Math.max(1, Math.min(6, nextSection.itemCount)),
            items: nextSection.items.slice(0, 6),
          };
        }

        if (nextSection.type === "collage") {
          return {
            ...nextSection,
            items: nextSection.items.slice(0, 6),
          };
        }

        return nextSection;
      }),
    }));
  }

  function moveSection(sectionId: string, direction: "up" | "down") {
    updateConfig((currentConfig) => {
      const currentIndex = currentConfig.sections.findIndex(
        (section) => section.id === sectionId,
      );

      if (currentIndex === -1) {
        return currentConfig;
      }

      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      return {
        ...currentConfig,
        sections: moveItem(currentConfig.sections, currentIndex, nextIndex),
      };
    });
  }

  function toggleSection(sectionId: string) {
    updateConfig((currentConfig) => ({
      ...currentConfig,
      sections: currentConfig.sections.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section,
      ),
    }));
  }

  function removeSection(sectionId: string) {
    updateConfig((currentConfig) => {
      const nextSections = currentConfig.sections.filter(
        (section) => section.id !== sectionId,
      );

      if (selectedSectionId === sectionId) {
        setSelectedSectionId(nextSections[0]?.id ?? null);
      }

      return {
        ...currentConfig,
        sections: nextSections,
      };
    });
  }

  function addSection(type: EditorSectionType) {
    if (!dataBundle) {
      return;
    }

    updateConfig((currentConfig) => {
      if (currentConfig.sections.length >= 12) {
        return currentConfig;
      }

      const nextSection = createSectionFromType(type, {
        profile: dataBundle.profile,
        repos: dataBundle.repos,
      });

      setSelectedSectionId(nextSection.id);

      return {
        ...currentConfig,
        sections: [...currentConfig.sections, nextSection],
      };
    });
  }

  function changeSectionType(sectionId: string, nextType: EditorSectionType) {
    if (!dataBundle) {
      return;
    }

    updateConfig((currentConfig) => ({
      ...currentConfig,
      sections: currentConfig.sections.map((section) => {
        if (section.id !== sectionId || section.type === nextType) {
          return section;
        }

        return replaceSectionType(section, nextType, {
          profile: dataBundle.profile,
          repos: dataBundle.repos,
        });
      }),
    }));
  }

  async function copyConfigJson() {
    if (!config) {
      return;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function openProfile() {
    const trimmed = usernameInput.trim();

    if (!trimmed) {
      return;
    }

    router.push(`/edit?user=${encodeURIComponent(trimmed)}`);
  }

  function openPreview() {
    const trimmed = usernameInput.trim() || username;

    if (!trimmed) {
      return;
    }

    router.push(`/preview?user=${encodeURIComponent(trimmed)}`);
  }

  function downloadHtmlExport() {
    if (!config) {
      return;
    }

    const slug = (username || "portfolio").trim().toLowerCase() || "portfolio";

    downloadTextFile(
      `${slug}-site.html`,
      createPortablePortfolioHtml(config, dataBundle, username),
      "text/html;charset=utf-8",
    );
  }

  function downloadConfigExport() {
    if (!config) {
      return;
    }

    const slug = (username || "portfolio").trim().toLowerCase() || "portfolio";

    downloadTextFile(
      `${slug}-config.json`,
      JSON.stringify(config, null, 2),
      "application/json;charset=utf-8",
    );
  }

  function downloadDeployNotes() {
    const slug = (username || "portfolio").trim().toLowerCase() || "portfolio";

    downloadTextFile(
      `${slug}-deploy-notes.md`,
      createDeployNotes(username),
      "text/markdown;charset=utf-8",
    );
  }

  function resetLocalSave() {
    if (!username || !dataBundle) {
      return;
    }

    clearStoredPortfolioConfig(username);
    const freshConfig = createInitialEditorConfig(
      dataBundle.profile,
      dataBundle.repos,
    );
    setConfig(freshConfig);
    setSelectedSectionId(freshConfig.sections[0]?.id ?? null);
    setStorageState("idle");
  }

  const availableSectionTypes = config ? getAvailableSectionTypes(config.sections) : [];

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <header className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),rgba(255,255,255,0.04)] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
                Portfolio Generator
              </p>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Portfolio editor
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                  Customize the generated portfolio structure, theme, and content
                  while keeping the raw GitHub data separate from the editable
                  presentation layer.
                </p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                {storageState === "loaded"
                  ? "Loaded saved local version"
                  : storageState === "saved"
                    ? "Saved locally"
                    : "Using generated version"}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex min-w-[280px] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(event) => setUsernameInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      openProfile();
                    }
                  }}
                  placeholder="GitHub username"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={openProfile}
                  className="rounded-full border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
                >
                  Load
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openPreview}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Open preview
                </button>
                <button
                  type="button"
                  onClick={downloadHtmlExport}
                  disabled={!config}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Download site HTML
                </button>
                <button
                  type="button"
                  onClick={downloadConfigExport}
                  disabled={!config}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Download config
                </button>
                <button
                  type="button"
                  onClick={downloadDeployNotes}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Download deploy notes
                </button>
                <button
                  type="button"
                  onClick={copyConfigJson}
                  disabled={!config}
                  className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {copyState === "copied"
                    ? "Config copied"
                    : copyState === "error"
                      ? "Copy failed"
                      : "Copy config JSON"}
                </button>
                <button
                  type="button"
                  onClick={resetLocalSave}
                  disabled={!username || !dataBundle}
                  className="rounded-full border border-rose-400/20 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Reset saved version
                </button>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <div className="space-y-6">
            <ThemeEditor
              theme={config?.theme ?? defaultTheme}
              onChange={(theme) =>
                updateConfig((currentConfig) => ({ ...currentConfig, theme }))
              }
            />

            <SectionList
              sections={config?.sections ?? []}
              selectedSectionId={selectedSectionId}
              onAdd={addSection}
              onMove={moveSection}
              onRemove={removeSection}
              onSelect={setSelectedSectionId}
              onToggle={toggleSection}
              onTypeChange={changeSectionType}
            />

            <SectionEditor
              repos={dataBundle?.repos ?? []}
              section={selectedSection}
              onSectionChange={updateSection}
            />

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">Editor summary</p>
              <dl className="mt-4 grid gap-3 text-sm text-white/65">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt>Loaded profile</dt>
                  <dd>{username || "None"}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt>Local persistence</dt>
                  <dd>
                    {storageState === "loaded"
                      ? "Loaded from browser storage"
                      : storageState === "saved"
                        ? "Autosaving to browser storage"
                        : "Not saved yet"}
                  </dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt>Visible sections</dt>
                  <dd>{config?.sections.filter((section) => section.enabled).length ?? 0}</dd>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <dt>Available sections to add</dt>
                  <dd>
                    {availableSectionTypes.length > 0
                      ? availableSectionTypes
                          .map((type) => editorSectionLabels[type])
                          .join(", ")
                      : "12 section limit reached"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="xl:sticky xl:top-6 xl:self-start">
            {loading ? (
              <div className="flex min-h-[720px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-sm text-white/60">
                Loading GitHub content for the editor...
              </div>
            ) : (
              <LivePreview config={config} dataBundle={dataBundle} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
