import type { AthleteComputed } from "@/types/athlete";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

function priorityVariant(p: string): "warning" | "secondary" | "outline" | "success" {
  if (p === "High") return "warning";
  if (p === "Medium") return "secondary";
  if (p === "Low") return "outline";
  return "outline";
}

export function AthleteProfile({ athlete }: AthleteProfileProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{athlete.fullName}</h2>
          <Badge variant={priorityVariant(athlete.coach.followUpPriority)}>
            {athlete.coach.followUpPriority} follow-up
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {athlete.region} · {athlete.primarySport} · {athlete.sex} · Tested {athlete.eventDate}
        </p>
      </div>

      <Separator />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pathway match
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {athlete.matchedSports.map((s) => (
            <Badge key={s} className="bg-sopc-green/10 text-foreground">
              {s}
            </Badge>
          ))}
        </div>
      </section>

      <Separator />

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Profile
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
            <dt className="text-muted-foreground">Sex</dt>
            <dd>{athlete.sex}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Height</dt>
            <dd>{athlete.heightCm != null ? `${athlete.heightCm} cm` : "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Weight</dt>
            <dd>{athlete.weightKg != null ? `${athlete.weightKg} kg` : "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Testing battery
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
          Coach assessment
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
          <div>
            <p className="font-medium text-foreground">Sport referral</p>
            <p className="text-muted-foreground">{athlete.coach.sportReferral}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
