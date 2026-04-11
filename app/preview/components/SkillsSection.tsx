import { previewContent } from "../preview-config";

type SkillsSectionProps = {
  languages: string[];
  roles: string[];
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] px-4 py-2 text-sm font-medium text-white/90">
      {children}
    </span>
  );
}

export function SkillsSection({ languages, roles }: SkillsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--preview-text-soft)]">
          {previewContent.skills.title}
        </p>
        {previewContent.skills.description ? (
          <p className="max-w-3xl text-sm leading-7 text-[color:var(--preview-text-muted)] sm:text-base">
            {previewContent.skills.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-6">
          <h2 className="text-lg font-semibold text-white">Languages</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {languages.length > 0 ? (
              languages.map((language) => <Badge key={language}>{language}</Badge>)
            ) : (
              <p className="text-sm text-[color:var(--preview-text-soft)]">
                {previewContent.skills.emptyLanguages}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[color:var(--preview-surface-bg)] p-6">
          <h2 className="text-lg font-semibold text-white">
            {previewContent.skills.rolesTitle}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {roles.length > 0 ? (
              roles.map((role) => <Badge key={role}>{role}</Badge>)
            ) : (
              <p className="text-sm text-[color:var(--preview-text-soft)]">
                {previewContent.skills.emptyRoles}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
