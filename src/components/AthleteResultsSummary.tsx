import type { AthleteComputed } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";
import { formatShuttleCell } from "@/lib/athleteDisplay";
import {
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";
import { FollowUpBadge } from "@/components/FollowUpBadge";

interface AthleteResultsSummaryProps {
  athlete: AthleteComputed;
}

/** Same fields as the scouting results table (for profile header). */
export function AthleteResultsSummary({ athlete }: AthleteResultsSummaryProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-saudi-green/25 bg-saudi-green/[0.03]">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-3 py-2">Athlete</th>
            <th className="px-3 py-2">Age</th>
            <th className="px-3 py-2">Sex</th>
            <th className="px-3 py-2">Region</th>
            <th className="px-3 py-2">Current sport</th>
            <th className="px-3 py-2">Pathway match</th>
            <th className="px-3 py-2">Follow-up</th>
            <th className="px-3 py-2">30m</th>
            <th className="px-3 py-2">VJ</th>
            <th className="px-3 py-2">IMTP</th>
            <th className="px-3 py-2">Shuttle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2.5 font-medium">{athlete.fullName}</td>
            <td className="px-3 py-2.5 tabular-nums">
              {athlete.ageYears ?? "—"}
            </td>
            <td className="px-3 py-2.5">{athlete.sex}</td>
            <td className="px-3 py-2.5">{athlete.region}</td>
            <td className="px-3 py-2.5">{athlete.primarySport}</td>
            <td className="px-3 py-2.5">
              <div className="flex flex-wrap gap-1">
                {athlete.matchedSports.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="border-saudi-green/20 bg-saudi-green/5 text-xs font-normal"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </td>
            <td className="px-3 py-2.5">
              <FollowUpBadge
                priority={athlete.coach.followUpPriority}
                showLabel={false}
              />
            </td>
            <td className="px-3 py-2.5 tabular-nums">
              {formatSprint(athlete.bestSprint30m)}
            </td>
            <td className="px-3 py-2.5 tabular-nums">
              {formatJump(athlete.bestVerticalJump)}
            </td>
            <td className="px-3 py-2.5 tabular-nums">
              {formatForce(athlete.bestMidThighPull)}
            </td>
            <td className="px-3 py-2.5 tabular-nums">
              {formatShuttleCell(
                athlete.shuttleRun.level,
                athlete.shuttleRun.shuttlesAchieved,
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
