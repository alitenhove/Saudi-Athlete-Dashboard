import type { AthleteComputed } from "@/types/athlete";
import { TARGET_SPORTS } from "@/constants/saudi";
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
import { formatForce, formatJump, formatSprint } from "@/lib/utils";
import { formatShuttleCell } from "@/lib/athleteDisplay";
import { FollowUpBadge } from "@/components/FollowUpBadge";
import { Eye } from "lucide-react";

interface ResultsTableProps {
  rows: AthleteComputed[];
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  regionFilter: string;
  onRegionFilterChange: (v: string) => void;
  sexFilter: string;
  onSexFilterChange: (v: string) => void;
  pathwayFilter: string;
  onPathwayFilterChange: (v: string) => void;
  regions: string[];
  onView: (id: string) => void;
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
  pathwayFilter,
  onPathwayFilterChange,
  regions,
  onView,
}: ResultsTableProps) {
  return (
    <Card className="border-saudi-green/20 shadow-sm">
      <CardHeader>
        <CardTitle className="text-saudi-green">Scouting results</CardTitle>
        <CardDescription>
          Showing {rows.length} of {totalCount} athletes · pathway matches from
          testing battery
        </CardDescription>
        <div className="flex flex-col gap-3 pt-2 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="min-w-[200px] flex-1">
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
          <div className="w-full lg:w-36">
            <Label className="text-xs">Sex</Label>
            <Select value={sexFilter} onValueChange={onSexFilterChange}>
              <SelectTrigger>
                <SelectValue />
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
                <SelectValue />
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
          <div className="w-full lg:w-48">
            <Label className="text-xs">Pathway match</Label>
            <Select value={pathwayFilter} onValueChange={onPathwayFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pathway sports</SelectItem>
                {TARGET_SPORTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="max-h-[520px] overflow-y-auto rounded-md border">
          <table className="w-full min-w-[1020px] border-collapse text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
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
                <th className="px-3 py-2 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b hover:bg-saudi-green/[0.04]">
                  <td className="px-3 py-2 font-medium">{a.fullName}</td>
                  <td className="px-3 py-2 tabular-nums">{a.ageYears ?? "—"}</td>
                  <td className="px-3 py-2">{a.sex}</td>
                  <td className="px-3 py-2">{a.region}</td>
                  <td className="px-3 py-2">{a.primarySport}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {a.matchedSports.map((s) => (
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
                  <td className="px-3 py-2">
                    <FollowUpBadge
                      priority={a.coach.followUpPriority}
                      showLabel={false}
                    />
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatSprint(a.bestSprint30m)}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatJump(a.bestVerticalJump)}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatForce(a.bestMidThighPull)}
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatShuttleCell(
                      a.shuttleRun.level,
                      a.shuttleRun.shuttlesAchieved,
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(a.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
