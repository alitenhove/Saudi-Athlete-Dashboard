import { useMemo, useState } from "react";
import type { TestHistoryPoint } from "@/types/athlete";
import {
  formatForce,
  formatJump,
  formatSprint,
  cn,
} from "@/lib/utils";

type MetricKey = "sprint" | "jump" | "imtp" | "shuttle";

const METRICS: {
  key: MetricKey;
  label: string;
  hint: string;
  get: (p: TestHistoryPoint) => number | null;
  format: (v: number | null) => string;
  lowerIsBetter?: boolean;
}[] = [
  {
    key: "sprint",
    label: "30m sprint",
    hint: "Lower is better",
    get: (p) => p.bestSprint30m,
    format: formatSprint,
    lowerIsBetter: true,
  },
  {
    key: "jump",
    label: "Vertical jump",
    hint: "Higher is better",
    get: (p) => p.bestVerticalJump,
    format: formatJump,
  },
  {
    key: "imtp",
    label: "IMTP",
    hint: "Higher is better",
    get: (p) => p.bestMidThighPull,
    format: formatForce,
  },
  {
    key: "shuttle",
    label: "Shuttle level",
    hint: "Higher is better",
    get: (p) => p.shuttleLevel,
    format: (v) => (v != null ? `L${v}` : "—"),
  },
];

interface AthleteProgressChartProps {
  history: TestHistoryPoint[];
  athleteName: string;
}

export function AthleteProgressChart({
  history,
  athleteName,
}: AthleteProgressChartProps) {
  const [metricKey, setMetricKey] = useState<MetricKey>("sprint");
  const metric = METRICS.find((m) => m.key === metricKey)!;

  const points = useMemo(() => {
    return history
      .map((h) => ({
        year: h.year,
        value: metric.get(h),
      }))
      .filter((p) => p.value != null) as { year: number; value: number }[];
  }, [history, metric]);

  const chart = useMemo(() => {
    const w = 420;
    const h = 200;
    const pad = { t: 16, r: 16, b: 36, l: 48 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;

    if (points.length === 0) {
      return { w, h, pad, innerW, innerH, coords: [], yMin: 0, yMax: 1 };
    }

    const values = points.map((p) => p.value);
    let yMin = Math.min(...values);
    let yMax = Math.max(...values);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
    const yPad = (yMax - yMin) * 0.12;
    yMin -= yPad;
    yMax += yPad;

    const years = points.map((p) => p.year);
    const xMin = Math.min(...years);
    const xMax = Math.max(...years);
    const xSpan = xMax - xMin || 1;

    const coords = points.map((p) => {
      const x = pad.l + ((p.year - xMin) / xSpan) * innerW;
      const y = pad.t + innerH - ((p.value - yMin) / (yMax - yMin)) * innerH;
      return { ...p, x, y };
    });

    return { w, h, pad, innerW, innerH, coords, yMin, yMax };
  }, [points]);

  const linePath =
    chart.coords.length > 0
      ? chart.coords
          .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
          .join(" ")
      : "";

  const first = points[0];
  const last = points[points.length - 1];
  let trendLabel = "—";
  if (first && last && first.value !== last.value) {
    const improved = metric.lowerIsBetter
      ? last.value < first.value
      : last.value > first.value;
    const pct =
      metric.lowerIsBetter
        ? ((first.value - last.value) / first.value) * 100
        : ((last.value - first.value) / first.value) * 100;
    trendLabel = `${improved ? "↑" : "↓"} ${Math.abs(pct).toFixed(1)}% since ${first.year}`;
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Year-over-year tracking
          </h3>
          <p className="text-xs text-muted-foreground">
            {athleteName} · combine bests by calendar year
          </p>
        </div>
        <p className="text-xs font-medium text-saudi-green">{trendLabel}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMetricKey(m.key)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
              metricKey === m.key
                ? "border-saudi-green bg-saudi-green text-white"
                : "border-border bg-background hover:bg-muted/60",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">{metric.hint}</p>

      <div className="overflow-x-auto rounded-md border border-border/80 bg-card p-2">
        <svg
          viewBox={`0 0 ${chart.w} ${chart.h}`}
          className="mx-auto h-[200px] w-full max-w-lg"
          role="img"
          aria-label={`${metric.label} progress by year`}
        >
          {chart.coords.length > 0 && (
            <>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = chart.pad.t + chart.innerH * (1 - t);
                const val = chart.yMin + (chart.yMax - chart.yMin) * t;
                return (
                  <g key={t}>
                    <line
                      x1={chart.pad.l}
                      x2={chart.pad.l + chart.innerW}
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      strokeOpacity={0.08}
                    />
                    <text
                      x={chart.pad.l - 6}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-muted-foreground text-[10px]"
                    >
                      {metric.format(val)}
                    </text>
                  </g>
                );
              })}
              <path
                d={linePath}
                fill="none"
                stroke="hsl(152, 100%, 21%)"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {chart.coords.map((c) => (
                <g key={c.year}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={5}
                    fill="hsl(152, 100%, 21%)"
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={c.x}
                    y={chart.h - 10}
                    textAnchor="middle"
                    className="fill-foreground text-[11px] font-medium"
                  >
                    {c.year}
                  </text>
                  <text
                    x={c.x}
                    y={c.y - 10}
                    textAnchor="middle"
                    className="fill-[#006C35] text-[10px] font-semibold"
                  >
                    {metric.format(c.value)}
                  </text>
                </g>
              ))}
            </>
          )}
        </svg>
      </div>
    </section>
  );
}
