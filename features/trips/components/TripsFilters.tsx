import type { TripFilter } from "@/features/trips/types/trip";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: TripFilter }> = [
  { label: "All", value: "all" },
  { label: "Planning", value: "planning" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Archived", value: "archived" },
];

type TripsFiltersProps = {
  activeFilter: TripFilter;
  onFilterChange: (filter: TripFilter) => void;
};

export function TripsFilters({
  activeFilter,
  onFilterChange,
}: TripsFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-background p-1 shadow-xs" aria-label="Filter trips">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "h-9 shrink-0 rounded-lg px-4 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              isActive
                ? "bg-surface-elevated text-foreground shadow-sm"
                : "text-muted hover:text-foreground",
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
