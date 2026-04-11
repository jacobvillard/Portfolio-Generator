import { previewContent } from "../preview-config";
import type { GitHubContributionCalendar } from "../types";

type ContributionActivityCardProps = {
  contributionCalendar: GitHubContributionCalendar | null;
};

export function ContributionActivityCard({
  contributionCalendar,
}: ContributionActivityCardProps) {
  if (!contributionCalendar) {
    return (
      <section className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-6 shadow-[var(--preview-shadow)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--preview-text-soft)]">
              GitHub Footprint
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {previewContent.contributionActivity.title}
            </h2>
          </div>
        </div>

        <div className="mt-5 rounded-[var(--preview-radius-lg)] border border-[color:var(--preview-border)] bg-[#0b1220] p-4">
          <p className="text-sm text-[color:var(--preview-text-muted)]">
            Contribution activity is available when a server-side `GITHUB_TOKEN`
            is configured for this app.
          </p>
        </div>
      </section>
    );
  }

  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekCount = contributionCalendar.weeks.length;
  const monthLabels = contributionCalendar.months
    .map((month) => {
      const weekIndex = contributionCalendar.weeks.findIndex((week) =>
        week.contributionDays.some((day) => day.date === month.firstDay),
      );

      return weekIndex >= 0
        ? {
            name: month.name,
            weekIndex,
          }
        : null;
    })
    .filter(Boolean) as { name: string; weekIndex: number }[];

  const levelClasses: Record<string, string> = {
    NONE: "bg-white/5",
    FIRST_QUARTILE: "bg-[#9be564]",
    SECOND_QUARTILE: "bg-[#49c04d]",
    THIRD_QUARTILE: "bg-[#2ea043]",
    FOURTH_QUARTILE: "bg-[#1f7a36]",
  };

  return (
    <section className="rounded-[var(--preview-radius-xl)] border border-[color:var(--preview-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-6 shadow-[var(--preview-shadow)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {previewContent.contributionActivity.title}
          </h2>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-[color:var(--preview-border)] bg-black/20 px-3 py-1 text-xs font-medium text-[color:var(--preview-text-muted)]">
          {contributionCalendar.totalContributions} contributions in the last year
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="w-full min-w-[720px]">
          <div className="relative mb-2 ml-10 h-4">
            {monthLabels.map((month) => (
              <span
                key={`${month.name}-${month.weekIndex}`}
                className="absolute text-xs text-[color:var(--preview-text-soft)]"
                style={{ left: `${(month.weekIndex / weekCount) * 100}%` }}
              >
                {month.name}
              </span>
            ))}
          </div>

          <div className="flex w-full gap-2">
            <div className="grid grid-rows-7 gap-1 pt-0.5 text-xs text-[color:var(--preview-text-soft)]">
              {weekdayLabels.map((label, index) => (
                <span key={label} className={index % 2 === 0 ? "invisible" : ""}>
                  {label}
                </span>
              ))}
            </div>

            <div
              className="grid flex-1 gap-1"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
              }}
            >
              {contributionCalendar.weeks.map((week) => (
                <div
                  key={week.contributionDays[0]?.date}
                  className="grid grid-rows-7 gap-1"
                >
                  {week.contributionDays.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.contributionCount} contributions on ${day.date}`}
                      className={`aspect-square w-full rounded-[2px] ${levelClasses[day.contributionLevel]}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
