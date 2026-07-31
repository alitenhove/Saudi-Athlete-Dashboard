import type { AthleteComputed } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AthleteResultsSummary } from "@/components/AthleteResultsSummary";
import { AthleteProgressChart } from "@/components/AthleteProgressChart";
import { resolveTestHistory } from "@/lib/testHistory";
import {
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";

interface AthleteProfileProps {
  athlete: AthleteComputed;
}

function AttemptRow({
  label,
  a1,
  a2,
  a3,
  best,
  format,
}: {
  label: string;
  a1: number | null;
  a2: number | null;
  a3: number | null;
  best: number | null;
  format: (v: number | null) => string;
}) {
  return (
    <div className="rounded-md border border-border/80 bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Badge variant="secondary">Best: {format(best)}</Badge>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <span>A1: {format(a1)}</span>
        <span>A2: {format(a2)}</span>
        <span>A3: {format(a3)}</span>
      </div>
    </div>
  );
}

export function AthleteProfile({ athlete }: AthleteProfileProps) {
  const history = resolveTestHistory(athlete);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{athlete.fullName}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest combine · {athlete.eventDate}
        </p>
      </div>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Results (matches table)
        </h3>
        <AthleteResultsSummary athlete={athlete} />
      </section>

      <AthleteProgressChart history={history} athleteName={athlete.fullName} />

      <Separator />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Additional profile
        </h3>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Date of birth</dt>
            <dd>
              {athlete.dateOfBirth || "—"}
              {athlete.ageYears != null ? ` (${athlete.ageYears} yrs)` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Height / weight</dt>
            <dd>
              {athlete.heightCm != null ? `${athlete.heightCm} cm` : "—"} ·{" "}
              {athlete.weightKg != null ? `${athlete.weightKg} kg` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sport referral</dt>
            <dd>{athlete.coach.sportReferral}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Record created</dt>
            <dd>{athlete.createdAt.slice(0, 10)}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Testing detail (all attempts)
        </h3>
        <AttemptRow
          label="30m sprint (speed)"
          a1={athlete.sprint30m.attempt1}
          a2={athlete.sprint30m.attempt2}
          a3={athlete.sprint30m.attempt3}
          best={athlete.bestSprint30m}
          format={formatSprint}
        />
        <AttemptRow
          label="Vertical jump (power)"
          a1={athlete.verticalJump.attempt1}
          a2={athlete.verticalJump.attempt2}
          a3={athlete.verticalJump.attempt3}
          best={athlete.bestVerticalJump}
          format={formatJump}
        />
        <AttemptRow
          label="Isometric mid-thigh pull (strength)"
          a1={athlete.midThighPull.attempt1}
          a2={athlete.midThighPull.attempt2}
          a3={athlete.midThighPull.attempt3}
          best={athlete.bestMidThighPull}
          format={formatForce}
        />
        <div className="rounded-md border border-border/80 bg-muted/30 p-3">
          <p className="text-sm font-medium">20m shuttle run (endurance)</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Level {athlete.shuttleRun.level ?? "—"} ·{" "}
            {athlete.shuttleRun.shuttlesAchieved ?? "—"} shuttles achieved
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Coach evaluation
        </h3>
        <div className="mt-2 space-y-3 text-sm">
          <div>
            <p className="font-medium text-foreground">Observations</p>
            <p className="text-muted-foreground">{athlete.coach.observations || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Strengths</p>
            <p className="text-muted-foreground">{athlete.coach.strengths || "—"}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Development areas</p>
            <p className="text-muted-foreground">{athlete.coach.developmentAreas || "—"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
