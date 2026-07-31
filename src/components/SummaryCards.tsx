import type { AthleteComputed } from "@/types/athlete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Gauge, Timer, Users, VenusAndMars, Zap } from "lucide-react";
import {
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";

interface SummaryCardsProps {
  athletes: AthleteComputed[];
}

function avg(values: (number | null)[]): number | null {
  const v = values.filter((x): x is number => x != null);
  if (v.length === 0) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function SummaryCards({ athletes }: SummaryCardsProps) {
  const count = athletes.length;
  const male = athletes.filter((a) => a.sex === "Male").length;
  const female = athletes.filter((a) => a.sex === "Female").length;
  const highFollowUp = athletes.filter((a) => a.coach.followUpPriority === "High").length;
  const avgSprint = avg(athletes.map((a) => a.bestSprint30m));
  const avgJump = avg(athletes.map((a) => a.bestVerticalJump));
  const avgImtp = avg(athletes.map((a) => a.bestMidThighPull));

  const cards = [
    {
      title: "Athletes screened",
      value: String(count),
      desc: "National combine cohort",
      icon: Users,
    },
    {
      title: "Male / Female",
      value: `${male} / ${female}`,
      desc: "Gender breakdown",
      icon: VenusAndMars,
    },
    {
      title: "Priority follow-up",
      value: String(highFollowUp),
      desc: "High pathway interest",
      icon: Activity,
    },
    {
      title: "Avg 30m sprint",
      value: formatSprint(avgSprint),
      desc: "Speed · lower is better",
      icon: Timer,
    },
    {
      title: "Avg vertical jump",
      value: formatJump(avgJump),
      desc: "Power",
      icon: Zap,
    },
    {
      title: "Avg IMTP",
      value: formatForce(avgImtp),
      desc: "Strength",
      icon: Gauge,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <Card
          key={c.title}
          className="border-sopc-green/15 shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardDescription className="text-[11px] font-medium uppercase tracking-wide text-sopc-green">
                {c.title}
              </CardDescription>
              <CardTitle className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
                {c.value}
              </CardTitle>
            </div>
            <c.icon className="h-4 w-4 text-sopc-gold" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
