"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type {
  GitHubContributionCalendar,
  GitHubProfile,
  GitHubRepo,
} from "./types";
import { sortRepoPriority } from "./preview-utils";
import { createInitialEditorConfig } from "../edit/editor-utils";
import { createDeployNotes, createPortablePortfolioHtml, downloadTextFile } from "../edit/editor-export";
import { loadStoredPortfolioConfig } from "../edit/editor-persistence";
import { PreviewRenderer } from "../edit/components/PreviewRenderer";
import type { EditorDataBundle, PortfolioEditorConfig } from "../edit/types";

export default function PreviewPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("user")?.trim() ?? "";

  const [config, setConfig] = useState<PortfolioEditorConfig | null>(null);
  const [dataBundle, setDataBundle] = useState<EditorDataBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageState, setStorageState] = useState<"idle" | "loaded">("idle");

  useEffect(() => {
    async function fetchGitHubData() {
      if (!username) {
        setConfig(null);
        setDataBundle(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const response = await fetch(
          `/api/github-profile?user=${encodeURIComponent(username)}`,
        );

        if (!response.ok) {
          throw new Error(`GitHub profile request failed: ${response.status}`);
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
        const generatedConfig = createInitialEditorConfig(
          result.profile,
          sortedRepos,
        );
        const storedConfig = loadStoredPortfolioConfig(username);

        setDataBundle(nextBundle);
        setConfig(storedConfig ?? generatedConfig);
        setStorageState(storedConfig ? "loaded" : "idle");
      } catch (error) {
        console.log("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [username]);

  function openEditor() {
    if (!username) {
      return;
    }

    router.push(`/edit?user=${encodeURIComponent(username)}`);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
          <div className="flex min-h-[720px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] text-sm text-white/60">
            Loading portfolio preview...
          </div>
        </div>
      </main>
    );
  }

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
                  Portfolio preview
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">
                  Review the saved portfolio exactly as it will export, then jump
                  back into the editor to keep refining it.
                </p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                {storageState === "loaded"
                  ? "Showing saved local version"
                  : "Showing generated version"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openEditor}
                className="rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Open editor
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
            </div>
          </div>
        </header>

        {config ? (
          <PreviewRenderer config={config} dataBundle={dataBundle} />
        ) : (
          <div className="flex min-h-[480px] items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] px-6 text-center text-sm text-white/55">
            Load a GitHub username to preview the generated portfolio.
          </div>
        )}
      </div>
    </main>
  );
}
