import type { AthleteComputed } from "@/types/athlete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Gauge, Timer, Users, Zap } from "lucide-react";
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
  const highFollowUp = athletes.filter((a) => a.coach.followUpPriority === "High").length;
  const avgSprint = avg(athletes.map((a) => a.bestSprint30m));
  const avgJump = avg(athletes.map((a) => a.bestVerticalJump));
  const avgImtp = avg(athletes.map((a) => a.bestMidThighPull));

  const cards = [
    {
      title: "Athletes tested",
      value: String(count),
      desc: "Registered at this event session",
      icon: Users,
    },
    {
      title: "High follow-up",
      value: String(highFollowUp),
      desc: "Flagged for NSO / pathway review",
      icon: Activity,
    },
    {
      title: "Avg best 30m sprint",
      value: formatSprint(avgSprint),
      desc: "Speed · lower is better",
      icon: Timer,
    },
    {
      title: "Avg best vertical jump",
      value: formatJump(avgJump),
      desc: "Power · cm",
      icon: Zap,
    },
    {
      title: "Avg best IMTP",
      value: formatForce(avgImtp),
      desc: "Isometric mid-thigh pull",
      icon: Gauge,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((c) => (
        <Card key={c.title} className="shadow-none">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardDescription className="text-xs uppercase tracking-wide">
                {c.title}
              </CardDescription>
              <CardTitle className="mt-2 text-2xl font-semibold tabular-nums">
                {c.value}
              </CardTitle>
            </div>
            <c.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
