import type { PlaceFilter } from "@/features/places/types/place";
import { cn } from "@/lib/utils";

const filters: Array<{ label: string; value: PlaceFilter }> = [
  { label: "All", value: "all" },
  { label: "Must see", value: "must-see" },
  { label: "Planned", value: "planned" },
  { label: "Ideas", value: "idea" },
  { label: "Visited", value: "visited" },
];

type PlacesFiltersProps = {
  activeFilter: PlaceFilter;
  onFilterChange: (filter: PlaceFilter) => void;
};

export function PlacesFilters({
  activeFilter,
  onFilterChange,
}: PlacesFiltersProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-background p-1 shadow-xs" aria-label="Filter places">
      {filters.map((filter) => {
        const isActive = filter.value === activeFilter;

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
