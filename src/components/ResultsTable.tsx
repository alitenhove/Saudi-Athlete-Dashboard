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
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  regionFilter: string;
  onRegionFilterChange: (v: string) => void;
  sexFilter: string;
  onSexFilterChange: (v: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  regions: string[];
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
    <th className="sticky top-0 bg-card px-3 py-2 text-left font-medium">
      <button
        type="button"
        className="inline-flex items-center text-xs uppercase tracking-wide hover:text-sopc-green"
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
  totalCount,
  search,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  sexFilter,
  onSexFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  sortKey,
  sortDir,
  onSort,
  regions,
  onView,
  onEdit,
}: ResultsTableProps) {
  return (
    <Card className="border-sopc-green/15 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sopc-green">Scouting results</CardTitle>
        <CardDescription>
          Showing {rows.length} of {totalCount} athletes · pathway matches from testing battery
        </CardDescription>
        <div className="flex flex-col gap-3 pt-2 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Label htmlFor="search" className="text-xs">
              Search
            </Label>
            <Input
              id="search"
              placeholder="Name, sport, region…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="w-full lg:w-40">
            <Label className="text-xs">Sex</Label>
            <Select value={sexFilter} onValueChange={onSexFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-44">
            <Label className="text-xs">Region</Label>
            <Select value={regionFilter} onValueChange={onRegionFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full lg:w-40">
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
        <div className="max-h-[520px] overflow-y-auto rounded-md border border-border/80">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground">
                <ThSort
                  label="Athlete"
                  sortKey="name"
                  current={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                <ThSort
                  label="Sex"
                  sortKey="sex"
                  current={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                <th className="sticky top-0 bg-muted/50 px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
                  Region
                </th>
                <th className="sticky top-0 bg-muted/50 px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
                  Current sport
                </th>
                <th className="sticky top-0 bg-muted/50 px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
                  Pathway match
                </th>
                <ThSort
                  label="30m"
                  sortKey="bestSprint30m"
                  current={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                <ThSort
                  label="VJ"
                  sortKey="bestVerticalJump"
                  current={sortKey}
                  dir={sortDir}
                  onSort={onSort}
                />
                <ThSort
                  label="IMTP"
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
                <th className="sticky top-0 bg-muted/50 px-3 py-2 text-right text-xs font-medium uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-border/60 transition-colors hover:bg-sopc-green/[0.04]"
                >
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{a.fullName}</div>
                    <div className="text-xs text-muted-foreground">{a.id}</div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{a.sex}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{a.region}</td>
                  <td className="px-3 py-2.5">{a.primarySport}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {a.matchedSports.map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="border-sopc-gold/30 bg-sopc-green/5 text-xs font-normal text-foreground"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{formatSprint(a.bestSprint30m)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatJump(a.bestVerticalJump)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{formatForce(a.bestMidThighPull)}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    L{a.shuttleRun.level ?? "—"}/{a.shuttleRun.shuttlesAchieved ?? "—"}
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
        </div>
        {rows.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No athletes match the current filters.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
