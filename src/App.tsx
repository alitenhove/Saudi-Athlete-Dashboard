import { useMemo, useState } from "react";
import { SAMPLE_ATHLETES } from "@/data/sampleAthletes";
import {
  computeAthlete,
  createEmptyAthlete,
  type Athlete,
  type SortDir,
  type SortKey,
} from "@/types/athlete";
import { SummaryCards } from "@/components/SummaryCards";
import { AthleteForm } from "@/components/AthleteForm";
import { ResultsTable } from "@/components/ResultsTable";
import { AthleteProfile } from "@/components/AthleteProfile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  exportAthletesToCsv,
  exportTestingTemplateCsv,
  printAllSummaries,
  printAthleteSummary,
} from "@/lib/export";
import { Download, FileSpreadsheet, Printer } from "lucide-react";

const FOLLOW_ORDER = { High: 0, Medium: 1, Low: 2, None: 3 };

function compareRows(
  a: ReturnType<typeof computeAthlete>,
  b: ReturnType<typeof computeAthlete>,
  key: SortKey,
  dir: SortDir,
): number {
  const mul = dir === "asc" ? 1 : -1;
  switch (key) {
    case "name":
      return mul * a.fullName.localeCompare(b.fullName);
    case "bestSprint30m": {
      const av = a.bestSprint30m ?? Infinity;
      const bv = b.bestSprint30m ?? Infinity;
      return mul * (av - bv);
    }
    case "bestVerticalJump": {
      const av = a.bestVerticalJump ?? -Infinity;
      const bv = b.bestVerticalJump ?? -Infinity;
      return mul * (av - bv);
    }
    case "bestMidThighPull": {
      const av = a.bestMidThighPull ?? -Infinity;
      const bv = b.bestMidThighPull ?? -Infinity;
      return mul * (av - bv);
    }
    case "shuttleLevel": {
      const av = a.shuttleRun.level ?? -Infinity;
      const bv = b.shuttleRun.level ?? -Infinity;
      return mul * (av - bv);
    }
    case "followUp":
      return (
        mul *
        (FOLLOW_ORDER[a.coach.followUpPriority] -
          FOLLOW_ORDER[b.coach.followUpPriority])
      );
    default:
      return 0;
  }
}

export default function App() {
  const [athletes, setAthletes] = useState<Athlete[]>(() => [...SAMPLE_ATHLETES]);
  const [draft, setDraft] = useState<Athlete>(() => createEmptyAthlete());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [profileId, setProfileId] = useState<string | null>(null);

  const computed = useMemo(() => athletes.map(computeAthlete), [athletes]);

  const provinces = useMemo(
    () =>
      [...new Set(athletes.map((a) => a.province).filter(Boolean))].sort(),
    [athletes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = computed.filter((a) => {
      if (provinceFilter !== "all" && a.province !== provinceFilter) return false;
      if (
        priorityFilter !== "all" &&
        a.coach.followUpPriority !== priorityFilter
      ) {
        return false;
      }
      if (!q) return true;
      const hay = `${a.fullName} ${a.primarySport} ${a.province} ${a.coach.sportReferral}`.toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return list;
  }, [computed, search, provinceFilter, priorityFilter, sortKey, sortDir]);

  const profileAthlete = profileId
    ? computed.find((a) => a.id === profileId) ?? null
    : null;

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "bestSprint30m" ? "asc" : "desc");
    }
  }

  function resetForm() {
    setDraft(createEmptyAthlete());
    setEditingId(null);
  }

  function handleSubmit() {
    if (!draft.firstName.trim() || !draft.lastName.trim()) return;
    if (editingId) {
      setAthletes((prev) =>
        prev.map((a) => (a.id === editingId ? { ...draft, id: editingId } : a)),
      );
    } else {
      setAthletes((prev) => [...prev, draft]);
    }
    resetForm();
  }

  function startEdit(id: string) {
    const found = athletes.find((a) => a.id === id);
    if (!found) return;
    setDraft(structuredClone(found));
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Talent identification · Field testing
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Athlete Fitness Testing Dashboard
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Speed (30m sprint), power (vertical jump), strength (isometric mid-thigh pull), and endurance (20m shuttle).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportTestingTemplateCsv()}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Blank template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportAthletesToCsv(athletes)}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => printAllSummaries(athletes)}
            >
              <Printer className="h-4 w-4" />
              Print roster
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <SummaryCards athletes={computed} />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <AthleteForm
            draft={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            onReset={resetForm}
            editingId={editingId}
          />
          <ResultsTable
            rows={filtered}
            search={search}
            onSearchChange={setSearch}
            provinceFilter={provinceFilter}
            onProvinceFilterChange={setProvinceFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            provinces={provinces}
            onView={setProfileId}
            onEdit={startEdit}
          />
        </div>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Session data is stored in-browser for this demo. Connect an API or database for production event workflows.
      </footer>

      <Dialog open={profileId != null} onOpenChange={(o) => !o && setProfileId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Athlete profile</DialogTitle>
            <DialogDescription>
              Detailed testing summary and coach assessment.
            </DialogDescription>
          </DialogHeader>
          {profileAthlete && (
            <>
              <AthleteProfile athlete={profileAthlete} />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const raw = athletes.find((a) => a.id === profileAthlete.id);
                    if (raw) printAthleteSummary(raw);
                  }}
                >
                  <Printer className="h-4 w-4" />
                  Print summary
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setProfileId(null);
                    startEdit(profileAthlete.id);
                  }}
                >
                  Edit record
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
