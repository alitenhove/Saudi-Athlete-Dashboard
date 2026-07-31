import { useMemo, useState } from "react";
import { SAMPLE_ATHLETES } from "@/data/sampleAthletes";
import type { TargetSport } from "@/constants/saudi";
import {
  createEmptyAthlete,
  enrichAthletes,
  type Athlete,
} from "@/types/athlete";
import { SiteHeader, type AppView } from "@/components/SiteHeader";
import { SummaryCards } from "@/components/SummaryCards";
import { ResultsTable } from "@/components/ResultsTable";
import { AthleteProfile } from "@/components/AthleteProfile";
import { AthleteForm } from "@/components/AthleteForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportAthletesToCsv } from "@/lib/export";
import { synthesizeTestHistory } from "@/lib/testHistory";
import { Download } from "lucide-react";

export default function App() {
  const [view, setView] = useState<AppView>("results");
  const [athletes, setAthletes] = useState<Athlete[]>(() => [...SAMPLE_ATHLETES]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [sexFilter, setSexFilter] = useState("all");
  const [pathwayFilter, setPathwayFilter] = useState("all");
  const [profileId, setProfileId] = useState<string | null>(null);

  const [draft, setDraft] = useState<Athlete>(() => createEmptyAthlete());
  const [editingId, setEditingId] = useState<string | null>(null);

  const computed = useMemo(() => enrichAthletes(athletes), [athletes]);

  const regions = useMemo(
    () => [...new Set(computed.map((a) => a.region).filter(Boolean))].sort(),
    [computed],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = computed.filter((a) => {
      if (regionFilter !== "all" && a.region !== regionFilter) return false;
      if (sexFilter !== "all" && a.sex !== sexFilter) return false;
      if (
        pathwayFilter !== "all" &&
        !a.matchedSports.includes(pathwayFilter as TargetSport)
      ) {
        return false;
      }
      if (!q) return true;
      const hay =
        `${a.fullName} ${a.primarySport} ${a.region} ${a.matchedSports.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
    return [...list].sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [computed, search, regionFilter, sexFilter, pathwayFilter]);

  const profileAthlete = profileId
    ? (computed.find((a) => a.id === profileId) ?? null)
    : null;

  function resetIntakeForm() {
    setDraft(createEmptyAthlete());
    setEditingId(null);
  }

  function startEditFromProfile(id: string) {
    const raw = athletes.find((a) => a.id === id);
    if (!raw) return;
    setDraft({ ...raw });
    setEditingId(id);
    setProfileId(null);
    setView("intake");
  }

  function handleIntakeSubmit() {
    const now = new Date().toISOString();
    if (editingId) {
      setAthletes((prev) =>
        prev.map((a) => {
          if (a.id !== editingId) return a;
          const updated = {
            ...draft,
            id: editingId,
            createdAt: a.createdAt,
          };
          return {
            ...updated,
            testHistory: synthesizeTestHistory(updated),
          };
        }),
      );
    } else {
      const id = crypto.randomUUID();
      const created = { ...draft, id, createdAt: now };
      setAthletes((prev) => [
        ...prev,
        { ...created, testHistory: synthesizeTestHistory(created) },
      ]);
    }
    resetIntakeForm();
    setView("results");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-saudi-green/[0.04]">
      <SiteHeader activeView={view} onViewChange={setView} />

      {view === "results" && (
        <div className="border-b border-border/80 bg-card/80">
          <div className="mx-auto flex max-w-7xl justify-end px-4 py-3 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-saudi-green/30"
              onClick={() => exportAthletesToCsv(athletes)}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {view === "results" ? (
          <>
            <SummaryCards athletes={computed} />
            <ResultsTable
              rows={filtered}
              totalCount={computed.length}
              search={search}
              onSearchChange={setSearch}
              regionFilter={regionFilter}
              onRegionFilterChange={setRegionFilter}
              sexFilter={sexFilter}
              onSexFilterChange={setSexFilter}
              pathwayFilter={pathwayFilter}
              onPathwayFilterChange={setPathwayFilter}
              regions={regions}
              onView={setProfileId}
            />
          </>
        ) : (
          <AthleteForm
            draft={draft}
            onChange={setDraft}
            onSubmit={handleIntakeSubmit}
            onReset={resetIntakeForm}
            editingId={editingId}
          />
        )}
      </main>

      <Dialog
        open={profileId != null}
        onOpenChange={(o) => !o && setProfileId(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Athlete profile</DialogTitle>
          </DialogHeader>
          {profileAthlete && (
            <div className="space-y-4">
              <AthleteProfile athlete={profileAthlete} />
              <Button
                type="button"
                variant="outline"
                className="w-full border-saudi-green/30"
                onClick={() => startEditFromProfile(profileAthlete.id)}
              >
                Edit in intake form
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
