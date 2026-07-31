import { useMemo, useState } from "react";
import { SAMPLE_ATHLETES } from "@/data/sampleAthletes";
import {
  createEmptyAthlete,
  enrichAthletes,
  type Athlete,
  type SortDir,
  type SortKey,
} from "@/types/athlete";
import { SiteHeader } from "@/components/SiteHeader";
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
  a: ReturnType<typeof enrichAthletes>[number],
  b: ReturnType<typeof enrichAthletes>[number],
  key: SortKey,
  dir: SortDir,
): number {
  const mul = dir === "asc" ? 1 : -1;
  switch (key) {
    case "name":
      return mul * a.fullName.localeCompare(b.fullName);
    case "sex":
      return mul * a.sex.localeCompare(b.sex);
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
  const [regionFilter, setRegionFilter] = useState("all");
  const [sexFilter, setSexFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [profileId, setProfileId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const computed = useMemo(() => enrichAthletes(athletes), [athletes]);

  const regions = useMemo(
    () => [...new Set(athletes.map((a) => a.region).filter(Boolean))].sort(),
    [athletes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = computed.filter((a) => {
      if (regionFilter !== "all" && a.region !== regionFilter) return false;
      if (sexFilter !== "all" && a.sex !== sexFilter) return false;
      if (
        priorityFilter !== "all" &&
        a.coach.followUpPriority !== priorityFilter
      ) {
        return false;
      }
      if (!q) return true;
      const hay =
        `${a.fullName} ${a.primarySport} ${a.region} ${a.matchedSports.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
    list = [...list].sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return list;
  }, [computed, search, regionFilter, sexFilter, priorityFilter, sortKey, sortDir]);

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
    setShowForm(false);
  }

  function startEdit(id: string) {
    const found = athletes.find((a) => a.id === id);
    if (!found) return;
    setDraft(structuredClone(found));
    setEditingId(id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-sopc-green/[0.03]">
      <SiteHeader />

      <div className="border-b border-border/80 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-end gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-sopc-green/30"
            onClick={() => exportTestingTemplateCsv()}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Template
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-sopc-green/30"
            onClick={() => exportAthletesToCsv(athletes)}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-sopc-green/30"
            onClick={() => printAllSummaries(athletes)}
          >
            <Printer className="h-4 w-4" />
            Print roster
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-sopc-green hover:bg-sopc-green-dark"
            onClick={() => {
              resetForm();
              setShowForm((v) => !v);
            }}
          >
            {showForm ? "Hide entry form" : "Add athlete"}
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <SummaryCards athletes={computed} />

        {showForm && (
          <AthleteForm
            draft={draft}
            onChange={setDraft}
            onSubmit={handleSubmit}
            onReset={resetForm}
            editingId={editingId}
          />
        )}

        <ResultsTable
          rows={filtered}
          totalCount={computed.length}
          search={search}
          onSearchChange={setSearch}
          regionFilter={regionFilter}
          onRegionFilterChange={setRegionFilter}
          sexFilter={sexFilter}
          onSexFilterChange={setSexFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          regions={regions}
          onView={setProfileId}
          onEdit={startEdit}
        />
      </main>

      <footer className="border-t border-sopc-green/10 py-5 text-center text-xs text-muted-foreground">
        SOPC National Scouting Program · demo dataset · push updates via GitHub Desktop to refresh the live site
      </footer>

      <Dialog open={profileId != null} onOpenChange={(o) => !o && setProfileId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Athlete profile</DialogTitle>
            <DialogDescription>
              Testing summary, pathway matches, and coach notes.
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
                    if (raw) printAthleteSummary(raw, profileAthlete.matchedSports);
                  }}
                >
                  <Printer className="h-4 w-4" />
                  Print summary
                </Button>
                <Button
                  type="button"
                  className="bg-sopc-green hover:bg-sopc-green-dark"
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
