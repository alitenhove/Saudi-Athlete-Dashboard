import type { AthleteComputed, SortDir, SortKey } from "@/types/athlete";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatForce,
  formatJump,
  formatSprint,
} from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Pencil } from "lucide-react";

interface ResultsTableProps {
  rows: AthleteComputed[];
  search: string;
  onSearchChange: (v: string) => void;
  provinceFilter: string;
  onProvinceFilterChange: (v: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  provinces: string[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />;
  return dir === "asc" ? (
    <ArrowUp className="ml-1 h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="ml-1 h-3.5 w-3.5" />
  );
}

function ThSort({
  label,
  sortKey,
  current,
  dir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  return (
    <th className="px-3 py-2 text-left font-medium">
      <button
        type="button"
        className="inline-flex items-center text-xs uppercase tracking-wide hover:text-foreground"
        onClick={() => onSort(sortKey)}
      >
        {label}
        <SortIcon active={current === sortKey} dir={dir} />
      </button>
    </th>
  );
}

export function ResultsTable({
  rows,
  search,
  onSearchChange,
  provinceFilter,
  onProvinceFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortKey,
  sortDir,
  onSort,
  provinces,
  onView,
  onEdit,
}: ResultsTableProps) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>
          Search, filter, and sort athlete performance. Best scores are computed automatically from three attempts.
        </CardDescription>
        <div className="flex flex-col gap-3 pt-2 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Label htmlFor="search" className="text-xs">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Name, sport, province…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-44">
            <Label className="text-xs">Province</Label>
            <Select value={provinceFilter} onValueChange={onProvinceFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All provinces</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-44">
            <Label className="text-xs">Follow-up</Label>
            <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {(["High", "Medium", "Low", "None"] as const).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <ThSort
                label="Athlete"
                sortKey="name"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
                Sport
              </th>
              <ThSort
                label="30m best"
                sortKey="bestSprint30m"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <ThSort
                label="VJ best"
                sortKey="bestVerticalJump"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <ThSort
                label="IMTP best"
                sortKey="bestMidThighPull"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <ThSort
                label="Shuttle"
                sortKey="shuttleLevel"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <ThSort
                label="Follow-up"
                sortKey="followUp"
                current={sortKey}
                dir={sortDir}
                onSort={onSort}
              />
              <th className="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border/60 transition-colors hover:bg-muted/40"
              >
                <td className="px-3 py-2.5">
                  <div className="font-medium">{a.fullName}</div>
                  <div className="text-xs text-muted-foreground">{a.province}</div>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{a.primarySport}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatSprint(a.bestSprint30m)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatJump(a.bestVerticalJump)}</td>
                <td className="px-3 py-2.5 tabular-nums">{formatForce(a.bestMidThighPull)}</td>
                <td className="px-3 py-2.5 tabular-nums">
                  L{a.shuttleRun.level ?? "—"} / {a.shuttleRun.shuttlesAchieved ?? "—"}
                </td>
                <td className="px-3 py-2.5">
                  <Badge
                    variant={
                      a.coach.followUpPriority === "High"
                        ? "warning"
                        : a.coach.followUpPriority === "Medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {a.coach.followUpPriority}
                  </Badge>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(a.id)}
                      aria-label={`View ${a.fullName}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(a.id)}
                      aria-label={`Edit ${a.fullName}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No athletes match the current filters.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
