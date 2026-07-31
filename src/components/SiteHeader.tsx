import { SOPC_PROGRAM_TITLE } from "@/constants/saudi";
import { cn } from "@/lib/utils";

export type AppView = "results" | "intake";

interface SiteHeaderProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export function SiteHeader({ activeView, onViewChange }: SiteHeaderProps) {
  return (
    <header className="border-b-4 border-white/90 bg-saudi-green text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <h1 className="text-center text-lg font-semibold tracking-tight sm:text-left sm:text-xl">
            {SOPC_PROGRAM_TITLE}
          </h1>
          <nav
            className="flex gap-1 rounded-md bg-white/10 p-1"
            aria-label="Main navigation"
          >
            <button
              type="button"
              onClick={() => onViewChange("results")}
              className={cn(
                "rounded px-4 py-2 text-sm font-medium transition-colors",
                activeView === "results"
                  ? "bg-white text-saudi-green"
                  : "text-white/95 hover:bg-white/15",
              )}
            >
              Scouting results
            </button>
            <button
              type="button"
              onClick={() => onViewChange("intake")}
              className={cn(
                "rounded px-4 py-2 text-sm font-medium transition-colors",
                activeView === "intake"
                  ? "bg-white text-saudi-green"
                  : "text-white/95 hover:bg-white/15",
              )}
            >
              Athlete intake
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
