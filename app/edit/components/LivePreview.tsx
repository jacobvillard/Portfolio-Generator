"use client";

import type { EditorDataBundle, PortfolioEditorConfig } from "../types";
import { PreviewRenderer } from "./PreviewRenderer";

type LivePreviewProps = {
  dataBundle: EditorDataBundle | null;
  config: PortfolioEditorConfig | null;
};

export function LivePreview({ config, dataBundle }: LivePreviewProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-3 sm:p-4">
      <div className="mb-4 flex items-center justify-between gap-3 px-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            Live preview
          </p>
          <h2 className="text-xl font-semibold text-white">Portfolio canvas</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">
          Updates instantly
        </span>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-1 xl:max-h-[calc(100vh-11rem)]">
        {config ? (
          <PreviewRenderer config={config} dataBundle={dataBundle} />
        ) : (
          <div className="flex min-h-[480px] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-black/20 px-6 text-center text-sm text-white/55">
            Load a GitHub username to start editing the generated portfolio.
          </div>
        )}
      </div>
    </section>
  );
}
