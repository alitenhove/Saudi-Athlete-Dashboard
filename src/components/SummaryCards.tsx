import type { AthleteComputed } from "@/types/athlete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SummaryCardsProps {
  athletes: AthleteComputed[];
}

export function SummaryCards({ athletes }: SummaryCardsProps) {
  const count = athletes.length;
  const male = athletes.filter((a) => a.sex === "Male").length;
  const female = athletes.filter((a) => a.sex === "Female").length;
  const highFollowUp = athletes.filter(
    (a) => a.coach.followUpPriority === "High",
  ).length;

  const cards = [
    {
      title: "Athletes screened",
      value: String(count),
      desc: "National combine cohort",
    },
    {
      title: "Male / Female",
      value: `${male} / ${female}`,
      desc: "Gender breakdown",
    },
    {
      title: "Priority follow-up",
      value: String(highFollowUp),
      desc: "High pathway interest",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.title} className="border-saudi-green/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase tracking-wide text-saudi-green">
              {c.title}
            </CardDescription>
            <CardTitle className="mt-2 text-3xl tabular-nums text-foreground">
              {c.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
