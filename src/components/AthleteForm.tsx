import type { Athlete, ThreeAttempts } from "@/types/athlete";
import {
  bestMidThighPullN,
  bestSprintSeconds,
  bestVerticalJumpCm,
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AthleteFormProps {
  draft: Athlete;
  onChange: (next: Athlete) => void;
  onSubmit: () => void;
  onReset: () => void;
  editingId: string | null;
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function AttemptInputs({
  label,
  unit,
  attempts,
  onChange,
  bestLabel,
  best,
  formatBest,
}: {
  label: string;
  unit: string;
  attempts: ThreeAttempts;
  onChange: (a: ThreeAttempts) => void;
  bestLabel: string;
  best: number | null;
  formatBest: (v: number | null) => string;
}) {
  const keys: (keyof ThreeAttempts)[] = ["attempt1", "attempt2", "attempt3"];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">
          {bestLabel}: <strong className="text-foreground">{formatBest(best)}</strong>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k, i) => (
          <div key={k}>
            <Label className="text-xs text-muted-foreground">Attempt {i + 1}</Label>
            <Input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder={unit}
              value={attempts[k] ?? ""}
              onChange={(e) =>
                onChange({ ...attempts, [k]: parseNum(e.target.value) })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AthleteForm({
  draft,
  onChange,
  onSubmit,
  onReset,
  editingId,
}: AthleteFormProps) {
  const bestSprint = bestSprintSeconds([
    draft.sprint30m.attempt1,
    draft.sprint30m.attempt2,
    draft.sprint30m.attempt3,
  ]);
  const bestVj = bestVerticalJumpCm([
    draft.verticalJump.attempt1,
    draft.verticalJump.attempt2,
    draft.verticalJump.attempt3,
  ]);
  const bestImtp = bestMidThighPullN([
    draft.midThighPull.attempt1,
    draft.midThighPull.attempt2,
    draft.midThighPull.attempt3,
  ]);

  const canSave =
    draft.firstName.trim() !== "" && draft.lastName.trim() !== "";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{editingId ? "Edit athlete record" : "Register & test athlete"}</CardTitle>
        <CardDescription>
          Enter demographics, three attempts per station (where applicable), shuttle results, and coach notes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="coach">Coach</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={draft.firstName}
                  onChange={(e) => onChange({ ...draft, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={draft.lastName}
                  onChange={(e) => onChange({ ...draft, lastName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Event date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={draft.eventDate}
                  onChange={(e) => onChange({ ...draft, eventDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={draft.dateOfBirth}
                  onChange={(e) => onChange({ ...draft, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <Label>Sex</Label>
                <Select
                  value={draft.sex}
                  onValueChange={(v) =>
                    onChange({ ...draft, sex: v as Athlete["sex"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Female", "Male", "Non-binary", "Prefer not to say"] as const).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="province">Province / region</Label>
                <Input
                  id="province"
                  value={draft.province}
                  onChange={(e) => onChange({ ...draft, province: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sport">Primary sport</Label>
                <Input
                  id="sport"
                  value={draft.primarySport}
                  onChange={(e) => onChange({ ...draft, primarySport: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={draft.heightCm ?? ""}
                    onChange={(e) =>
                      onChange({ ...draft, heightCm: parseNum(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={draft.weightKg ?? ""}
                    onChange={(e) =>
                      onChange({ ...draft, weightKg: parseNum(e.target.value) })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-6">
            <AttemptInputs
              label="30m sprint — speed"
              unit="s"
              attempts={draft.sprint30m}
              onChange={(sprint30m) => onChange({ ...draft, sprint30m })}
              bestLabel="Best (min time)"
              best={bestSprint}
              formatBest={formatSprint}
            />
            <AttemptInputs
              label="Vertical jump — power"
              unit="cm"
              attempts={draft.verticalJump}
              onChange={(verticalJump) => onChange({ ...draft, verticalJump })}
              bestLabel="Best (max height)"
              best={bestVj}
              formatBest={formatJump}
            />
            <AttemptInputs
              label="Isometric mid-thigh pull — strength"
              unit="N"
              attempts={draft.midThighPull}
              onChange={(midThighPull) => onChange({ ...draft, midThighPull })}
              bestLabel="Best (max force)"
              best={bestImtp}
              formatBest={formatForce}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="level">20m shuttle — level reached</Label>
                <Input
                  id="level"
                  type="number"
                  value={draft.shuttleRun.level ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      shuttleRun: {
                        ...draft.shuttleRun,
                        level: parseNum(e.target.value),
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="shuttles">Shuttle achieved (within level)</Label>
                <Input
                  id="shuttles"
                  type="number"
                  value={draft.shuttleRun.shuttlesAchieved ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      shuttleRun: {
                        ...draft.shuttleRun,
                        shuttlesAchieved: parseNum(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coach" className="space-y-4">
            <div>
              <Label htmlFor="obs">Observations</Label>
              <Textarea
                id="obs"
                value={draft.coach.observations}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    coach: { ...draft.coach, observations: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="str">Strengths</Label>
              <Textarea
                id="str"
                value={draft.coach.strengths}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    coach: { ...draft.coach, strengths: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="dev">Development areas</Label>
              <Textarea
                id="dev"
                value={draft.coach.developmentAreas}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    coach: { ...draft.coach, developmentAreas: e.target.value },
                  })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Sport referral</Label>
                <Select
                  value={draft.coach.sportReferral}
                  onValueChange={(v) =>
                    onChange({
                      ...draft,
                      coach: {
                        ...draft.coach,
                        sportReferral: v as Athlete["coach"]["sportReferral"],
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "None",
                        "Track & Field",
                        "Soccer",
                        "Basketball",
                        "Rugby",
                        "Hockey",
                        "Multi-sport",
                      ] as const
                    ).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Follow-up priority</Label>
                <Select
                  value={draft.coach.followUpPriority}
                  onValueChange={(v) =>
                    onChange({
                      ...draft,
                      coach: {
                        ...draft.coach,
                        followUpPriority: v as Athlete["coach"]["followUpPriority"],
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["High", "Medium", "Low", "None"] as const).map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" disabled={!canSave} onClick={onSubmit}>
            {editingId ? "Save changes" : "Add athlete"}
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            {editingId ? "Cancel edit" : "Clear form"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
